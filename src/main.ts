import { getSoundNodes } from "./service/my-instants.service";
import ora from "ora";
import { input, select } from "@inquirer/prompts";

(async function () {
  const answer = await input({ message: "Enter your name" });

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
      value: sound.download_url,
    })),
  });

  console.table(selection);
})();
