// import fetch from 'node-fetch';
import { type Page, expect, test } from "@playwright/test";
import { removeLoadingAttributeFromImages, waitForServer } from "./helper";
import { urls } from "../urls";

const domains = {
	def: process.env.STAGE_DOMAIN || "5173",
	new: process.env.PROD_DOMAIN || "3000",
};



for (const url of urls) {
	test(`ステージング環境と本番環境のスクリーンショット比較: ${url}`, async ({
		page,
	}, testInfo) => {
		const fileName = url.replace('http://localhost:3000/',"").replace(/[^a-zA-Z0-9]/g, "-");
		console.log(fileName);
		const warmup = async () => {
			await removeLoadingAttributeFromImages(page);
			await page.evaluate(() => {
				window.scrollTo({
					top: document.body.scrollHeight,
					behavior: "smooth",
				});
			});
			await page.waitForTimeout(1000);
			await page.evaluate(() => {
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
			await page.waitForTimeout(1200);
		};
		const defUrl = url.includes(domains.def)
			? url
			: url.replace(domains.new, domains.def);
		console.log({ defUrl });
		const newUrl = url.includes(domains.new)
			? url
			: url.replace(domains.def, domains.new);
		console.log({ newUrl });
		await waitForServer(defUrl);
		await page.goto(defUrl);
		await warmup();
		await page.screenshot({
			path: `${testInfo.snapshotPath(`${fileName}.png`)}`,
			fullPage: true,
		});

		
		await page.goto(newUrl);
		await warmup();
		
		expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({ name: `${fileName}.png`,maxDiffPixelRatio: 0.01 })
		// await expect(page).toHaveScreenshot('result.png', { fullPage: true,maxDiffPixelRatio: 0.05});
		
	});
}
