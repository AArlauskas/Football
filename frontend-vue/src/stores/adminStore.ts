import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

import { addGame, getAdminGames, getTeams, updateGame } from '@/api';
import { StoreId } from '@/enums';
import type {
  Game,
  GamePrototype,
  GameStateFilter as GameStateFilterType,
  GameState as GameStateType,
  Team,
} from '@/models';
import { GameState, GameStateFilter } from '@/models/game';

type FormMode = 'create' | 'edit';
type SuccessMessageKey =
  | 'v1.admin.game.completed'
  | 'v1.admin.game.created'
  | 'v1.admin.game.updated';

interface GameForm {
  date: Date | null;
  goals1: number | null;
  goals2: number | null;
  id: number | null;
  state: GameStateType;
  t1: string;
  t2: string;
  time: string;
}

const createInitialForm = (): GameForm => ({
  date: null,
  goals1: null,
  goals2: null,
  id: null,
  state: GameState.OPEN,
  t1: '',
  t2: '',
  time: '',
});

const parseGameDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
};

const formatGameDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatError = (error: unknown) =>
  axios.isAxiosError(error) ? (error.response?.statusText ?? '') : '';

const stateOrder: Record<GameStateType, number> = {
  [GameState.CLOSED]: 0,
  [GameState.OPEN]: 1,
  [GameState.FINISHED]: 2,
};

export const useAdminStore = defineStore(StoreId.Admin, () => {
  const games = ref<Game[]>([]);
  const teams = ref<Team[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const requestError = ref('');
  const successMessageKey = ref<SuccessMessageKey | null>(null);
  const isCompleteDialogVisible = ref(false);
  const isEditDialogVisible = ref(false);
  const stateFilter = ref<GameStateFilterType>(GameStateFilter.ALL);
  const completeForm = reactive<GameForm>(createInitialForm());
  const createForm = reactive<GameForm>(createInitialForm());
  const editForm = reactive<GameForm>(createInitialForm());

  const visibleGames = computed(() =>
    [...games.value]
      .filter(
        (game) =>
          stateFilter.value === GameStateFilter.ALL ||
          game.state === stateFilter.value,
      )
      .sort((firstGame, secondGame) => {
        const stateSort =
          stateOrder[firstGame.state] - stateOrder[secondGame.state];

        if (stateSort !== 0) {
          return stateSort;
        }

        return `${firstGame.date} ${firstGame.time}`.localeCompare(
          `${secondGame.date} ${secondGame.time}`,
        );
      }),
  );

  const isFormValid = (form: GameForm, mode: FormMode) => {
    const hasResult =
      form.state !== GameState.FINISHED ||
      (form.goals1 !== null && form.goals2 !== null);

    return (
      form.date !== null &&
      form.t1 !== '' &&
      form.t2 !== '' &&
      form.t1 !== form.t2 &&
      form.time !== '' &&
      hasResult &&
      (mode === 'create' || form.id !== null)
    );
  };

  const isCreateFormValid = computed(() => isFormValid(createForm, 'create'));
  const isEditFormValid = computed(() => isFormValid(editForm, 'edit'));
  const isCompleteFormValid = computed(() => isFormValid(completeForm, 'edit'));

  const resetCreateForm = () => {
    Object.assign(createForm, createInitialForm());
  };

  const assignFormFromGame = (form: GameForm, game: Game) => {
    form.date = parseGameDate(game.date);
    form.goals1 = game.result?.goals1 ?? null;
    form.goals2 = game.result?.goals2 ?? null;
    form.id = game.id;
    form.state = game.state;
    form.t1 = game.t1.code;
    form.t2 = game.t2.code;
    form.time = game.time;
  };

  const toPayload = (form: GameForm, mode: FormMode): GamePrototype => {
    if (!form.date) {
      throw new Error('Date is required');
    }

    const payload: GamePrototype = {
      date: formatGameDate(form.date),
      t1: { code: form.t1 },
      t2: { code: form.t2 },
      time: form.time,
    };

    if (mode === 'edit') {
      payload.id = form.id ?? undefined;
      payload.state = form.state;

      if (form.state === GameState.FINISHED) {
        payload.result = {
          goals1: form.goals1 ?? 0,
          goals2: form.goals2 ?? 0,
        };
      }
    }

    return payload;
  };

  const loadAdminData = async () => {
    isLoading.value = true;
    requestError.value = '';

    try {
      const [teamsResponse, gamesResponse] = await Promise.all([
        getTeams(),
        getAdminGames(),
      ]);

      teams.value = teamsResponse;
      games.value = gamesResponse;
    } catch (error) {
      requestError.value = formatError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const createGame = async () => {
    if (!isCreateFormValid.value) {
      return;
    }

    isSaving.value = true;
    requestError.value = '';
    successMessageKey.value = null;

    try {
      await addGame(toPayload(createForm, 'create'));
      successMessageKey.value = 'v1.admin.game.created';
      resetCreateForm();
      await loadAdminData();
    } catch (error) {
      requestError.value = formatError(error);
    } finally {
      isSaving.value = false;
    }
  };

  const openEditDialog = (game: Game) => {
    assignFormFromGame(editForm, game);
    isEditDialogVisible.value = true;
  };

  const openCompleteDialog = (game: Game) => {
    assignFormFromGame(completeForm, game);
    completeForm.state = GameState.FINISHED;
    isCompleteDialogVisible.value = true;
  };

  const closeCompleteDialog = () => {
    isCompleteDialogVisible.value = false;
  };

  const closeEditDialog = () => {
    isEditDialogVisible.value = false;
  };

  const saveGame = async () => {
    if (!isEditFormValid.value) {
      return;
    }

    isSaving.value = true;
    requestError.value = '';
    successMessageKey.value = null;

    try {
      await updateGame(toPayload(editForm, 'edit'));
      successMessageKey.value = 'v1.admin.game.updated';
      closeEditDialog();
      await loadAdminData();
    } catch (error) {
      requestError.value = formatError(error);
    } finally {
      isSaving.value = false;
    }
  };

  const completeGame = async () => {
    if (!isCompleteFormValid.value) {
      return;
    }

    isSaving.value = true;
    requestError.value = '';
    successMessageKey.value = null;

    try {
      await updateGame(toPayload(completeForm, 'edit'));
      successMessageKey.value = 'v1.admin.game.completed';
      closeCompleteDialog();
      await loadAdminData();
    } catch (error) {
      requestError.value = formatError(error);
    } finally {
      isSaving.value = false;
    }
  };

  return {
    closeCompleteDialog,
    closeEditDialog,
    completeForm,
    completeGame,
    createForm,
    createGame,
    editForm,
    games,
    isCompleteDialogVisible,
    isCompleteFormValid,
    isCreateFormValid,
    isEditDialogVisible,
    isEditFormValid,
    isLoading,
    isSaving,
    loadAdminData,
    openCompleteDialog,
    openEditDialog,
    requestError,
    saveGame,
    stateFilter,
    successMessageKey,
    teams,
    visibleGames,
  };
});
