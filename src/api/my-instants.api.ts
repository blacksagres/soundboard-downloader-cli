/**
 * Fetch the html from myinstants.com with server-side pagination support.
 *
 * This module provides functions to fetch sound nodes page by page,
 * enabling efficient browsing of search results without loading everything at once.
 *
 * Can be switched to mock mode for testing via api-config.ts
 */

import { Query } from "../common/types/query.type";
import { getApiMode, isMockMode } from "./api-config";
import * as MockApi from "./my-instants.api.mock";

/**
 * Fetch a single page of sound nodes from myinstants.com
 * @param searchString The search term
 * @param page The page number to fetch (default: 1)
 * @returns HTML content of the requested page
 * @throws Error if the page cannot be fetched
 */
export const getSoundNodesPage = async ({ searchString, page = 1 }: Query): Promise<string> => {
  // Use mock data if in mock mode
  if (isMockMode()) {
    return MockApi.getSoundNodesPage({ searchString, page });
  }

  const escapedSearchParam = encodeURIComponent(searchString);
  const url = `https://www.myinstants.com/en/search/?name=${escapedSearchParam}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page} for search: ${searchString}`);
  }

  return response.text();
};

/**
 * Check if next page exists using HEAD request for efficiency
 * @param searchString The search term
 * @param page The current page number (default: 1)
 * @returns true if next page exists, false otherwise
 */
export const hasNextPage = async ({ searchString, page = 1 }: Query): Promise<boolean> => {
  // Use mock data if in mock mode
  if (isMockMode()) {
    return MockApi.hasNextPage({ searchString, page });
  }

  const escapedSearchParam = encodeURIComponent(searchString);
  const url = `https://www.myinstants.com/en/search/?name=${escapedSearchParam}&page=${page + 1}`;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Fetch all pages (for --all flag)
 * This maintains the original functionality but as an explicit option
 * @param searchString The search term
 * @returns Array of HTML content for all pages
 */
export const getAllSoundNodes = async ({ searchString }: Query): Promise<string[]> => {
  // Use mock data if in mock mode
  if (isMockMode()) {
    return MockApi.getAllSoundNodes({ searchString });
  }

  const result: string[] = [];
  let page = 1;

  while (true) {
    try {
      const html = await getSoundNodesPage({ searchString, page });
      result.push(html);
      page++;

      // Check if next page exists
      const nextExists = await hasNextPage({ searchString, page });
      if (!nextExists) break;
    } catch (error) {
      // If we get an error fetching a page, assume we've reached the end
      break;
    }
  }

  return result;
};

/**
 * Fetch the download page for a specific sound node
 * @param soundNodeDetailsURL The relative URL of the sound detail page
 * @returns HTML content of the sound detail page
 */
export const getNodeDownloadPage = async (soundNodeDetailsURL: string): Promise<string> => {
  // Use mock data if in mock mode
  if (isMockMode()) {
    return MockApi.getNodeDownloadPage(soundNodeDetailsURL);
  }

  const root = `https://www.myinstants.com${soundNodeDetailsURL}`;
  const response = await fetch(root);

  if (!response.ok) {
    throw new Error(`Failed to fetch sound detail page: ${soundNodeDetailsURL}`);
  }

  return response.text();
};
