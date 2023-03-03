import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import addRoutes from "./routes/routes";
import {sendPhoneSurvey} from "./queue/queue";
import {sendEmail} from "./email/email";

// setup express server for case where REST API is needed
const app = express();
// @ts-ignore
app.use(bodyParser.urlencoded({ extended: false }));
addRoutes(app);
exports.app = functions.https.onRequest(app);

sendEmail('rdeepak2002@gmail.com', 'Deepak', '123');

exports.scheduleCallFunction = functions.firestore
    .document('to-contact-for-survey/{docId}')
    .onCreate((doc, context) => {
        const phoneNumberToContact: string = doc?.data()?.phone || '';
        const record: boolean = doc?.data()?.record || false;
        const docId: string = doc?.id || '';
        if (phoneNumberToContact) {
            void sendPhoneSurvey(docId, phoneNumberToContact, record).then(() => {
                console.log("Sent phone survey");
            });
        }
    });

exports.scheduleCallFunction = functions.firestore
    .document('facility/{docId}')
    .onCreate((doc, context) => {
        const name: string = doc?.data()?.name || 'Facility';
        const email: string = doc?.data()?.email;
        const id = doc?.id || "id";
        sendEmail(email, name, id);
    });

