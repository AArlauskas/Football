import { useToast as usePrimeToast } from 'primevue/usetoast';

const TOAST_LIFE = 3000;

type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary';

type ToastOptions = {
  detail?: string;
  severity?: ToastSeverity;
  summary?: string;
};

export const useToast = () => {
  const toast = usePrimeToast();

  const showToast = ({ detail, severity = 'info', summary }: ToastOptions) => {
    toast.add({
      detail,
      life: TOAST_LIFE,
      severity,
      summary,
    });
  };

  return {
    error: (options: Omit<ToastOptions, 'severity'>) =>
      showToast({ ...options, severity: 'error' }),
    info: (options: Omit<ToastOptions, 'severity'>) =>
      showToast({ ...options, severity: 'info' }),
    success: (options: Omit<ToastOptions, 'severity'>) =>
      showToast({ ...options, severity: 'success' }),
    warn: (options: Omit<ToastOptions, 'severity'>) =>
      showToast({ ...options, severity: 'warn' }),
  };
};
