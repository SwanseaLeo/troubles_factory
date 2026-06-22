---
title: "Fix YOLO26 ONNX opset 18 TensorRT 8.5 Concat Shape Mismatch on node_cat_25"
pubDate: 06/22/2026 10:00
author: "Leo"
tags:
  - YOLO
  - ONNX
  - TensorRT
  - PyTorch
  - Troubleshooting
imgUrl: '../../assets/opset18_tensorrt8.5.png'
description: "TensorRT 8.5.2 fails building a YOLO26 ONNX opset 18 engine when Concat node_cat_25 sees [1,1,1] instead of [batch,8400,1]. Fix the export post-processing."
---

## Fix YOLO26 ONNX opset 18 TensorRT 8.5 Concat Shape Mismatch on node_cat_25

When you export **YOLO26** to **ONNX opset 18** and build a `.engine` with **TensorRT 8.5.2**, `trtexec` or the TensorRT parser may stop on a `Concat` node and print a shape conflict like this:

```text
[E] [TRT] ModelImporter.cpp:728: input: "slice_2"
input: "getitem_62"
input: "_to_copy"
output: "output"
name: "node_cat_25"
op_type: "Concat"
attribute {
  name: "axis"
  i: -1
  type: INT
}
```

The short answer: TensorRT 8.5.2 is mis-inferring the output shapes of `ReduceMax` / `ArgMax` nodes in your detection-head post-processing. Rewrite the export wrapper to avoid those ops — use direct tensor assignment for single-class models and `torch.topk` for multi-class — then re-export ONNX.

### When this shows up

You are likely hitting this if:

- PyTorch inference works, but `trtexec --onnx=model.onnx` fails during ONNX import
- The failing node is a `Concat` near the model output, often named `node_cat_*`
- TensorRT logs show one input as `[-1, 8400, 4]` and the others as `[1, 1, 1]`
- You exported with **opset 18** and are building on **TensorRT 8.5.x** (released before opset 18)
- The model is a YOLO-style detector with a custom `DeepStreamOutput` or similar post-processing head

Common stack:

- **Ultralytics YOLO26** (or YOLOv8/v11 family) custom export script
- **PyTorch 2.x** `torch.onnx.export` or Dynamo exporter
- **TensorRT 8.5.2** on Ubuntu 20.04/22.04 with CUDA 11.x
- Deployment targets: DeepStream, Triton, or standalone `trtexec`

### Environment and versions

| Component | Example version |
|-----------|-----------------|
| Model | YOLO26 detection head, 640×640 input |
| ONNX opset | **18** |
| TensorRT | **8.5.2** |
| Candidate count | 8400 (= 80² + 40² + 20²) |

TensorRT 8.5 predates ONNX opset 18. Opset 18 changed how several reduction ops represent their `axes` argument — from a node **attribute** to a second **input tensor**. That difference matters when TensorRT walks the graph and infers intermediate shapes.

### What the export code is trying to do

A typical YOLO26 DeepStream export wrapper transposes the detection head output, splits boxes from class scores, reduces over the class dimension, and concatenates:

```python
def forward(self, x):
    x = x.transpose(1, 2)                          # [B, 4+C, 8400] → [B, 8400, 4+C]
    boxes = x[:, :, :4]                            # [B, 8400, 4]
    scores, labels = torch.max(x[:, :, 4:], dim=-1, keepdim=True)  # [B, 8400, 1] each
    return torch.cat([boxes, scores, labels.to(boxes.dtype)], dim=-1)  # [B, 8400, 6]
```

For a single-class model (`C=1`), the detection head feeds `[B, 5, 8400]`. After transpose:

```text
boxes        = [B, 8400, 4]
class_scores = [B, 8400, 1]
scores       = [B, 8400, 1]   # ReduceMax over axis=-1, keepdims=1
labels       = [B, 8400, 1]   # ArgMax over axis=-1, keepdims=1
output       = [B, 8400, 6]   # [x1, y1, x2, y2, confidence, class_id]
```

ONNX represents `torch.max(..., dim=-1, keepdim=True)` as roughly:

