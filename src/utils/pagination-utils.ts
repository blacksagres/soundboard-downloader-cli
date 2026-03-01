/**
 * Pagination utility functions for the soundboard downloader CLI
 */

import { PaginationAction, NavigationAction, SoundSelection } from "../common/types/query.type";

/**
 * Type guard to check if a value is a navigation action
 */
export const isNavigationAction = (value: string): value is NavigationAction => {
  return value.startsWith("action:");
};

/**
 * Type guard to check if a value is a specific pagination action
 */
export const isPaginationAction = (value: string): value is PaginationAction => {
  return isNavigationAction(value) && [
    'action:prev-page',
    'action:next-page', 
    'action:new-search',
    'action:show-all'
  ].includes(value as PaginationAction);
};

/**
 * Create pagination choices for the CLI interface
 */
export const createPaginationChoices = (
  currentPage: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  includeAllOption: boolean = false
): Array<{ name: string; value: PaginationAction; disabled?: boolean }> => {
  const choices: Array<{ name: string; value: PaginationAction; disabled?: boolean }> = [
    {
      name: hasPreviousPage ? "⏮️ Previous page" : "⏮️ Previous page",
      value: "action:prev-page",
      disabled: !hasPreviousPage
    },
    {
      name: hasNextPage ? "⏭️ Next page" : "⏭️ Next page",
      value: "action:next-page",
      disabled: !hasNextPage
    },
    {
      name: "🔍 New search",
      value: "action:new-search"
    }
  ];

  if (includeAllOption) {
    choices.push({
      name: "📋 Show all results",
      value: "action:show-all"
    });
  }

  return choices;
};

/**
 * Extract navigation action from selections
 * @returns The navigation action if found, null otherwise
 */
export const getNavigationAction = (selections: string[]): PaginationAction | null => {
  const navigationAction = selections.find(isPaginationAction);
  return navigationAction || null;
};

/**
 * Filter out navigation actions from selections
 * @returns Array of sound selections only
 */
export const getSoundSelections = (selections: string[]): SoundSelection[] => {
  return selections.filter((selection): selection is SoundSelection => 
    !isNavigationAction(selection)
  );
};

/**
 * Get pagination info string for display
 */
export const getPaginationInfo = (
  currentPage: number,
  resultsCount: number,
  hasNextPage: boolean
): string => {
  const pageInfo = hasNextPage 
    ? `Page ${currentPage}`
    : `Page ${currentPage} (last page)`;
  
  return `🎉 ${pageInfo}: ${resultsCount} sound${resultsCount !== 1 ? "s" : ""}!`;
};
