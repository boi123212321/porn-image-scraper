import { IScraper } from "./interface";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class CoedcherryScraper implements IScraper {
  domain = "coedcherry.com";

  getImageLinks(dom: JSDOM) {
    return Array.from(
      qsAll(dom, `#gallery .thumbs figure[itemprop="associatedMedia"] a.track`)
    ).map((el) => {
      return el.getAttribute("href");
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
