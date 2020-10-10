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
exports.dryRun = exports.scrapeLink = void 0;
const pornstar_1 = require("./pornstar");
const babesource_1 = require("./babesource");
const download_1 = require("../download");
const tubsexer_1 = require("./tubsexer");
const coedcherry_1 = require("./coedcherry");
const pornpics_1 = require("./pornpics");
const sweet_pornstars_1 = require("./sweet-pornstars");
const europornstar_1 = require("./europornstar");
const scrapers = [
    new babesource_1.BabesourceScraper(),
    new pornstar_1.PornStarScraper(),
    new tubsexer_1.TubsexerScraper(),
    new coedcherry_1.CoedcherryScraper(),
    new pornpics_1.PornpicsScraper(),
    new sweet_pornstars_1.SweetPornstarsScraper(),
    new europornstar_1.EuropornstarScraper(),
];
function scrapeLink(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(`Getting ${url}...`);
        const scraper = scrapers.find((t) => url.includes(t.domain));
        if (scraper) {
            const result = yield scraper.scrape(url);
            yield download_1.downloadImages(result.gallery, result.links.filter(Boolean));
        }
        else {
            console.error("Unsupported site: " + url);
            process.exit(1);
        }
    });
}
exports.scrapeLink = scrapeLink;
function dryRun(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error("Dry run...");
        const result = {};
        for (const url of urls) {
            const scraper = scrapers.find((t) => url.includes(t.domain));
            if (scraper) {
                try {
                    const scraperResult = yield scraper.scrape(url);
                    result[url] = scraperResult;
                }
                catch (error) {
                    console.error(error.message);
                }
            }
            else {
                console.error("Unsupported site: " + url);
                process.exit(1);
            }
        }
        return result;
    });
}
exports.dryRun = dryRun;
