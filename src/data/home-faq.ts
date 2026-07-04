export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const homeFaq: HomeFaqItem[] = [
  {
    question: 'What is TroubleFactory?',
    answer:
      'TroubleFactory is a verified software troubleshooting knowledge database. Each case documents a reproducible fix with environment details, version notes, and expected output validated in production.',
  },
  {
    question: 'How is TroubleFactory different from AI answers or forum posts?',
    answer:
      'Cases are written as verified procedures for specific software versions and environments. They include reproduction steps, prerequisites, rollback guidance, and verification output instead of unverified suggestions.',
  },
  {
    question: 'Are the troubleshooting cases version-specific?',
    answer:
      'Yes. Published cases call out the software, driver, framework, and operating system versions where the fix was tested so you can match your production stack.',
  },
  {
    question: 'What technologies does TroubleFactory cover?',
    answer:
      'The knowledge base includes verified cases for Docker, Linux, NVIDIA, CUDA, TensorRT, ONNX, PyTorch, OpenCV, systemd, Supervisor, Ubuntu, and related production tooling.',
  },
  {
    question: 'How do I search for a verified fix?',
    answer:
      'Use the homepage search to look up error messages, tool names, versions, frameworks, operating systems, or architectures. Results link to full verified case procedures.',
  },
  {
    question: 'Are all published cases verified?',
    answer:
      'Every published case in TroubleFactory is treated as a documented, production-tested troubleshooting procedure before it appears in the public index.',
  },
];
