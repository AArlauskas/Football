import type { TranslationKey } from '@/i18n';

export interface StatisticsColumn {
  field: string;
  label: TranslationKey;
}

export interface StatisticsRow {
  id: string;
  title: string;
  values: Record<string, number | string>;
}
