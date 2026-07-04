export type HomeTechnology = {
  id: string;
  label: string;
  tagSlugs: string[];
};

export const homeTechnologies: HomeTechnology[] = [
  { id: 'docker', label: 'Docker', tagSlugs: ['docker'] },
  { id: 'linux', label: 'Linux', tagSlugs: ['linux', 'ubuntu', 'centos', 'rhel'] },
  { id: 'cuda', label: 'CUDA', tagSlugs: ['cuda'] },
  { id: 'tensorrt', label: 'TensorRT', tagSlugs: ['tensorrt'] },
  { id: 'onnx', label: 'ONNX', tagSlugs: ['onnx'] },
  { id: 'pytorch', label: 'PyTorch', tagSlugs: ['pytorch'] },
  { id: 'opencv', label: 'OpenCV', tagSlugs: ['opencv'] },
  { id: 'ros', label: 'ROS', tagSlugs: ['ros', 'ros2'] },
  { id: 'ffmpeg', label: 'FFmpeg', tagSlugs: ['ffmpeg'] },
  { id: 'cmake', label: 'CMake', tagSlugs: ['cmake'] },
  { id: 'nvidia-driver', label: 'NVIDIA Driver', tagSlugs: ['nvidia'] },
];
