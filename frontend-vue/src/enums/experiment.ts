export const Experiment = {
  Overview: 'overview',
} as const;

export type Experiment = (typeof Experiment)[keyof typeof Experiment];
