"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var bot_sdk_1 = require("@line/bot-sdk");
var dialogflow_1 = __importDefault(require("@google-cloud/dialogflow"));
var PORT = process.env.PORT || 3000;
var app = express_1.default();
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
// LINE
var clientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
};
var client = new bot_sdk_1.Client(clientConfig);
// dialogflow
var languageCode = 'zh-TW';
var projectId = 'my-line-chatbot-yutq';
var credentials = {
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY
};
var sessionClient = new dialogflow_1.default.SessionsClient({ projectId: projectId, credentials: credentials });
app.get('/', function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(200).json({
                status: 'success',
                message: 'Connected successfully!',
            })];
    });
}); });
app.post('/webhook', bot_sdk_1.middleware({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                events = req.body.events;
                return [4 /*yield*/, Promise.all(events.map(function (event) { return __awaiter(void 0, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, textEventHandler(event)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    if (err_1 instanceof Error) {
                                        console.error(err_1);
                                    }
                                    // Return an error message.
                                    return [2 /*return*/, res.status(500).json({
                                            status: 'error',
                                        })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                results = _a.sent();
                // Return a successfull message.
                return [2 /*return*/, res.status(200).json({
                        status: 'success',
                        results: results,
                    })];
        }
    });
}); });
// Function handler to receive the text.
var textEventHandler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var replyToken, _a, message, _b, responseByIntent, response_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                // Process all variables here.
                if (event.type !== 'message' || event.message.type !== 'text') {
                    return [2 /*return*/];
                }
                replyToken = event.replyToken;
                _a = event.type;
                switch (_a) {
                    case 'message': return [3 /*break*/, 1];
                }
                return [3 /*break*/, 6];
            case 1:
                message = event.message;
                _b = event.message.type;
                switch (_b) {
                    case 'text': return [3 /*break*/, 2];
                }
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, handleText(message.text)];
            case 3:
                responseByIntent = _c.sent();
                response_1 = {
                    type: 'text',
                    text: responseByIntent
                };
                return [4 /*yield*/, client.replyMessage(replyToken, response_1)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5: throw new Error("Unknown message: " + JSON.stringify(message));
            case 6: throw new Error("Unknown event: " + JSON.stringify(event));
        }
    });
}); };
function handleText(event) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, sessionPath, text, request, responses, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = event.source.userId;
                    sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
                    text = event.message.text;
                    request = {
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
                    return [4 /*yield*/, sessionClient.detectIntent(request)];
                case 1:
                    responses = _a.sent();
                    console.log('Detected intent');
                    result = responses[0].queryResult;
                    console.log("  Query: " + (result === null || result === void 0 ? void 0 : result.queryText));
                    console.log("  Response: " + (result === null || result === void 0 ? void 0 : result.fulfillmentText));
                    if (result === null || result === void 0 ? void 0 : result.intent) {
                        console.log("  Intent: " + (result === null || result === void 0 ? void 0 : result.intent.displayName));
                    }
                    else {
                        console.log('  No intent matched.');
                    }
                    return [2 /*return*/, result === null || result === void 0 ? void 0 : result.fulfillmentText];
            }
        });
    });
}
app.listen(PORT, function () {
    console.log("Application is live and listening on port " + PORT);
});
