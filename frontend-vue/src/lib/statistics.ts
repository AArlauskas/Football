export const STATISTICS_AVAILABLE_FROM = new Date('2026-07-20T00:00:00');

export const isStatisticsAvailable = (now = new Date()) =>
  now > STATISTICS_AVAILABLE_FROM;
