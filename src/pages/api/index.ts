import { getScreenshot } from "./_lib/puppeteer";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  maxDuration: 60,
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.query.url) return res.status(400).send("No url query specified.");
  if (typeof req.query.url !== "string")
    return res.status(400).send("Invalid url query specified.");
  if (!checkUrl(req.query.url))
    return res.status(400).send("Invalid url query specified.");
  try {
    if (
      typeof req.query.width !== "string" ||
      typeof req.query.height !== "string"
    )
      return res.status(400).send("Invalid width or height query specified.");
    if (isNaN(parseInt(req.query.width)) || isNaN(parseInt(req.query.height)))
      return res.status(400).send("Invalid width or height query specified.");
    if (parseInt(req.query.width) < 1 || parseInt(req.query.height) < 1)
      return res.status(400).send("Invalid width or height query specified.");
    if (parseInt(req.query.width) > 1920 || parseInt(req.query.height) > 1080)
      return res.status(400).send("Invalid width or height query specified.");
    const file = await getScreenshot(
      req.query.url,
      req.query.width,
      req.query.height,
    );
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=86400, max-age=86400",
    );
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "The server encountered an error. You may have inputted an invalid query.",
      );
  }
}

function checkUrl(string: string) {
  try {
    new URL(string);
  } catch (error) {
    return false;
  }
  return true;
}
