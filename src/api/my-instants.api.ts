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

  console.log("Searching for: ", searchString);

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
    const response = await fetch(url);

    if (response.ok) {
      const htmlResult = await response.text();
      result.push(htmlResult);

      console.log(`Found ${page}, going forward.`);
      page++;

      continue;
    }

    console.log(`No more pages, returning result.`);

    break;
  }

  return result;
};
