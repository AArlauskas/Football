import { computed, ref } from 'vue';

import { Experiment } from '@/enums';

const experimentStorageKeyMap: Record<Experiment, string> = {
  [Experiment.Statistics]: 'statistics-experiment-active',
};

const activeExperiments = ref<Record<Experiment, boolean>>({
  [Experiment.Statistics]: false,
});

let isInitialized = false;

const isBrowser = () => typeof window !== 'undefined';

const getStoredBoolean = (key: string) => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(key) === 'true';
};

const syncExperimentFlags = () => {
  for (const experiment of Object.values(Experiment)) {
    activeExperiments.value[experiment] = getStoredBoolean(
      experimentStorageKeyMap[experiment],
    );
  }
};

export const initializeExperimentFlags = () => {
  if (!isBrowser() || isInitialized) {
    return;
  }

  syncExperimentFlags();
  window.addEventListener('storage', (event) => {
    if (
      event.key === null ||
      Object.values(experimentStorageKeyMap).includes(event.key)
    ) {
      syncExperimentFlags();
    }
  });
  isInitialized = true;
};

export const useExperiment = (experiment: Experiment) => {
  initializeExperimentFlags();

  const setActive = (nextIsActive: boolean) => {
    activeExperiments.value[experiment] = nextIsActive;

    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(
      experimentStorageKeyMap[experiment],
      String(nextIsActive),
    );
  };

  return {
    isActive: computed(() => activeExperiments.value[experiment]),
    setActive,
    storageKey: experimentStorageKeyMap[experiment],
  };
};
