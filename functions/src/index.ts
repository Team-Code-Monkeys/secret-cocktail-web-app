import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
// import {startPhoneSurveyConsumerQueue} from "./queue/queue";
// import addRoutes from "./routes/routes";

// listen for updates in database for numbers to send phone survey to
// startPhoneSurveyConsumerQueue();

// setup express server for case where REST API is needed
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// addRoutes(app);
exports.app = functions.https.onRequest(app);
