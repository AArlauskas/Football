import { onMounted, watch, type Ref } from 'vue';

export const usePageTitle = (title: Ref<string> | string) => {
  const setPageTitle = (value: string) => {
    document.title = value;
  };

  onMounted(() => {
    if (typeof title === 'string') {
      setPageTitle(title);

      return;
    }

    setPageTitle(title.value);
  });

  if (typeof title !== 'string') {
    watch(title, setPageTitle);
  }
};
