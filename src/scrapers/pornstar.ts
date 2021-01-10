import { IScraper } from "./interface";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class PornStarScraper implements IScraper {
  domain = "porn-star.com";

  getImageLinks(gallery: string, dom: JSDOM) {
    return Array.from(qsAll(dom, ".thumbnails-gallery img"))
      .map((el) => {
        return el.getAttribute("src");
      })
      .map(
        (url) =>
          `https://porn-star.com/${gallery}/${url.replace("thumbs/", "")}`
      );
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments[urlSegments.length - 2];

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(gallery, dom);

    return {
      gallery,
      links,
    };
  }
}
