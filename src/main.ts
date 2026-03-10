#!/usr/bin/env node

import {
  getPaginatedResults,
  getAllResults,
} from "./service/my-instants.service";
import ora from "ora";
import prompts from "prompts";
import opener from "opener";
import { downloadFile } from "./service/file-downloader.service";
import {
  parseSelections,
  getSelectionMessage,
  isMultipleSelection,
  SoundSelection,
  getFirstSelection,
} from "./utils/selection-utils";
import {
  isNavigationAction,
  getPaginationInfo,
} from "./utils/pagination-utils";

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("👋 see ya!");
  } else {
    // Rethrow unknown errors
    console.error(error);
  }
});

(async function () {
  // Check for --all flag
  const args = process.argv.slice(2);
  let shouldFetchAll = args.includes("--all");

  let answer = (await prompts({
    type: 'text',
    name: 'searchQuery',
    message: "🔍 What sound effects are you looking for?",
    validate: (value: string) => value.trim() !== '' ? true : 'Please enter a search term',
    initial: "wilhelm scream",
  })).searchQuery;

  // Pagination flow
  if (!shouldFetchAll) {
    let currentPage = 1;
    let shouldContinuePagination = true;

    while (shouldContinuePagination) {
      const spinner = ora({
        text: `Loading page ${currentPage}...`,
        color: "magenta",
        spinner: "bouncingBall",
      }).start();

      try {
        const { results, hasNextPage, hasPreviousPage } =
          await getPaginatedResults(answer, currentPage);
        spinner.stop();

        console.log(
          getPaginationInfo(currentPage, results.length, hasNextPage),
        );

        // Prepare sound choices
        const soundChoices = results.map((sound: { label: string; download_url: string }) => ({
          title: `${sound.label} 🎵`,
          value: `${sound.label}||${sound.download_url}` as const,
        }));

        // Add navigation choices as separate actions
        const navigationChoices = [
          {
            title: hasPreviousPage ? "⏮️ Previous page" : "⏮️ Previous page (disabled)",
            value: "action:prev-page",
            disabled: !hasPreviousPage
          },
          {
            title: hasNextPage ? "⏭️ Next page" : "⏭️ Next page (disabled)",
            value: "action:next-page",
            disabled: !hasNextPage
          },
          {
            title: "🔍 New search",
            value: "action:new-search"
          },
          {
            title: "📋 Show all results",
            value: "action:show-all"
          }
        ];

        const allChoices = [...soundChoices, ...navigationChoices];

        // Use select (radio) for single selection
        const selectionResponse = await prompts({
          type: 'select',
          name: 'selection',
          message: "🎵 Select a sound or choose a navigation option:",
          choices: allChoices,
        });

        const selection = selectionResponse.selection;

        // Handle navigation actions
        if (isNavigationAction(selection)) {
          switch (selection) {
            case "action:prev-page":
              if (hasPreviousPage) currentPage--;
              continue;

            case "action:next-page":
              if (hasNextPage) currentPage++;
              continue;

            case "action:new-search":
              // Reset for new search
              answer = (await prompts({
                type: 'text',
                name: 'searchQuery',
                message: "🔍 What sound effects are you looking for?",
                validate: (value: string) => value.trim() !== '' ? true : 'Please enter a search term',
                initial: answer,
              })).searchQuery;
              currentPage = 1;
              continue;

            case "action:show-all":
              // Switch to fetch-all mode
              shouldFetchAll = true;
              shouldContinuePagination = false;
              break;
          }
          continue;
        }

        // If we get here, user selected a sound
        shouldContinuePagination = false;

        // Process the single sound selection
        const selections = parseSelections([selection as string]);

        // Available actions for single sound selection
        const actions = [
          {
            title: "💾 Download",
            value: "action:download",
          },
          {
            title: "▶️ Play",
            value: "action:play",
          },
          {
            title: "🔗 Show download URL (you can pipe this to other commands)",
            value: "action:show-url",
          },
        ];

        const actionResponse = await prompts({
          type: 'select',
          name: 'action',
          message: getSelectionMessage(selections),
          choices: actions,
        });

        const action: string = actionResponse.action;

        if (action === "action:show-url") {
          const firstSelection = getFirstSelection(selections);
          if (firstSelection) {
            console.log(firstSelection.downloadUrl);
          }
        }

        if (action === "action:play") {
          const firstSelection = getFirstSelection(selections);
          if (firstSelection) {
            opener(firstSelection.downloadUrl);
          }
        }

        if (action === "action:download") {
          const totalDownloads = selections.length;
          let completedDownloads = 0;
          let failedDownloads = 0;
          const failedFiles: string[] = [];

          const masterSpinner = ora({
            text: `Preparing to download ${totalDownloads} file${totalDownloads !== 1 ? "s" : ""}...`,
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
              console.error(
                `\nFailed to download ${selection.label}:`,
                error instanceof Error ? error.message : String(error),
              );
            }
          }

          // Final summary - only show once at the end
          masterSpinner.stop();

          if (failedDownloads === 0) {
            console.log(
              `✅ Download complete! All ${completedDownloads} file${completedDownloads !== 1 ? "s" : ""} downloaded successfully.`,
            );
          } else {
            console.log(
              `⚠️  Download partially complete: ${completedDownloads} successful, ${failedDownloads} failed.`,
            );
            if (failedFiles.length > 0) {
              console.log("\nFailed files:");
              failedFiles.forEach((file) => console.log(`  - ${file}`));
            }
          }
        }
      } catch (error) {
        spinner.stop();
        console.error(
          "❌ Error loading results:",
          error instanceof Error ? error.message : String(error),
        );

        const retryResponse = await prompts({
          type: 'select',
          name: 'retry',
          message: "What would you like to do?",
          choices: [
            { title: "🔍 Try a new search", value: "new-search" },
            { title: "🚪 Exit", value: "exit" },
          ],
        });

        if (retryResponse.retry === "new-search") {
          answer = (await prompts({
            type: 'text',
            name: 'searchQuery',
            message: "🔍 What sound effects are you looking for?",
            validate: (value: string) => value.trim() !== '' ? true : 'Please enter a search term',
            initial: answer,
          })).searchQuery;
          currentPage = 1;
          continue;
        } else {
          process.exit(0);
        }
      }
    }
  }

  // Fetch-all mode
  if (shouldFetchAll) {
    const spinner = ora({
      text: "Loading all results...",
      color: "magenta",
      spinner: "bouncingBall",
    }).start();

    try {
      const allResults = await getAllResults(answer);
      spinner.stop();

      console.log(
        `🎉 Found ${allResults.length} sound${allResults.length !== 1 ? "s" : ""}!`,
      );

      const rawSelectionsResponse = await prompts({
        type: 'multiselect',
        name: 'selections',
        message:
          "🎵 Which sounds to download? (use space to select multiple, arrows to navigate, search for something directly)",
        choices: allResults.map((sound) => ({
          title: `${sound.label} 🎵`,
          value: `${sound.label}||${sound.download_url}` as const,
        })),
      });

      const rawSelections = rawSelectionsResponse.selections || [];

      // Parse and validate selections
      const selections = parseSelections(rawSelections);
      const multipleSelected = isMultipleSelection(selections);

      // Determine available actions based on selection count
      let actions = [
        {
          title: "💾 Download",
          value: "action:download",
        },
      ];

      // For single selection, add additional options
      if (!multipleSelected) {
        actions = [
          ...actions,
          {
            title: "▶️ Play",
            value: "action:play",
          },
          {
            title: "🔗 Show download URL (you can pipe this to other commands)",
            value: "action:show-url",
          },
        ];
      }

      const actionResponse = await prompts({
        type: 'select',
        name: 'action',
        message: getSelectionMessage(selections),
        choices: actions,
      });

      const action: string = actionResponse.action;

      if (action === "action:show-url" && !multipleSelected) {
        const firstSelection = getFirstSelection(selections);
        if (firstSelection) {
          console.log(firstSelection.downloadUrl);
        }
      }

      if (action === "action:play" && !multipleSelected) {
        const firstSelection = getFirstSelection(selections);
        if (firstSelection) {
          opener(firstSelection.downloadUrl);
        }
      }

      if (action === "action:download") {
        const totalDownloads = selections.length;
        let completedDownloads = 0;
        let failedDownloads = 0;
        const failedFiles: string[] = [];

        const masterSpinner = ora({
          text: `Preparing to download ${totalDownloads} file${totalDownloads !== 1 ? "s" : ""}...`,
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
            console.error(
              `\nFailed to download ${selection.label}:`,
              error instanceof Error ? error.message : String(error),
            );
          }
        }

        // Final summary - only show once at the end
        masterSpinner.stop();

        if (failedDownloads === 0) {
          console.log(
            `✅ Download complete! All ${completedDownloads} file${completedDownloads !== 1 ? "s" : ""} downloaded successfully.`,
          );
        } else {
          console.log(
            `⚠️  Download partially complete: ${completedDownloads} successful, ${failedDownloads} failed.`,
          );
          if (failedFiles.length > 0) {
            console.log("\nFailed files:");
            failedFiles.forEach((file) => console.log(`  - ${file}`));
          }
        }
      }
    } catch (error) {
      spinner.stop();
      console.error(
        "❌ Error loading all results:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
})();