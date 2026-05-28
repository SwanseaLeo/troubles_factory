---
title: Offline Installation of NVIDIA Container Toolkit
pubDate: 11/09/2022 14:25
author: "Leo"
tags:
  - NVIDIA
  - Docker
  - Linux
imgUrl: '../../assets/blog1.jpeg'
description: Step-by-step offline installation of NVIDIA Container Toolkit on Debian/Ubuntu, with package order, runtime setup, and verification.
---

## Offline Installation of NVIDIA Container Toolkit

### Download

Download packages from:

https://github.com/NVIDIA/libnvidia-container/tree/gh-pages/stable/deb/amd64

<table>
  <colgroup>
    <col />
    <col />
    <col style="width: 140px;" />
    <col />
  </colgroup>
  <thead>
    <tr>
      <th>Package</th>
      <th>Type</th>
      <th style="text-align: center; white-space: nowrap;">Install Order</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>libnvidia-container1_1.18.0-1_amd64.deb</td>
      <td>Required</td>
      <td style="text-align: center;">1</td>
      <td>Core library package; all other packages depend on this.</td>
    </tr>
    <tr>
      <td>libnvidia-container-tools_1.18.0-1_amd64.deb</td>
      <td>Required</td>
      <td style="text-align: center;">2</td>
      <td>Core tools package; depends on <code>libnvidia-container1</code>.</td>
    </tr>
    <tr>
      <td>nvidia-container-toolkit-base_1.18.0-1_amd64.deb</td>
      <td>Required</td>
      <td style="text-align: center;">3</td>
      <td>Base toolkit components; depends on the previous packages.</td>
    </tr>
    <tr>
      <td>nvidia-container-toolkit_1.18.0-1_amd64.deb</td>
      <td>Required</td>
      <td style="text-align: center;">4</td>
      <td>Main toolkit package; depends on all required packages above.</td>
    </tr>
    <tr>
      <td>libnvidia-container1-dbg_1.18.0-1_amd64.deb</td>
      <td>Optional</td>
      <td style="text-align: center;">-</td>
      <td>Debug symbols package; only needed for troubleshooting.</td>
    </tr>
    <tr>
      <td>libnvidia-container-dev_1.18.0-1_amd64.deb</td>
      <td>Optional</td>
      <td style="text-align: center;">-</td>
      <td>Development package; only needed for development.</td>
    </tr>
  </tbody>
</table>

### Install

Install packages in this order:

```bash
sudo dpkg -i libnvidia-container1_1.18.0-1_amd64.deb
sudo dpkg -i libnvidia-container-tools_1.18.0-1_amd64.deb
sudo dpkg -i nvidia-container-toolkit-base_1.18.0-1_amd64.deb
sudo dpkg -i nvidia-container-toolkit_1.18.0-1_amd64.deb
```

### Verify the installation

Check the installed toolkit version:

```bash
nvidia-ctk --version
```

### Set Docker to use the NVIDIA runtime by default

```bash
sudo nvidia-ctk runtime configure --runtime=docker
```

### Restart Docker

```bash
sudo systemctl restart docker
```
