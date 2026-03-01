import {
  getNodeDownloadPage,
  getSoundNodesPage as getSoundNodesPageApi,
  hasNextPage as hasNextPageApi,
  getAllSoundNodes as getAllSoundNodesApi,
} from "../api/my-instants.api";
import {
  validatePaginatedResults,
  validateSoundsArray,
  ValidatedPaginatedResults
} from "../api/validation-schemas";
import * as jsdom from "jsdom";
import { Query, SoundSelection } from "../common/types/query.type";

// Simple in-memory cache for paginated results
const pageCache = new Map<string, string>();

const getCacheKey = (searchString: string, page: number): string => {
  return `${searchString}||${page}`;
};

const getCachedPage = (searchString: string, page: number): string | undefined => {
  return pageCache.get(getCacheKey(searchString, page));
};

const cachePage = (searchString: string, page: number, html: string): void => {
  pageCache.set(getCacheKey(searchString, page), html);
};

const clearCache = (searchString: string): void => {
  // Clear all cached pages for this search
  for (const key of pageCache.keys()) {
    if (key.startsWith(`${searchString}||`)) {
      pageCache.delete(key);
    }
  }
};

const getDownloadUrl = async (originalUrl: string | null): Promise<string> => {
  if (!originalUrl) {
    return "not-found";
  }

  /**
   * For example, this is what the url looks like from the link:
   *
   * '/en/instant/nemesis-resident-evil-3-stars/'
   *
   * And we want it to be like this:
   *
   * 'nemesis-resident-evil-3-stars'
   *
   * To eventually combine with the download url template and make a final link.
   */
  const cleanSoundName = originalUrl
    .replace("/en/instant/", "")
    .replace("/", "");

  try {
    const downloadPage = await getNodeDownloadPage(originalUrl);

    const downloadLink = Array.from(
      new jsdom.JSDOM(downloadPage).window.document.querySelectorAll("a"),
    ).find((node: HTMLAnchorElement) => {
      return node.href.includes(".mp3") && node.hasAttribute("download");
    });

    if (downloadLink) {
      return `https://www.myinstants.com${downloadLink.href}`;
    }
  } catch (error) {
    console.error(`Failed to fetch download URL for ${originalUrl}:`, error);
  }

  return "not-found";
};

/**
 * Get sound nodes for a specific page with caching
 */
export const getSoundNodesPage = async (params: Query): Promise<Array<{ label: string; download_url: string }>> => {
  const page = params.page || 1;
  const cacheKey = getCacheKey(params.searchString, page);
  let html = getCachedPage(params.searchString, page);

  if (!html) {
    html = await getSoundNodesPageApi(params);
    cachePage(params.searchString, page, html);
  }

  const document = new jsdom.JSDOM(html);
  const soundNodes = Array.from(document.window.document.querySelectorAll("div.instant > a.instant-link"));
  const results: Array<{ label: string; download_url: string; detail_url: string }> = [];

  // First, extract labels and detail URLs
  soundNodes.forEach((node) => {
    const detailUrl = node.getAttribute("href");
    if (detailUrl) {
      results.push({
        label: node.textContent?.trim() || "Unknown",
        download_url: "pending",
        detail_url: detailUrl
      });
    }
  });

  // Resolve download URLs in parallel by fetching each detail page
  const downloadPromises = results.map(result => 
    getDownloadUrl(result.detail_url)
  );

  const downloadUrls = await Promise.all(downloadPromises);

  return results.map((result, index) => ({
    label: result.label,
    download_url: downloadUrls[index] || "not-found"
  }));
};

/**
 * Get paginated results with navigation information
 */
export const getPaginatedResults = async (
  searchString: string,
  page: number = 1
): Promise<ValidatedPaginatedResults> => {
  // Clear cache for new searches
  if (page === 1) {
    clearCache(searchString);
  }

  const currentResults = await getSoundNodesPage({ searchString, page });
  const hasNext = await hasNextPageApi({ searchString, page });

  // Validate the results before returning
  const validatedResults = validatePaginatedResults({
    results: currentResults,
    hasNextPage: hasNext,
    hasPreviousPage: page > 1,
    currentPage: page
  });

  return validatedResults;
};

/**
 * Get all results (for --all flag)
 */
export const getAllResults = async (searchString: string): Promise<Array<{ label: string; download_url: string }>> => {
  const allPages = await getAllSoundNodesApi({ searchString });
  const allResults: Array<{ label: string; download_url: string }> = [];

  // First collect all detail URLs
  const soundDetails: Array<{ label: string; detail_url: string }> = [];
  
  for (const pageHtml of allPages) {
    const document = new jsdom.JSDOM(pageHtml);
    const soundNodes = Array.from(document.window.document.querySelectorAll("div.instant > a.instant-link"));

    soundNodes.forEach((node) => {
      const detailUrl = node.getAttribute("href");
      if (detailUrl) {
        soundDetails.push({
          label: node.textContent?.trim() || "Unknown",
          detail_url: detailUrl
        });
      }
    });
  }

  // Resolve all download URLs
  const downloadPromises = soundDetails.map(detail => 
    getDownloadUrl(detail.detail_url)
  );

  const downloadUrls = await Promise.all(downloadPromises);

  const finalResults = soundDetails.map((detail, index) => ({
    label: detail.label,
    download_url: downloadUrls[index] || "not-found"
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Validate all results before returning
  return validateSoundsArray(finalResults);
};
