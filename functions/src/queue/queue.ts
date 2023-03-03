// import {db} from "../config/firebase";
// import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
// import {eventURL, failureURL, recordingURL, twilioClient, twilioPhoneNumber, voiceURL} from "../config/twilio";
//
// const listenerQuery = db
//     .collection("to-contact-for-survey")
//     .where("contacted", "==", false);
//
// // queue to keep track of which phone survey to send at a time
// const phoneSurveysScheduled = new Set();
//
// // function to send a phone survey to a specific phone number
// const sendPhoneSurvey = async (docId: string, phoneNumberToContact: string, record: boolean) => {
//     console.log("Sending phone survey to ", phoneNumberToContact);
//     try {
//         // send phone survey to client
//         const twiml = new VoiceResponse();
//         twiml.redirect({method: 'POST'}, voiceURL);
//         const call = await twilioClient.calls
//             .create({
//                 method: 'GET',
//                 record: record,
//                 statusCallback: eventURL,
//                 statusCallbackEvent: ['queued', 'initiated', 'ringing', 'answered', 'completed', 'absent'],
//                 statusCallbackMethod: 'POST',
//                 fallbackUrl: failureURL,
//                 fallbackMethod: 'POST',
//                 twiml: twiml.toString(),
//                 to: phoneNumberToContact,
//                 from: twilioPhoneNumber,
//                 recordingStatusCallback: recordingURL,
//                 recordingStatusCallbackMethod: 'POST',
//                 recordingStatusCallbackEvent: ['in-progress', 'completed', 'absent']
//             });
//         if (docId) {
//             try {
//                 await db.collection("to-contact-for-survey")
//                     .doc(docId)
//                     .set({contacted: true, callStatus: 'queued', callSID: call?.sid || ""}, {merge: true});
//             } catch (e) {
//                 console.log(
//                     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//                     `Encountered error updating to contact status: ${e}`
//                 )
//             }
//         }
//     } catch (e) {
//         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//         console.log(`Encountered error sending phone survey: ${e}`)
//     }
// }
//
// // listen for changes in database and send phone surveys to necessary facilities
// export function startPhoneSurveyConsumerQueue(): void {
//     function sleep(ms: number) {
//         return new Promise((resolve) => {
//             setTimeout(resolve, ms);
//         });
//     }
//
//     listenerQuery.onSnapshot(
//         // eslint-disable-next-line @typescript-eslint/no-misused-promises
//         async (querySnapshot) => {
//             await Promise.all(querySnapshot.docs.map(async (doc: any) => {
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
//                 const phoneNumberToContact: string = doc?.data()?.phone || '';
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
//                 const record: boolean = doc?.data()?.record || false;
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//                 const docId: string = doc?.id || '';
//                 if (phoneNumberToContact && !phoneSurveysScheduled.has(docId)) {
//                     phoneSurveysScheduled.add(docId);
//                     void sendPhoneSurvey(docId, phoneNumberToContact, record).then(() => {
//                         phoneSurveysScheduled.delete(docId);
//                     });
//                 }
//                 await sleep(1500);
//             }));
//         },
//         (err) => {
//             // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//             console.log(`Encountered error getting phone numbers to contact: ${err}`)
//         }
//     )
// }
