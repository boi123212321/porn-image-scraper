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
const scrapers_1 = require("./scrapers");
const args_1 = require("./args");
const download_1 = require("./download");
const imageExt = [".jpg", ".png", ".jpeg", ".webp"];
const noGalleryName = `_nogallery-${new Date().toISOString()}`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    let urls = args_1.default._;
    if (!urls.length) {
        console.error("node dist url0 url1 ...");
        console.error("Run with --help for details");
        process.exit(1);
    }
    if (args_1.default.dry) {
        console.log(yield scrapers_1.dryRun(urls));
    }
    else {
        for (const url of urls) {
            if (imageExt.some((ext) => url.endsWith(ext))) {
                yield download_1.downloadImages(noGalleryName, [url]);
                continue;
            }
            yield scrapers_1.scrapeLink(url);
        }
    }
    process.exit();
}))();
