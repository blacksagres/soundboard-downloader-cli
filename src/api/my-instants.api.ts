/**
 * Fetch the html from myinstants.com.
 *
 * 1. Query the html for the sound based on name
 * 2 .Then find the corresponding link to that sound
 * 3. Transform the found html nodes to an object with `{ label: string, download_url: string }`
 * 4. List them in the console - a user can pick one of the list (search in terminal)
 * 5. Download the sound (donwload folder from the user)
 */

export const getSoundNodes = (searchString: string) => {
  const escapedSearchParam = encodeURIComponent(searchString);
  const url = `https://www.myinstants.com/en/search/?name=${escapedSearchParam}`;
  const result = fetch(url).then((response) => {
    return response.text();
  });

  return result;
};
