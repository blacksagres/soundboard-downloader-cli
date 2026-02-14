import { initLip, Lipgloss, huh } from "charsm";
import { getSoundNodes } from "./service/my-instants.service";
import ora from "ora";

(async function () {
  const ini = await initLip();
  const lip = new Lipgloss();

  huh.SetTheme("dracula");

  const m = huh.Confirm("Do you like pizza?", "Yes", "No");
  console.log(m.run());

  const i = new huh.NewInput(
    {
      Title: "What sounds are you looking for?",
      Description: "Search for a specific sound effect.",
      Placeholder: "e.g., memes, resident evil",
      validators: "no_numbers,required",
    },
    0, // Mode: Single Input
  );
  i.load();
  const searchTerm = i.run();

  const spinner = ora({
    text: "Loading result...",
    color: "magenta",
    spinner: "bouncingBall",
  }).start();

  const sounds = await getSoundNodes(searchTerm);

  const tabledata = {
    headers: ["Sound name", "Download URL"],
    rows: sounds.map((sound) => [sound.label, sound.download_url]),
  };

  spinner.stop();

  const table = lip.newTable({
    data: tabledata,
    table: { border: "rounded", color: "99" },
    header: { color: "212", bold: true },
    rows: {
      even: { color: "246" },
    },
  });

  console.log(table);
})();
