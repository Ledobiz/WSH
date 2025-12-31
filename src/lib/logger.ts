import winston from "winston";
import SlackHook from "winston-slack-webhook-transport";
const { combine, timestamp, errors, json } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    transports: [
        new winston.transports.Console(),

        // 2. The Slack "Channel" (Laravel equivalent)
        new SlackHook({
            webhookUrl: process.env.SLACK_WEBHOOK_URL as string,
            channel: 'logs',
            username: 'WSH Logger',
            level: 'error', // Only send errors to Slack to avoid noise
            format: combine(timestamp(), errors({ stack: true }), json()),
            formatter: (info) => ({
                text: `*Next.js Error:* ${info.message}\n` +
                    `*Context:* \`\`\`${JSON.stringify(info.metadata, null, 2)}\`\`\``
            })
        })
    ],
});

export default logger;