import type { Game, GameResult, Guess, GuessWithUser } from '@/models';
import { useAuthStore } from '@/stores/authStore';
import { useOngoingMatchesStore } from '@/stores/ongoingMatchesStore';

const formatResult = (result?: GameResult | null) =>
  result ? `${result.goals1} : ${result.goals2}` : '-';

export const useOngoingMatches = () => {
  const authStore = useAuthStore();
  const ongoingMatchesStore = useOngoingMatchesStore();

  const getOngoingGame = (gameId: number) =>
    ongoingMatchesStore.getOngoingGame(gameId);

  const getVisibleResult = (game: Game) =>
    game.result ?? getOngoingGame(game.id)?.currentResult ?? null;

  const getVisibleScore = (game: Game) => formatResult(getVisibleResult(game));

  const hasLiveResult = (game: Game) =>
    !game.result && Boolean(getOngoingGame(game.id)?.currentResult);

  const getMatchTime = (game: Game) => getOngoingGame(game.id)?.matchTime ?? '';

  const hasEstimatedGuesses = (gameId: number) =>
    Boolean(getOngoingGame(gameId)?.estimatedGuesses.length);

  const getEstimatedGuess = (
    gameId: number,
    userId = authStore.user?.id,
  ): Guess | null => {
    if (!userId) {
      return null;
    }

    return (
      getOngoingGame(gameId)?.estimatedGuesses.find(
        (item) => item.user.id === userId,
      )?.guess ?? null
    );
  };

  const getVisibleGuesses = (gameId: number, fallback: GuessWithUser[]) => {
    const estimatedGuesses = getOngoingGame(gameId)?.estimatedGuesses;

    return estimatedGuesses?.length ? estimatedGuesses : fallback;
  };

  return {
    formatResult,
    getEstimatedGuess,
    getMatchTime,
    getOngoingGame,
    getVisibleGuesses,
    getVisibleResult,
    getVisibleScore,
    hasEstimatedGuesses,
    hasLiveResult,
  };
};
