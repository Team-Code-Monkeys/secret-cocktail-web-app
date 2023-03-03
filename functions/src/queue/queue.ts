import {db} from "../config/firebase-config";
import * as VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import {eventURL, failureURL, recordingURL, twilioPhoneNumber, voiceURL} from "../config/twilio-config";
import * as twilio from "twilio";

export const sendPhoneSurvey = async (docId: string, phoneNumberToContact: string, record: boolean) => {
    console.log("Sending phone survey to ", phoneNumberToContact);
    const accountSid = (process.env.TWILIO_ACCOUNT_SID || '').toString();
    const authToken = (process.env.TWILIO_AUTH_TOKEN || '').toString();
    const twilioClient = twilio(accountSid, authToken);
    try {
        // send phone survey to client
        const twiml = new VoiceResponse();
        twiml.redirect({method: 'POST'}, voiceURL);
        const call = await twilioClient.calls
            .create({
                method: 'GET',
                record: record,
                statusCallback: eventURL,
                statusCallbackEvent: ['queued', 'initiated', 'ringing', 'answered', 'completed', 'absent'],
                statusCallbackMethod: 'POST',
                fallbackUrl: failureURL,
                fallbackMethod: 'POST',
                twiml: twiml.toString(),
                to: phoneNumberToContact,
                from: twilioPhoneNumber,
                recordingStatusCallback: recordingURL,
                recordingStatusCallbackMethod: 'POST',
                recordingStatusCallbackEvent: ['in-progress', 'completed', 'absent']
            });
        if (docId) {
            try {
                await db.collection("to-contact-for-survey")
                    .doc(docId)
                    .set({contacted: true, callStatus: 'queued', callSID: call?.sid || ""}, {merge: true});
            } catch (e) {
                console.log(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Encountered error updating to contact status: ${e}`
                )
            }
        }
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`Encountered error sending phone survey: ${e}`)
    }
}
