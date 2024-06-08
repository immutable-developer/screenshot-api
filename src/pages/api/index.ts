import { type NextApiRequest, type NextApiResponse } from 'next';
import { preprocess, z } from 'zod';

import getScreenshot from '../../puppeteer';

export const schema = z.object({
  url: z.string().url().min(1).max(2048),
  width: preprocess(
    (_width) => parseInt(z.string().parse(_width), 10),
    z.number().int().nonnegative().max(1920).min(1),
  ).refine((width) => width % 2 === 0, {
    message: 'The width specified must be an even number.',
  }),
  height: preprocess(
    (_height) => parseInt(z.string().parse(_height), 10),
    z.number().int().nonnegative().max(1080).min(1),
  ).refine((height) => height % 2 === 0, {
    message: 'The height specified must be an even number.',
  }),
  callbackUrl: z.string().url().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const parsedReq = schema.safeParse(req.query);
    if (!parsedReq.success)
      return res
        .status(400)
        .send(
          `Invalid query specified. ${parsedReq.error.errors.map((error) => error.message).join(' ')}`,
        );

    const file = await getScreenshot(
      parsedReq.data.url,
      parsedReq.data.width,
      parsedReq.data.height,
    );
    if (!file)
      return res
        .status(500)
        .send('An error occurred while generating the screenshot.');

    if (parsedReq.data.callbackUrl) {
      try {
        await fetch(parsedReq.data.callbackUrl, {
          method: 'POST',
          body: JSON.stringify({
            url: parsedReq.data.url,
            width: parsedReq.data.width,
            height: parsedReq.data.height,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return res
          .status(200)
          .send(`Callback request sent to ${parsedReq.data.callbackUrl}.`);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .send('An error occurred while sending the callback request.');
      }
    } else {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Cache-Control',
        'public, immutable, no-transform, s-maxage=86400, max-age=86400',
      );
      return res.status(200).end(file);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(
        'The server encountered an error. You may have inputted an invalid query.',
      );
  }
}

export const config = {
  maxDuration: 300,
};
