import { promises as fsPromises } from "node:fs";
import type { Page } from "@playwright/test";

// Remove the loading attribute from images
export async function removeLoadingAttributeFromImages(page: Page) {
	const lazyImages = await page.$$('img[loading="lazy"]:visible');
	for (const lazyImage of lazyImages) {
		await lazyImage.evaluate((element) => {
			element.removeAttribute("loading");
			element.scrollIntoView({ behavior: "smooth", block: "end" });
		});
	}
}

// fsモジュールからpromises APIをインポートして、fs.readFileをPromiseバージョンとして使用します

export const readUrlsFromFile = async (filePath: string): Promise<string[]> => {
	const data = await fsPromises.readFile(filePath, "utf-8");
	const lines = data.split("\n");
	return lines;
};

// サーバーが応答するまで待機する関数
export async function waitForServer(url: string, retryInterval = 2000, maxRetries = 10) {
	for (let i = 0; i < maxRetries; i++) {
	  try {
		const response = await fetch(url);
		if (response.ok) {
		  return;
		}
	  } catch (error) {
		await new Promise(resolve => setTimeout(resolve, retryInterval));
	  }
	}
	throw new Error(`Server at ${url} is not responding after ${maxRetries} retries.`);
  }