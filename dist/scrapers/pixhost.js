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
exports.PixhostScraper = void 0;
const dom_1 = require("../dom");
class PixhostScraper {
    constructor() {
        this.domain = "pixhost.to";
    }
    getImageLinks(dom) {
        return Array.from(dom_1.qsAll(dom, ".images a")).map((el) => {
            return el.getAttribute("href");
        });
    }
    scrape(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlSegments = url.split("/").filter(Boolean);
            const gallery = urlSegments.pop();
            const dom = yield dom_1.createDomFromURL(url);
            const imagePages = this.getImageLinks(dom);
            const links = [];
            for (const url of imagePages) {
                const dom = yield dom_1.createDomFromURL(url);
                const image = Array.from(dom_1.qsAll(dom, "#image"))[0];
                links.push(image.getAttribute("src"));
            }
            return {
                gallery,
                links,
            };
        });
    }
}
exports.PixhostScraper = PixhostScraper;
