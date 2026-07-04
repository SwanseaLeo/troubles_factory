export type HomeTechnology = {
  id: string;
  label: string;
  tagSlugs: string[];
};

export const homeTechnologies: HomeTechnology[] = [
  { id: 'docker', label: 'Docker', tagSlugs: ['docker'] },
  { id: 'linux', label: 'Linux', tagSlugs: ['linux', 'ubuntu', 'centos', 'rhel'] },
  { id: 'cuda', label: 'CUDA', tagSlugs: ['cuda', 'nvidia'] },
  { id: 'tensorrt', label: 'TensorRT', tagSlugs: ['tensorrt'] },
  { id: 'onnx', label: 'ONNX', tagSlugs: ['onnx'] },
  { id: 'pytorch', label: 'PyTorch', tagSlugs: ['pytorch'] },
  { id: 'ros', label: 'ROS', tagSlugs: ['ros', 'ros2'] },
  { id: 'opencv', label: 'OpenCV', tagSlugs: ['opencv'] },
  { id: 'ffmpeg', label: 'FFmpeg', tagSlugs: ['ffmpeg'] },
  { id: 'nvidia', label: 'NVIDIA', tagSlugs: ['nvidia'] },
  { id: 'cmake', label: 'CMake', tagSlugs: ['cmake'] },
];
