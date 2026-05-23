import type { UserDetails } from '@/models/user';

export const GameState = {
  OPEN: 'open',
  CLOSED: 'closed',
  FINISHED: 'finished',
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export const GameStateFilter = {
  ALL: 'all',
  OPEN: GameState.OPEN,
  CLOSED: GameState.CLOSED,
  FINISHED: GameState.FINISHED,
} as const;

export type GameStateFilter =
  (typeof GameStateFilter)[keyof typeof GameStateFilter];

export const GuessOutcome = {
  CORRECT_ALONE: 'correct_alone',
  CORRECT: 'correct',
  OUTCOME_ONLY: 'outcome_only',
  OUTCOME_INCORRECT: 'outcome_incorrect',
  NOT_GIVEN: 'not_given',
} as const;

export type GuessOutcome = (typeof GuessOutcome)[keyof typeof GuessOutcome];

export interface Team {
  code: string;
  name: string;
}

export interface TeamsStatistics {
  lost: number;
  team: Team;
  ties: number;
  won: number;
}

export interface GameResult {
  goals1: number;
  goals2: number;
}

export interface Game {
  date: string;
  id: number;
  result: GameResult | null;
  state: GameState;
  t1: Team;
  t2: Team;
  time: string;
}

export interface Guess {
  outcome: GuessOutcome | null;
  points: number | null;
  result: GameResult | null;
}

export interface GuessPrototype {
  gameId: number;
  result: GameResult;
}

export interface GuessWithUser {
  guess: Guess | null;
  user: UserDetails;
}

export interface GameWithGuess {
  game: Game;
  guess: Guess | null;
}

export interface GameResults {
  game: Game;
  guess: GuessWithUser[];
}

export interface GamePrototype {
  date: string;
  id?: number;
  result?: GameResult;
  state?: GameState;
  t1: Pick<Team, 'code'>;
  t2: Pick<Team, 'code'>;
  time: string;
}
