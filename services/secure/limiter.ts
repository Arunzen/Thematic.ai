
const STORAGE_KEY = 'thematic_neural_credits';
const MAX_CREDITS = 4;

export const getRemainingCredits = (): number => {
  const used = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return Math.max(0, MAX_CREDITS - used);
};

export const consumeCredit = (): void => {
  const used = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  localStorage.setItem(STORAGE_KEY, (used + 1).toString());
};

export const hasCredits = (): boolean => {
  return getRemainingCredits() > 0;
};

export const resetCredits = (): void => {
  localStorage.setItem(STORAGE_KEY, '0');
};
