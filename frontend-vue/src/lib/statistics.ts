export const STATISTICS_AVAILABLE_FROM = new Date('2026-07-19T19:00:00Z');

export const isStatisticsDatePassed = (now = new Date()) =>
  now >= STATISTICS_AVAILABLE_FROM;
