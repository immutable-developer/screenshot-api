import playwright from 'playwright-core';
import chromium from '@sparticuz/chromium';

async function getPage(width: number, height: number) {
  try {
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    return await browser.newPage({
      viewport: {
        width,
        height,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function getScreenshot(
  url: string,
  width: number,
  height: number,
) {
  const page = await getPage(width, height);
  if (!page) return null;
  try {
    await page.goto(url);
    const file = await page.screenshot({
      type: 'png',
    });
    await page.context().close();

    return file;
  } catch (error) {
    console.error(error);
    return null;
  }
}
