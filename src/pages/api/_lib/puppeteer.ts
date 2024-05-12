import { type Page } from "puppeteer-core";
import puppeteer from "puppeteer-core";

import chrome from "chrome-aws-lambda";
let _page: Page | null;
import { executablePath } from "puppeteer";

async function getPage() {
  if (_page) return _page;
  const options = {
    args: [
      // ...chrome.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
    // @ts-ignore
    executablePath: executablePath(),
    headless: true,
  };
  console.log(options);
  const browser = await puppeteer.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  url: string,
  width: string | string[] | undefined,
  height: string | string[] | undefined,
) {
  const page = await getPage();
  await page.goto(url);
  await page.setViewport({
    width: Number(width) || 1280,
    height: Number(height) || 720,
    deviceScaleFactor: 2,
  });
  const file = await page.screenshot();
  // await page.browser().close();

  return file;
}
