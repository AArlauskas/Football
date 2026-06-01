export type InputNumberEvent = {
  value?: number | string;
};

export const hasInputNumberValue = (value: number | null | undefined) =>
  value !== null && value !== undefined;

export const getInputNumberValue = (event: InputNumberEvent) => {
  const value = event.value;

  if (value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export const getNullableInputNumberValue = (event: InputNumberEvent) =>
  getInputNumberValue(event) ?? null;
