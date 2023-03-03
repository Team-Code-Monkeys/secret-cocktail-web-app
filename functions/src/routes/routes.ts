// import {
//     eventEndpoint,
//     failureEndpoint,
//     recordingEndpoint,
//     transcriptionEndpoint,
//     voiceEndpoint
// } from "../config/twilio";
// import * as core from "express-serve-static-core";
// import {
//     phoneSurveyEvent,
//     phoneSurveyFailureEvent,
//     phoneSurveyQuestionResponseEvent,
//     phoneSurveyRecordingEvent, phoneSurveyTranscriptionEvent
// } from "../controller/controller";
//
// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export default function addRoutes(app: core.Express) {
//     /**
//      * Endpoint to update status of phone survey call
//      */
//     app.post(`/${eventEndpoint}`, [], phoneSurveyEvent);
//
//     /**
//      * Endpoint to update status of phone survey call in event of failure
//      */
//     app.post(`/${failureEndpoint}`, [], phoneSurveyFailureEvent);
//
//     /**
//      * Endpoint to handle input from phone survey questions
//      */
//     // eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/require-await
//     app.post(`/${voiceEndpoint}`, [], phoneSurveyQuestionResponseEvent);
//
//     /**
//      * Endpoint to handle recording events
//      */
//     // eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/require-await
//     app.post(`/${recordingEndpoint}`, [], phoneSurveyRecordingEvent);
//
//     /**
//      * Endpoint to handle transcription events
//      */
//     // eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/require-await
//     app.post(`/${transcriptionEndpoint}`, [], phoneSurveyTranscriptionEvent);
// };
