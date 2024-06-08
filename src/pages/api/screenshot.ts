import { type NextApiRequest, type NextApiResponse } from 'next';
import { preprocess, z } from 'zod';
import { use } from 'next-api-route-middleware';

import { notify, SlackChannel } from '~/lib/slack';
import { authMiddleware } from '~/middleware/authMiddleware';

import getScreenshot from '../../lib/puppeteer';

const { UPTIME_SERVICE_URL } = process.env;

export const schema = z.object({
  url: z.string().min(1).max(2048),
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
  callbackUrl: z.string().optional(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | string
    | Buffer
    | {
        error: string;
      }
  >,
) {
  try {
    console.log('Request query:', req.query);
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
    console.log('Screenshot generated');

    if (!file) {
      console.error('Failed to generate screenshot');
      await notify.slack(
        `Failed to generate screenshot for ${parsedReq.data.url}`,
        SlackChannel.SCREENSHOT,
      );

      return res
        .status(500)
        .send('An error occurred while generating the screenshot.');
    }

    const requestUrl = `${UPTIME_SERVICE_URL!}${req.url}`;
    console.log('Screenshot generated');
    let notificationMessage = `Screenshot generated for ${requestUrl}`;
    if (parsedReq.data.callbackUrl) {
      notificationMessage += ` and callback request sent to ${parsedReq.data.callbackUrl}.`;
    }
    console.log('Sending slack notification');
    await notify.slack(notificationMessage, SlackChannel.SCREENSHOT);
    console.log('Slack notification sent');

    if (parsedReq.data.callbackUrl) {
      console.log('Sending callback request');
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
        console.log('Callback request sent');
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
      console.log('Returning image');
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

// @ts-ignore
export default use(authMiddleware, handler);
