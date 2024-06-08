import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    SLACK_UPTIME_WEBHOOK_URL: z.string(),
    SLACK_SCREENSHOT_API_WEBHOOK_URL: z.string(),
    UPTIME_REPORTING_URL: z.string(),
    UPTIME_SERVICE_URL: z.string(),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SLACK_UPTIME_WEBHOOK_URL: process.env.SLACK_UPTIME_WEBHOOK_URL,
    UPTIME_REPORTING_URL: process.env.UPTIME_REPORTING_URL,
    UPTIME_SERVICE_URL: process.env.UPTIME_SERVICE_URL,
    SLACK_SCREENSHOT_API_WEBHOOK_URL:
      process.env.SLACK_SCREENSHOT_API_WEBHOOK_URL,
  },
  skipValidation: false,
  emptyStringAsUndefined: true,
});

export default env;
