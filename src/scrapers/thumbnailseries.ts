import { IScraper } from "./interface";
import { qsAll, createDomFromURL } from "../dom";
import { JSDOM } from "jsdom";

export class ThumbnailSeriesScraper implements IScraper {
  domain = "thumbnailseries.com";

  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, "#light-gallery > a")).map((el) => {
      return `https://www.${this.domain}${el.getAttribute("href")}`;
    });
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments.pop();

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(dom);

    return {
      gallery,
      links,
    };
  }
}
