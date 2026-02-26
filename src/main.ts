#!/usr/bin/env node

import { getSoundNodes } from "./service/my-instants.service";
import ora from "ora";
import { input, select, checkbox } from "@inquirer/prompts";
import open from "open";
import { downloadFile } from "./service/file-downloader.service";
import { parseSelections, getSelectionMessage, isMultipleSelection, SoundSelection, getFirstSelection } from "./utils/selection-utils";

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("👋 see ya!");
  } else {
    // Rethrow unknown errors
    console.error(error);
  }
});

(async function () {
  const answer = await input({
    message: "🔍 What sound effects are you looking for?",
    required: true,
    default: "wilhelm scream",
  });

  const spinner = ora({
    text: "Loading result...",
    color: "magenta",
    spinner: "bouncingBall",
  }).start();

  const sounds = await getSoundNodes(answer);

  spinner.stop();

  console.log(`🎉 Found ${sounds.length} sound${sounds.length !== 1 ? 's' : ''}!`);

  const rawSelections = await checkbox({
    message:
      "🎵 Which sounds to download? (use space to select multiple, arrows to navigate, search for something directly)",

    pageSize: 30,
    choices: sounds.map((sound) => ({
      name: `${sound.label} 🎵`,
      value: `${sound.label}||${sound.download_url}` as const,
    })),
  });

  // Parse and validate selections
  const selections = parseSelections(rawSelections);
  const multipleSelected = isMultipleSelection(selections);

  // Determine available actions based on selection count
  let actions = [
    {
      name: "💾 Download",
      value: "action:download",
    },
  ] as Array<{ name: string; value: string }>;

  // For single selection, add additional options
  if (!multipleSelected) {
    actions = [
      ...actions,
      {
        name: "▶️ Play",
        value: "action:play",
      },
      {
        name: "🔗 Show download URL (you can pipe this to other commands)",
        value: "action:show-url",
      }
    ];
  }

  const action: string = await select({
    message: getSelectionMessage(selections),
    choices: actions,
  });

  if (action === "action:show-url" && !multipleSelected) {
    const firstSelection = getFirstSelection(selections);
    if (firstSelection) {
      console.log(firstSelection.downloadUrl);
    }
  }

  if (action === "action:play" && !multipleSelected) {
    const firstSelection = getFirstSelection(selections);
    if (firstSelection) {
      open(firstSelection.downloadUrl);
    }
  }

  if (action === "action:download") {
    const totalDownloads = selections.length;
    let completedDownloads = 0;
    let failedDownloads = 0;
    const failedFiles: string[] = [];

    const masterSpinner = ora({
      text: `Preparing to download ${totalDownloads} file${totalDownloads !== 1 ? 's' : ''}...`,
      color: "cyan",
      spinner: "growHorizontal",
    }).start();

    // Process all downloads sequentially
    for (const [index, selection] of selections.entries()) {
      masterSpinner.text = `Downloading ${selection.label} (${index + 1}/${totalDownloads})...`;

      try {
        const downloadFileName = selection.downloadUrl.split("/").pop();

        if (!downloadFileName) {
          throw new ReferenceError(
            `Could not find download file name for: [${selection.downloadUrl}], could it be a malformed link?`,
          );
        }

        // Download directly to current working directory
        await downloadFile(selection.downloadUrl, {
          destination: downloadFileName,
        });

        completedDownloads++;
        masterSpinner.text = `Downloaded ${completedDownloads}/${totalDownloads} files...`;

      } catch (error) {
        failedDownloads++;
        failedFiles.push(selection.label);
        masterSpinner.text = `Error downloading ${selection.label} (${completedDownloads} successful, ${failedDownloads} failed)`;
        console.error(`\nFailed to download ${selection.label}:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Final summary - only show once at the end
    masterSpinner.stop();
    
    if (failedDownloads === 0) {
      console.log(`✅ Download complete! All ${completedDownloads} file${completedDownloads !== 1 ? 's' : ''} downloaded successfully.`);
    } else {
      console.log(`⚠️  Download partially complete: ${completedDownloads} successful, ${failedDownloads} failed.`);
      if (failedFiles.length > 0) {
        console.log("\nFailed files:");
        failedFiles.forEach(file => console.log(`  - ${file}`));
      }
    }
  }
})();
