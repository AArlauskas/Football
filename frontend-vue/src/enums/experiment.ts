export const Experiment = {
  Overview: 'overview',
  Statistics: 'statistics',
} as const;

export type Experiment = (typeof Experiment)[keyof typeof Experiment];
