import playwright from "playwright-core";
import chromium from "@sparticuz/chromium";

async function getPage(width: string, height: string) {
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless === "shell" ? false : true,
  });

  return await browser.newPage({
    viewport: {
      width: Number(width) || 1280,
      height: Number(height) || 720,
    },
  });
}

export async function getScreenshot(
  url: string,
  width: string,
  height: string,
) {
  const page = await getPage(width, height);
  await page.goto(url);
  const file = await page.screenshot({
    type: "png",
  });
  await page.context().close();

  return file;
}
