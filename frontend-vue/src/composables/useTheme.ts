import { readonly, ref } from 'vue';

const DARK_MODE_CLASS = 'app-dark';
const DARK_MODE_STORAGE_KEY = 'football-dark-mode';

const isDark = ref(false);

let isInitialized = false;

const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const getStoredIsDark = () => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
};

const applyTheme = () => {
  if (!isBrowser()) {
    return;
  }

  document.documentElement.classList.toggle(DARK_MODE_CLASS, isDark.value);
  document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light';
};

export const initializeTheme = () => {
  if (!isBrowser() || isInitialized) {
    return;
  }

  isDark.value = getStoredIsDark();
  applyTheme();
  isInitialized = true;
};

export const useTheme = () => {
  initializeTheme();

  const setDarkMode = (nextIsDark: boolean) => {
    isDark.value = nextIsDark;
    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(nextIsDark));
    applyTheme();
  };

  const toggleTheme = () => {
    setDarkMode(!isDark.value);
  };

  return {
    darkModeClass: DARK_MODE_CLASS,
    isDark: readonly(isDark),
    setDarkMode,
    toggleTheme,
  };
};
