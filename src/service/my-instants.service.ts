import {
  getNodeDownloadPage,
  getSoundNodes as getSoundNodesApi,
} from "../api/my-instants.api";
import * as jsdom from "jsdom";

const getDownloadUrl = async (originalUrl: string | null) => {
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

  const downloadPage = await getNodeDownloadPage(originalUrl);

  const downloadLink = Array.from(
    new jsdom.JSDOM(downloadPage).window.document.querySelectorAll("a"),
  ).find((node: HTMLAnchorElement) => {
    return node.href.includes(".mp3") && node.hasAttribute("download");
  });

  if (downloadLink) {
    return `https://www.myinstants.com${downloadLink.href}`;
  }

  return "not-found";
};

export const getSoundNodes = async (searchString: string) => {
  const result = await getSoundNodesApi(searchString);

  const allLabels: Array<string> = [];
  const allDownloadLinks: Array<Promise<string>> = [];

  for (const page of result) {
    const document = new jsdom.JSDOM(page);

    document.window.document
      .querySelectorAll("div.instant > a.instant-link")
      .forEach((node) => {
        allLabels.push(node.textContent);
        allDownloadLinks.push(getDownloadUrl(node.getAttribute("href")));
      });
  }

  const allLinksResolved = await Promise.all(allDownloadLinks);

  const finalList = allLabels
    .toSorted((a, b) => a.localeCompare(b))
    .map((label, index) => ({
      label,
      download_url: allLinksResolved[index] ?? "not-found",
    }));

  return finalList;
};