```text
scores ← ReduceMax(class_scores, axes=[-1], keepdims=1)
labels ← ArgMax(class_scores, axes=[-1], keepdims=1)
```

With `keepdims=1`, the reduced class dimension stays at size 1. The 8400 candidate dimension must survive untouched.

### Why TensorRT reports [1, 1, 1]

During engine build, TensorRT shape inference may log:

```text
Input 0 shape: [-1, 8400, 4]    # boxes — correct
Input 1 shape: [1, 1, 1]        # scores — wrong
Input 2 shape: [1, 1, 1]        # labels — wrong
```

`Concat` along `axis=-1` (axis 2) requires all non-concat dimensions to match. Batch `-1` vs `1` can work in dynamic-batch mode, but **8400 vs 1** on dimension 1 is a hard failure — that is what triggers the `node_cat_25` error.

The `[1, 1, 1]` shape is not what your PyTorch code intends. It is what TensorRT 8.5.2 infers after parsing the ONNX graph. The error lives in the ONNX-to-TensorRT shape-resolution chain, not necessarily in the ONNX file's stored value_info (see the diagnostic step below).

#### opset 13 vs opset 18: why axes matter

In **opset 13**, `ReduceMax` carries `axes` as a node attribute:

```text
ReduceMax(data, axes=[-1], keepdims=1)
```

In **opset 18**, `axes` becomes a second input tensor:

```text
axes = Constant([-1])
ReduceMax(data, axes, keepdims=1)
```

TensorRT 8.5.2 was not built for this pattern. Combined with dynamic batch, `keepdims`, a follow-up `Expand` (from `labels.to(dtype).expand_as(scores)`), and the final `Concat`, the parser can collapse the 8400 dimension and produce `[1, 1, 1]`.

The third Concat input `_to_copy` is the dtype cast `labels.to(boxes.dtype)`. An `Expand` node may also appear (`Expand_output_0`) when the exporter tries to broadcast labels to match scores — but if scores are already wrong at `[1, 1, 1]`, Expand propagates the bad shape instead of fixing it.

### Confirm where the shape breaks

Run ONNX shape inference on the exported model before blaming TensorRT alone:

```bash
python3 - <<'PY'
import onnx
from onnx import shape_inference

path = "best.onnx"  # your exported model
model = shape_inference.infer_shapes(onnx.load(path))

shapes = {}
for value in list(model.graph.value_info) + list(model.graph.output):
    dims = []
    for d in value.type.tensor_type.shape.dim:
        dims.append(d.dim_param or d.dim_value or "?")
    shapes[value.name] = dims

for node in model.graph.node:
    if node.op_type in {"Slice", "ReduceMax", "ArgMax", "Expand", "Concat"}:
        print(f"\n{node.op_type}: {node.name}")
        for name in node.input:
            print(" input :", name, shapes.get(name, "<unknown>"))
        for name in node.output:
            print(" output:", name, shapes.get(name, "<unknown>"))
PY
```

How to read the output:

| ONNX inference | TensorRT build | Likely cause |
|----------------|----------------|--------------|
| `[batch, 8400, 1]` | `[1, 1, 1]` | TensorRT 8.5 parser incompatibility with opset 18 reduction ops |
| `[1, 1, 1]` | `[1, 1, 1]` | Shape already wrong in the exported ONNX graph |
| ONNX Runtime outputs `[B, 8400, 6]` for batch 1 and 16 | TensorRT fails | Model semantics are fine; TensorRT parsing is the problem |

### Fix: rewrite the export post-processing

Avoid `torch.max` (and therefore `ReduceMax` / `ArgMax` / `Expand`) in the ONNX export path.

#### Single-class models

When `C=1`, `max` and `argmax` are redundant — the only class score is already the confidence, and the label is always `0`:

```python
def forward(self, x):
    x = x.transpose(1, 2)
    boxes = x[:, :, :4]
    class_scores = x[:, :, 4:]          # [B, 8400, 1]

    scores = class_scores              # Identity — no ReduceMax
    labels = class_scores * 0.0        # Mul by zero → float 0.0, keeps [B, 8400, 1]

    return torch.cat([boxes, scores, labels], dim=-1)
```

