var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createWriteStream, mkdirSync, existsSync, unlinkSync } from "fs";
import { join, basename, resolve } from "path";
import Axios from "axios";
import { SingleBar, Presets } from "cli-progress";
import argv from "./args";
const baseFolder = resolve(argv.folder);
if (!existsSync(baseFolder)) {
    mkdirSync(baseFolder);
}
export function downloadImages(gallery, urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const galleryFolder = join(baseFolder, gallery);
        if (!existsSync(galleryFolder)) {
            try {
                mkdirSync(galleryFolder);
            }
            catch (err) {
                console.error("Could not create gallery folder");
                process.exit(1);
            }
        }
        for (const url of urls) {
            const path = join(galleryFolder, basename(url));
            let linkDone = false;
            while (!linkDone) {
                try {
                    yield downloadFile(url, path);
                    linkDone = true;
                }
                catch (error) {
                    console.error("Error downloading url:", url);
                    try {
                        unlinkSync(path);
                    }
                    catch (err) { }
                    console.error("Retrying url:", url);
                }
            }
        }
    });
}
export function downloadFile(url, file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (existsSync(file)) {
            console.warn(`\t${url} already exists, skipping...`);
            return;
        }
        console.error(`\tDownloading ${url} to ${file}...`);
        const downloadBar = new SingleBar({}, Presets.legacy);
        downloadBar.start(100, 0);
        const response = yield Axios({
            url: url,
            method: "GET",
            responseType: "stream",
        });
        const writer = createWriteStream(file);
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
