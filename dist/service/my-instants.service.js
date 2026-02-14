"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoundNodes = void 0;
const my_instants_api_1 = require("../api/my-instants.api");
const jsdom = require("jsdom");
const getDownloadUrl = async (originalUrl) => {
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
    const downloadPage = await (0, my_instants_api_1.getNodeDownloadPage)(originalUrl);
    const downloadLink = Array.from(new jsdom.JSDOM(downloadPage).window.document.querySelectorAll("a")).find((node) => {
        return node.href.includes(".mp3") && node.hasAttribute("download");
    });
    if (downloadLink) {
        return `https://www.myinstants.com${downloadLink.href}`;
    }
    return "not-found";
};
const getSoundNodes = async (searchString) => {
    const result = await (0, my_instants_api_1.getSoundNodes)(searchString);
    const allLabels = [];
    const allDownloadLinks = [];
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
exports.getSoundNodes = getSoundNodes;
//# sourceMappingURL=my-instants.service.js.map