This removes `ReduceMax`, `ArgMax`, and `Expand` from the ONNX graph. TensorRT only sees `Slice`, `Mul`, and `Concat` — shapes stay `[B, 8400, *]` throughout.

#### Multi-class models

Use `torch.topk` instead of `torch.max`. Semantics are the same (highest class score and its index), but ONNX expresses it as `TopK`, which TensorRT 8.5 handles more reliably:

```python
def forward(self, x):
    x = x.transpose(1, 2)
    boxes = x[:, :, :4]
    class_scores = x[:, :, 4:]

    scores, labels = torch.topk(class_scores, k=1, dim=-1)  # [B, 8400, 1] each
    labels = labels.to(boxes.dtype)

    return torch.cat([boxes, scores, labels], dim=-1)
```

### Re-export and build the engine

Wire the updated `forward` into your existing export script and re-run `torch.onnx.export`, keeping opset 18 if your runtime requires it:

```python
import torch

dummy_input = torch.zeros(1, 3, 640, 640)
torch.onnx.export(
    model_with_updated_forward,  # wrapper with the fix above
    dummy_input,
    "best.onnx",
    opset_version=18,
    input_names=["images"],
    output_names=["output"],
    dynamic_axes={"images": {0: "batch"}, "output": {0: "batch"}},
)
```

Verify with ONNX Runtime first:

```bash
python3 -c "
import onnxruntime as ort
import numpy as np
sess = ort.InferenceSession('best.onnx')
out = sess.run(None, {sess.get_inputs()[0].name: np.zeros((1,3,640,640), np.float32)})[0]
print('output shape:', out.shape)  # expect (1, 8400, 6)
"
```

Then build with TensorRT:

```bash
trtexec --onnx=best.onnx --saveEngine=best.engine --fp16
```

If import succeeds, the `node_cat_25` Concat error is resolved.

### Alternative approaches

These also work but change your constraints:

- **Lower the ONNX opset** to 13 or 17 so `axes` stays an attribute. Test whether TensorRT 8.5.2 parses the graph correctly at the lower opset.
- **Upgrade TensorRT** to 8.6+ or TensorRT 10.x, which ship better opset 18 support.
- **Export without post-processing** and run `max`/`argmax`/`concat` in CPU/GPU code outside the engine (common in DeepStream custom parsers).

Downgrading opset or upgrading TensorRT is often easier in greenfield projects. Rewriting the export wrapper is the better fix when you are pinned to TensorRT 8.5.2 and opset 18.

### FAQ

#### What does the TensorRT error on node_cat_25 actually mean?

TensorRT found a `Concat` node whose inputs have incompatible shapes on a non-concat axis. Here, `boxes` is `[-1, 8400, 4]` but `scores` and `labels` were inferred as `[1, 1, 1]`, so dimension 1 cannot be reconciled (8400 ≠ 1).

#### Is [1, 1, 1] the real ONNX output shape?

Not necessarily. It is the shape TensorRT 8.5.2 infers during engine build. The ONNX file may still describe `[batch, 8400, 1]` in its shape metadata. Run the ONNX shape-inference script above to see what the ONNX toolchain itself believes.

#### Why does PyTorch inference work but TensorRT fails?

PyTorch executes the graph operationally — it never needs to statically infer every intermediate shape at compile time. TensorRT must resolve all shapes (or dynamic-shape ranges) before fusion and kernel selection. A shape-parser bug or opset mismatch only appears at engine-build time.

#### Does lowering batch size to 1 fix this?

No. The failure is on the 8400 candidate dimension, not batch. Even with `batch=1`, scores should be `[1, 8400, 1]`, not `[1, 1, 1]`.

#### Can I keep torch.max if I use opset 13?

Sometimes. Opset 13 keeps `axes` as an attribute, which TensorRT 8.5 handles more predictably. If you must stay on opset 18, rewrite the post-processing as described above.

#### What is the _to_copy input in the error log?

It is the ONNX name for `labels.to(boxes.dtype)` — casting integer class indices to `float32` so they can sit in the same tensor as box coordinates and confidence scores.
