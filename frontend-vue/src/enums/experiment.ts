export const Experiment = {
  Statistics: 'statistics',
} as const;

export type Experiment = (typeof Experiment)[keyof typeof Experiment];
