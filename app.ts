import express, { Request, response, Response } from 'express';
import dotenv from 'dotenv';
import { ClientConfig, Client, middleware, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk'
import dialogflow from '@google-cloud/dialogflow';
import { createConnection } from 'mysql2/promise';
import { dbConfig } from './config/config'

const PORT = process.env.PORT || 3000;
const app = express();

const dbConfigByEnv: object = {}
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// LINE
const clientConfig: ClientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
}
const client = new Client(clientConfig);

// dialogflow
const languageCode = 'zh-TW';
const projectId = 'my-line-chatbot-yutq';
const credentials = {
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    private_key: (process.env.DIALOGFLOW_PRIVATE_KEY as string).replace(/\\n/g, '\n')
}

// console.log('credentials=>', credentials)
const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

// mysql connection
const connection = createConnection(process.env.NODE_ENV !== 'production' ? dbConfig.development : dbConfig.production);

// async function createTable() {
//     try {
//         const con = await connection
//         const result = await con.query('select * from `flavors`');
//         console.table(result[0])
//         await con.end()

//     } catch (err) {
//         console.log(err)
//         throw Error(err)
//     }
// }

// createTable()

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
    middleware({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
        channelSecret: process.env.CHANNEL_SECRET as string,
    }),
    async (req: Request, res: Response): Promise<Response> => {
        const events: WebhookEvent[] = req.body.events;


        // Process all of the received events asynchronously.
        const results = await Promise.all(
            events.map(async (event: WebhookEvent) => {
                try {
                    console.log(111)
                    await textEventHandler(event);
                } catch (err) {
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
    console.log(222)
    console.log('event=>', event)
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    const { replyToken } = event;
    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (event.message.type) {

                case 'text':
                    if (event.message.text === '查寵物') {
                        const con = await connection;
                        const result = await con.query('select * from `flavors`');
                        console.table(result[0])
                        console.log(result[0])
                        const response: TextMessage = {
                            type: 'text',
                            text: result[0].toString() as string
                        };
                        return await client.replyMessage(replyToken, response);

                    }

                    console.log(7777777)
                    // const response: TextMessage = {
                    //     type: 'text',
                    //     text: message.text
                    // };

                    // detect intent
                    const responseByIntent = await handleText(event);
                    const response: TextMessage = {
                        type: 'text',
                        text: responseByIntent as string
                    };
                    await client.replyMessage(replyToken, response);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
};

async function handleText(event: any) {
    console.log(333)
    console.log('event=>', event)
    const sessionId = event.source.userId;
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    console.log('event.message.text=>', event.message.text)
    const text = event.message.text;
    const request = {
        session: sessionPath,
        // queryParams: {
        // payload: structjson.jsonToStructProto({
        //     "data": event,
        //     "source": "line"
        // })
        // },
        queryInput: {
            text: {
                text: text,
                languageCode: languageCode
            }
        }
    };

    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result?.queryText}`);
    console.log(`  Response: ${result?.fulfillmentText}`);
    if (result?.intent) {
        console.log(`  Intent: ${result?.intent.displayName}`);
    } else {
        console.log('  No intent matched.');
    }
    return result?.fulfillmentText
}

app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});