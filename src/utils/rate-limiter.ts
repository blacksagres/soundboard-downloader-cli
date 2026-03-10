/**
 * Rate limiting utility to ensure compliance with MyInstants Terms of Use
 * Adds reasonable delays between requests to avoid being seen as scraping
 */

/**
 * Minimum delay between requests (in milliseconds)
 * This helps avoid being flagged as automated scraping
 */
const MIN_REQUEST_DELAY = 1000; // 1 second

/**
 * Track the last request time for rate limiting
 */
let lastRequestTime = 0;

/**
 * Rate-limited fetch wrapper
 * Ensures minimum delay between consecutive requests to MyInstants
 */
export const rateLimitedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Calculate time since last request
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // If we're making requests too quickly, add a delay
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    const delayNeeded = MIN_REQUEST_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delayNeeded));
  }
  
  // Update last request time
  lastRequestTime = Date.now();
  
  // Make the actual fetch request
  return fetch(input, init);
};

/**
 * Reset the rate limiter (useful for testing)
 */
export const resetRateLimiter = (): void => {
  lastRequestTime = 0;
};

/**
 * Get the current rate limit delay
 */
export const getRateLimitDelay = (): number => {
  return MIN_REQUEST_DELAY;
};