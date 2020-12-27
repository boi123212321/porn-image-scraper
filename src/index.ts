import { scrapeLink, dryRun } from "./scrapers";
import argv from "./args";
import { downloadImages } from "./download";

const imageExt = [".jpg", ".png", ".jpeg", ".webp"];

(async () => {
  let urls = argv._;

  if (!urls.length) {
    console.error("(ts-)node . url0 url1 ...");
    console.error("Run with --help for details");
    process.exit(1);
  }

  if (argv.dry) {
    console.log(await dryRun(urls));
  } else {
    for (const url of urls) {
      if (imageExt.some((ext) => url.endsWith(ext))) {
        await downloadImages(`_nogallery-${new Date().toISOString()}`, [url]);
        continue;
      }

      await scrapeLink(url);
    }
  }

  process.exit();
})();
