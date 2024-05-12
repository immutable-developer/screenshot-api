import { type Page } from "puppeteer-core";

import chrome from "chrome-aws-lambda";
let _page: Page | null;
import { executablePath } from "puppeteer";

let puppeteer: any;
if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

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
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options.executablePath = await chrome.executablePath;
    options.args = chrome.args;
  }
  console.log(options);
  // @ts-ignore
  const browser = await puppeteer.launch(options);
  // @ts-ignore
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  url: string,
  width: string | string[] | undefined,
  height: string | string[] | undefined,
) {
  const page = await getPage();
  // @ts-ignore
  await page.goto(url);
  // @ts-ignore
  await page.setViewport({
    width: Number(width) || 1280,
    height: Number(height) || 720,
    deviceScaleFactor: 2,
  });
  // @ts-ignore
  const file = await page.screenshot();
  // await page.browser().close();

  return file;
}
