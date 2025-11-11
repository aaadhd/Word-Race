// Font utility functions

/**
 * Calculate font size based on word length
 * @param length - Length of the word
 * @returns Font size in pixels
 */
export const getFontSize = (length: number): number => {
  if (length <= 5) return 120;
  if (length <= 7) return 96;
  if (length <= 9) return 76;
  if (length <= 11) return 60;
  if (length <= 13) return 52;
  return 44;
};
