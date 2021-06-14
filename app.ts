import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import { ClientConfig, Client, middleware, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk'

const PORT = process.env.PORT || 3000;
const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
}
const client = new Client(clientConfig)

app.get(
    '/',
    async (_: Request, res: Response): Promise<Response> => {
      return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!',
      });
    }
  );

app.post(
    '/webhook',
    async (req: Request, res: Response): Promise<Response> => {
        const events: WebhookEvent[] = req.body.events;

        // Process all of the received events asynchronously.
        const results = await Promise.all(
            events.map(async (event: WebhookEvent) => {
                try {
                    await textEventHandler(event);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.error(err);
                    }

                    // Return an error message.
                    return res.status(500).json({
                        status: 'error',
                    });
                }
            })
        );

        // Return a successfull message.
        return res.status(200).json({
            status: 'success',
            results,
        });
    }
);

// Function handler to receive the text.
const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;

    // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
};


app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});