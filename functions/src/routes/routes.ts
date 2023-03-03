// @ts-nocheck
import {
    eventEndpoint,
    failureEndpoint,
    recordingEndpoint,
    transcriptionEndpoint,
    voiceEndpoint
} from "../config/twilio-config";
import * as core from "express-serve-static-core";
import {
    phoneSurveyEvent,
    phoneSurveyFailureEvent,
    phoneSurveyQuestionResponseEvent,
    phoneSurveyRecordingEvent, phoneSurveyTranscriptionEvent
} from "../controller/controller";
import {createAdmin} from "../controller/admin";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function addRoutes(app: core.Express) {
    /**
     * Endpoint to update status of phone survey call
     */
    app.post(`/${eventEndpoint}`, [], phoneSurveyEvent);

    /**
     * Endpoint to update status of phone survey call in event of failure
     */
    app.post(`/${failureEndpoint}`, [], phoneSurveyFailureEvent);

    /**
     * Endpoint to handle input from phone survey questions
     */
    app.post(`/${voiceEndpoint}`, [], phoneSurveyQuestionResponseEvent);

    /**
     * Endpoint to handle recording events
     */
    app.post(`/${recordingEndpoint}`, [], phoneSurveyRecordingEvent);

    /**
     * Endpoint to handle transcription events
     */
    app.post(`/${transcriptionEndpoint}`, [], phoneSurveyTranscriptionEvent);

    /**
     * Endpoint to create admin account if it does not already exist
     */
    app.post(`/create-admin`, [], createAdmin);
};
