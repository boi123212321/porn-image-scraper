import { createWriteStream, mkdirSync, existsSync, unlinkSync } from "fs";
import { join, basename, resolve } from "path";
import Axios from "axios";
import { SingleBar, Presets } from "cli-progress";
import argv from "./args";

const baseFolder = resolve(argv.folder);
if (!existsSync(baseFolder)) {
  mkdirSync(baseFolder);
}

export async function downloadGallery(gallery: string, urls: string[]) {
  const galleryFolder = join(baseFolder, gallery);

  if (!existsSync(galleryFolder)) {
    try {
      mkdirSync(galleryFolder);
    } catch (err) {
      console.error("Could not create gallery folder");
      process.exit(1);
    }
  }

  for (let i = 0; i < urls.length; i++) {
    const num = (i + 1).toString().padStart(3, "0");
    const url = urls[i];
    const path = join(galleryFolder, num);

    let retryCount = 0;

    let linkDone = false;
    while (!linkDone) {
      try {
        await downloadFile(url, path);
        linkDone = true;
      } catch (error) {
        console.error("Error downloading url:", error.message);
        try {
          unlinkSync(path);
        } catch (err) {}
        console.error("Retrying url:", url);
        retryCount++;
        if (retryCount >= 100) {
          linkDone = true;
          console.error("Giving up on url:", url);
        }
      }
    }
  }
}

export async function downloadFile(url: string, file: string) {
  if (existsSync(file)) {
    console.warn(`\t${url} already exists, skipping...`);
    return;
  }

  console.error(`\tDownloading ${url} to ${file}...`);

  const downloadBar = new SingleBar({}, Presets.legacy);
  downloadBar.start(100, 0);

  const response = await Axios({
    url: encodeURI(url),
    method: "GET",
    responseType: "stream",
  });

  const writer = createWriteStream(file);

  const totalSize = response.headers["content-length"];
  let loaded = 0;

  response.data.on("data", (data: Buffer) => {
    loaded += Buffer.byteLength(data);
    const percent = ((loaded / totalSize) * 100).toFixed(0);
    downloadBar.update(+percent);
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  downloadBar.stop();
}
