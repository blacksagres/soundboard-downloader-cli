"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const https = require("https");
const fs = require("fs");
const downloadFile = (url, config) => {
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
exports.downloadFile = downloadFile;
//# sourceMappingURL=file-downloader.service.js.map