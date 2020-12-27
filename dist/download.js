"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.downloadImages = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const axios_1 = require("axios");
const cli_progress_1 = require("cli-progress");
const args_1 = require("./args");
const baseFolder = path_1.resolve(args_1.default.folder);
if (!fs_1.existsSync(baseFolder)) {
    fs_1.mkdirSync(baseFolder);
}
function downloadImages(gallery, urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const galleryFolder = path_1.join(baseFolder, gallery);
        if (!fs_1.existsSync(galleryFolder)) {
            try {
                fs_1.mkdirSync(galleryFolder);
            }
            catch (err) {
                console.error("Could not create gallery folder");
                process.exit(1);
            }
        }
        for (const url of urls) {
            const path = path_1.join(galleryFolder, path_1.basename(url));
            let linkDone = false;
            while (!linkDone) {
                try {
                    yield downloadFile(url, path);
                    linkDone = true;
                }
                catch (error) {
                    console.error("Error downloading url:", error.message);
                    try {
                        fs_1.unlinkSync(path);
                    }
                    catch (err) { }
                    console.error("Retrying url:", url);
                }
            }
        }
    });
}
exports.downloadImages = downloadImages;
function downloadFile(url, file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.existsSync(file)) {
            console.warn(`\t${url} already exists, skipping...`);
            return;
        }
        console.error(`\tDownloading ${url} to ${file}...`);
        const downloadBar = new cli_progress_1.SingleBar({}, cli_progress_1.Presets.legacy);
        downloadBar.start(100, 0);
        const response = yield axios_1.default({
            url: encodeURI(url),
            method: "GET",
            responseType: "stream",
        });
        const writer = fs_1.createWriteStream(file);
        const totalSize = response.headers["content-length"];
        let loaded = 0;
        response.data.on("data", (data) => {
            loaded += Buffer.byteLength(data);
            const percent = ((loaded / totalSize) * 100).toFixed(0);
            downloadBar.update(+percent);
        });
        response.data.pipe(writer);
        yield new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        downloadBar.stop();
    });
}
exports.downloadFile = downloadFile;
