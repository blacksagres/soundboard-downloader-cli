/**
 * Fetch the html from myinstants.com.
 *
 * 1. Query the html for the sound based on name
 * 2 .Then find the corresponding link to that sound
 * 3. Transform the found html nodes to an object with `{ label: string, download_url: string }`
 * 4. List them in the console - a user can pick one of the list (search in terminal)
 * 5. Download the sound (donwload folder from the user)
 */

export const getSoundNodes = async (searchString: string) => {
  let page = 1;
  const result: Array<string> = [];

  const escapedSearchParam = encodeURIComponent(searchString);

  /**
   * Yeah so that page does a little trick to make an infinite scroll.
   *
   * Whenever you hit the page in your browser, there's a script that will try to fetch the next page and
   * append the results to the current one, until it hits a 404 (ran out of pages). Here we try to do the same.
   *
   * One idea was to append this all into one string document but we just return 1 array with all
   * the pages we found. Then he service layer can crunch on this to determine what to pick.
   */

  while (true) {
    const url = `https://www.myinstants.com/en/search/?name=${escapedSearchParam}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.myinstants.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
      },
    });

    if (response.ok) {
      const htmlResult = await response.text();
      result.push(htmlResult);

      page++;

      continue;
    } else {
      console.error("Failed to fetch sounds:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
      });
    }

    break;
  }

  return result;
};

export const getNodeDownloadPage = async (soundNodeDetailsURL: string) => {
  const root = `https://www.myinstants.com${soundNodeDetailsURL}`;

  const response = await fetch(root, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.myinstants.com/',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch download page:", {
      status: response.status,
      statusText: response.statusText,
      url: root,
    });
  }

  return await response.text();
};
