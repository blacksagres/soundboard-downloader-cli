import * as https from "https";
import * as fs from "fs";

export const downloadFile = (
  url: string,
  config: {
    destination: string;
    onStart?: () => void;
    onFinish?: () => void;
  },
) => {
  const file = fs.createWriteStream(config.destination);

  https.get(url, function (response) {
    response.pipe(file);

    file.on("open", () => {
      config.onStart?.();
    });

    file.on("finish", () => {
      file.close();
      config.onFinish?.();
      console.log("Download Completed");
    });
  });
};
