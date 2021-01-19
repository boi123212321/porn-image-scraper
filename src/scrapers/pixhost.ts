import { IScraper } from "./interface";
import { qsAll, createDomFromURL } from "../dom";
import { JSDOM } from "jsdom";

export class PixhostScraper implements IScraper {
  domain = "pixhost.to";

  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, ".images a")).map((el) => {
      return el.getAttribute("href");
    });
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments.pop();

    const dom = await createDomFromURL(url);
    const imagePages = this.getImageLinks(dom);

    const links: string[] = [];

    for (const url of imagePages) {
      const dom = await createDomFromURL(url);
      const image = Array.from(qsAll(dom, "#image"))[0];
      links.push(image.getAttribute("src"));
    }

    return {
      gallery,
      links,
    };
  }
}
