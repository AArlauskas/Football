export const StoreId = {
  Admin: 'admin',
  Auth: 'auth',
  Games: 'games',
  Match: 'match',
  OngoingMatches: 'ongoing-matches',
  Overview: 'overview',
  Player: 'player',
  Results: 'results',
  Statistics: 'statistics',
  Team: 'team',
  TeamsStatistics: 'teams-statistics',
} as const;

export const StorePersistentKey = {
  Auth: 'football-auth-store',
} as const;
