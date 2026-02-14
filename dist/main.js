#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const my_instants_service_1 = require("./service/my-instants.service");
const ora_1 = require("ora");
const prompts_1 = require("@inquirer/prompts");
const open_1 = require("open");
const file_downloader_service_1 = require("./service/file-downloader.service");
(async function () {
    const answer = await (0, prompts_1.input)({
        message: "What sound effects are you looking for?",
    });
    const spinner = (0, ora_1.default)({
        text: "Loading result...",
        color: "magenta",
        spinner: "bouncingBall",
    }).start();
    const sounds = await (0, my_instants_service_1.getSoundNodes)(answer);
    spinner.stop();
    const selection = await (0, prompts_1.select)({
        message: "Which one to download?",
        choices: sounds.map((sound) => ({
            name: sound.label,
            value: `${sound.label}||${sound.download_url}`,
        })),
    });
    const [label, downloadUrl] = selection.split("||");
    if (!downloadUrl) {
        throw new ReferenceError(`There is no download URL for: ${label}`);
    }
    const actions = [
        {
            name: "Download",
            value: "action:download",
        },
        {
            name: "Play",
            value: "action:play",
        },
    ];
    const action = await (0, prompts_1.select)({
        message: `Selected: ${label}`,
        choices: actions,
    });
    if (action === "action:play") {
        (0, open_1.default)(downloadUrl);
    }
    if (action === "action:download") {
        const downloadSpinner = (0, ora_1.default)({
            text: "Downloading file...",
            color: "cyan",
            spinner: "growHorizontal",
        }).start();
        const downloadFileName = downloadUrl.split("/").pop();
        (0, file_downloader_service_1.downloadFile)(downloadUrl, {
            destination: `./temp/${downloadFileName}`,
            onStart: () => downloadSpinner.start(),
            onFinish: () => downloadSpinner.stop(),
        });
    }
})();
//# sourceMappingURL=main.js.map