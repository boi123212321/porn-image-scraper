var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { qsAll, createDomFromURL } from "../dom";
export class PornStarScraper {
    constructor() {
        this.domain = "porn-star.com";
    }
    getImageLinks(gallery, dom) {
        return Array.from(qsAll(dom, ".thumbnails-gallery img"))
            .map((el) => {
            return el.getAttribute("src");
        })
            .map((url) => `https://porn-star.com/${gallery}/${url.replace("thumbs/", "")}`);
    }
    scrape(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlSegments = url.split("/");
            const gallery = urlSegments[urlSegments.length - 2];
            const dom = yield createDomFromURL(url);
            const links = this.getImageLinks(gallery, dom);
            return {
                gallery,
                links,
            };
        });
    }
}
