import { onMounted, onUnmounted } from 'vue';

import { useOngoingMatchesStore } from '@/stores/ongoingMatchesStore';

export const useOngoingMatchesPolling = () => {
  const ongoingMatchesStore = useOngoingMatchesStore();

  onMounted(() => {
    ongoingMatchesStore.startPolling();
  });

  onUnmounted(() => {
    ongoingMatchesStore.stopPolling();
  });
};
