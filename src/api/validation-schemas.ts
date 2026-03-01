/**
 * Valibot validation schemas for API responses
 * Ensures both real and mock API responses match expected structure
 */

import { object, string, array, boolean, number, optional, parse, InferOutput } from 'valibot';

// Schema for a single sound result
const SoundSchema = object({
  label: string('Label must be a string'),
  download_url: string('Download URL must be a string'),
});

export type ValidatedSound = InferOutput<typeof SoundSchema>;

// Schema for paginated results
const PaginatedResultsSchema = object({
  results: array(SoundSchema, 'Results must be an array of sounds'),
  hasNextPage: boolean('hasNextPage should be a boolean'),
  hasPreviousPage: boolean('hasPreviousPage should be a boolean'),
  currentPage: number('currentPage should be a number'),
});

export type ValidatedPaginatedResults = InferOutput<typeof PaginatedResultsSchema>;

// Schema for HTML response (used internally)
const HtmlSchema = string('HTML response must be a string');
export type ValidatedHtml = InferOutput<typeof HtmlSchema>;

/**
 * Validate a single sound result
 * @throws ValidationError if sound doesn't match schema
 */
export const validateSound = (sound: unknown): ValidatedSound => {
  return parse(SoundSchema, sound);
};

/**
 * Validate paginated results
 * @throws ValidationError if results don't match schema
 */
export const validatePaginatedResults = (results: unknown): ValidatedPaginatedResults => {
  return parse(PaginatedResultsSchema, results);
};

/**
 * Validate HTML response
 * @throws ValidationError if HTML is not a string
 */
export const validateHtml = (html: unknown): ValidatedHtml => {
  return parse(HtmlSchema, html);
};

/**
 * Safe validation that returns null instead of throwing
 */
export const safeValidateSound = (sound: unknown): ValidatedSound | null => {
  try {
    return validateSound(sound);
  } catch (error) {
    console.error('Validation failed:', error);
    return null;
  }
};

/**
 * Validate an array of sounds
 */
export const validateSoundsArray = (sounds: unknown[]): ValidatedSound[] => {
  return sounds.map(sound => validateSound(sound));
};
