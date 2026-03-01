/**
 * API Configuration - allows switching between real and mock API
 */

export type ApiMode = 'real' | 'mock';

// Default to real API, but can be overridden for testing
let currentApiMode: ApiMode = 'real';

/**
 * Set the API mode
 * @param mode - 'real' for production, 'mock' for testing
 */
export const setApiMode = (mode: ApiMode): void => {
  currentApiMode = mode;
};

/**
 * Get the current API mode
 */
export const getApiMode = (): ApiMode => {
  return currentApiMode;
};

/**
 * Check if we're using mock API
 */
export const isMockMode = (): boolean => {
  return currentApiMode === 'mock';
};
