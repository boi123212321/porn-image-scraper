var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PornStarScraper } from "./pornstar";
import { BabesourceScraper } from "./babesource";
import { downloadImages } from "../download";
import { TubsexerScraper } from "./tubsexer";
import { CoedcherryScraper } from "./coedcherry";
import { PornpicsScraper } from "./pornpics";
import { SweetPornstarsScraper } from "./sweet-pornstars";
import { EuropornstarScraper } from "./europornstar";
const scrapers = [
    new BabesourceScraper(),
    new PornStarScraper(),
    new TubsexerScraper(),
    new CoedcherryScraper(),
    new PornpicsScraper(),
    new SweetPornstarsScraper(),
    new EuropornstarScraper(),
];
export function scrapeLink(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(`Getting ${url}...`);
        const scraper = scrapers.find((t) => url.includes(t.domain));
        if (scraper) {
            const result = yield scraper.scrape(url);
            yield downloadImages(result.gallery, result.links.filter(Boolean));
        }
        else {
            console.error("Unsupported site: " + url);
            process.exit(1);
        }
    });
}
export function dryRun(urls) {
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
