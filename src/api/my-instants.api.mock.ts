/**
 * Mock API layer for testing purposes
 * Returns predictable data without making actual HTTP requests
 */

import { Query } from "../common/types/query.type";

// Mock data for testing
const mockSounds = [
  {
    label: "Wilhelm Scream",
    detail_url: "/en/instant/wilhelm-scream/"
  },
  {
    label: "THX Deep Note",
    detail_url: "/en/instant/thx-deep-note/"
  },
  {
    label: "Test Sound 1",
    detail_url: "/en/instant/test-sound-1/"
  },
  {
    label: "Test Sound 2",
    detail_url: "/en/instant/test-sound-2/"
  },
  {
    label: "Test Sound 3",
    detail_url: "/en/instant/test-sound-3/"
  },
  {
    label: "Test Sound 4",
    detail_url: "/en/instant/test-sound-4/"
  },
  {
    label: "Test Sound 5",
    detail_url: "/en/instant/test-sound-5/"
  },
  {
    label: "Test Sound 6",
    detail_url: "/en/instant/test-sound-6/"
  },
  {
    label: "Test Sound 7",
    detail_url: "/en/instant/test-sound-7/"
  },
  {
    label: "Test Sound 8",
    detail_url: "/en/instant/test-sound-8/"
  },
  {
    label: "Test Sound 9",
    detail_url: "/en/instant/test-sound-9/"
  },
  {
    label: "Test Sound 10",
    detail_url: "/en/instant/test-sound-10/"
  },
  {
    label: "Test Sound 11",
    detail_url: "/en/instant/test-sound-11/"
  },
  {
    label: "Test Sound 12",
    detail_url: "/en/instant/test-sound-12/"
  },
];

// Mock HTML templates
const mockSearchPage = (sounds: typeof mockSounds, page: number) => `
<!DOCTYPE html>
<html>
<head><title>MyInstants - Search Results</title></head>
<body>
  <div class="instant-list">
    ${sounds.map(sound => `
      <div class="instant">
        <a href="${sound.detail_url}" class="instant-link">${sound.label}</a>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

const mockDetailPage = (downloadUrl: string) => `
<!DOCTYPE html>
<html>
<head><title>MyInstants - Sound Detail</title></head>
<body>
  <a href="${downloadUrl}" download="sound.mp3">Download MP3</a>
</body>
</html>
`;

/**
 * Mock implementation of getSoundNodesPage
 */
export const getSoundNodesPage = async ({ searchString, page = 1 }: Query): Promise<string> => {
  // Return mock data for any search string
  const pageSize = 6;
  const startIndex = (page - 1) * pageSize;
  const pageSounds = mockSounds.slice(startIndex, startIndex + pageSize);
  
  return mockSearchPage(pageSounds, page);
};

/**
 * Mock implementation of hasNextPage
 */
export const hasNextPage = async ({ searchString, page = 1 }: Query): Promise<boolean> => {
  const pageSize = 6;
  const startIndex = (page - 1) * pageSize;
  return startIndex + pageSize < mockSounds.length;
};

/**
 * Mock implementation of getAllSoundNodes
 */
export const getAllSoundNodes = async ({ searchString }: Query): Promise<string[]> => {
  const pageSize = 6;
  const pages = [];
  
  for (let page = 1; ; page++) {
    const startIndex = (page - 1) * pageSize;
    const pageSounds = mockSounds.slice(startIndex, startIndex + pageSize);
    
    if (pageSounds.length === 0) break;
    
    pages.push(mockSearchPage(pageSounds, page));
  }
  
  return pages;
};

/**
 * Mock implementation of getNodeDownloadPage
 */
export const getNodeDownloadPage = async (soundNodeDetailsURL: string): Promise<string> => {
  // Return a mock detail page with a valid download URL
  return mockDetailPage("https://www.myinstants.com/media/sounds/test-sound.mp3");
};
