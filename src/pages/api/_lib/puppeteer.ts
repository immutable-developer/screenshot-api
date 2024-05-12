import { type Page } from "puppeteer-core";
import puppeteer from "puppeteer-core";

import chrome from "chrome-aws-lambda";
let _page: Page | null;

const isDev = !process.env.AWS_REGION;
const isLocal = !process.env.AWS_REGION;

const exePath = isLocal
  ? await chrome.executablePath
  : await chrome.executablePath;

async function getPage() {
  if (_page) return _page;
  const options = {
    args: chrome.args,
    executablePath: exePath,
    headless: chrome.headless,
  };
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
  await page.browser().close();

  return file;
}
