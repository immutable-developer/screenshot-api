import { retryFetch } from './utils';

const {
  SLACK_SCREENSHOT_API_WEBHOOK_URL,
  SLACK_UPTIME_WEBHOOK_URL,
  UPTIME_REPORTING_URL,
  UPTIME_SERVICE_URL,
} = process.env;

export enum SlackChannel {
  UPTIME = 'uptime',
  SCREENSHOT = 'screenshot',
}

const typeToWebhookUrl: Record<SlackChannel, string> = {
  [SlackChannel.UPTIME]: SLACK_UPTIME_WEBHOOK_URL!,
  [SlackChannel.SCREENSHOT]: SLACK_SCREENSHOT_API_WEBHOOK_URL!,
};

export const uptimeMessage = `Uptime Report: ${UPTIME_REPORTING_URL}. \nService Available: ${UPTIME_SERVICE_URL}`;

const sendSlackMessage = async (message: string, type: SlackChannel) => {
  const webhookUrl = typeToWebhookUrl[type];
  console.log('Sending slack message', message, type, webhookUrl);
  return retryFetch(webhookUrl, 3000, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  })
    .then(() => {
      console.log('Slack message sent');
    })
    .catch((e) => {
      console.log('Error sending slack message', e);
    });
};

export const notify = {
  slack: sendSlackMessage,
};
