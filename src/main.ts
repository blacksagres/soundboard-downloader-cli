#!/usr/bin/env node

import { getSoundNodes } from "./service/my-instants.service";
import ora from "ora";
import { input, select } from "@inquirer/prompts";
import open from "open";
import { downloadFile } from "./service/file-downloader.service";

(async function () {
  const answer = await input({
    message: "What sound effects are you looking for?",
  });

  const spinner = ora({
    text: "Loading result...",
    color: "magenta",
    spinner: "bouncingBall",
  }).start();

  const sounds = await getSoundNodes(answer);

  spinner.stop();

  const selection = await select({
    message: "Which one to download?",
    choices: sounds.map((sound) => ({
      name: sound.label,
      value: `${sound.label}||${sound.download_url}` as const,
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
  ] as const;

  const action = await select({
    message: `Selected: ${label}`,
    choices: actions,
  });

  if (action === "action:play") {
    open(downloadUrl);
  }

  if (action === "action:download") {
    const downloadSpinner = ora({
      text: "Downloading file...",
      color: "cyan",
      spinner: "growHorizontal",
    }).start();

    const downloadFileName = downloadUrl.split("/").pop();

    // Download directly to current working directory
    downloadFile(downloadUrl, {
      destination: downloadFileName!,
      onStart: () => downloadSpinner.start(),
      onFinish: () => downloadSpinner.stop(),
    });
  }
})();
