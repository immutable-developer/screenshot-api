import { type NextApiRequest, type NextApiResponse } from 'next';

import { notify, SlackChannel, uptimeMessage } from '~/slack';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'GET') {
      console.log('Running every minute cron job');
      await notify.slack(uptimeMessage, SlackChannel.UPTIME);
      console.log('completed uptime report');
    } else {
      console.log('Method not allowed');
      return res.status(405).send({ error: 'Method not allowed!' });
    }
    console.log('Finished running every minute cron job');
    return res.status(200).send({ data: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).send('The server encountered an error.');
  }
}

export const config = {
  maxDuration: 300,
};
