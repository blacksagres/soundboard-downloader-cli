import { getSoundNodes as getSoundNodesApi } from "../api/my-instants.api";
import * as jsdom from "jsdom";

const generateMP3Url = (originalUrl: string | null) => {
  if (!originalUrl) {
    return null;
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

  // MP3 download example link
  const downloadUrlTemplate =
    "https://www.myinstants.com/media/sounds/<WILDCARD>.mp3";

  return downloadUrlTemplate.replace("<WILDCARD>", cleanSoundName);
};

export const getSoundNodes = async (searchString: string) => {
  const result = await getSoundNodesApi(searchString);

  const nodeList: Array<{
    label: string;
    download_url: string | null;
  }> = [];

  for (const page of result) {
    const document = new jsdom.JSDOM(page);

    document.window.document
      .querySelectorAll("div.instant > a.instant-link")
      .forEach((node) => {
        nodeList.push({
          label: node.textContent,
          download_url: generateMP3Url(node.getAttribute("href")),
        });
      });
  }

  return nodeList;
};
