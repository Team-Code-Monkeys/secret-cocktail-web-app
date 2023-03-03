// import dotenv from "dotenv";
// import * as firebase from "firebase-admin";
//
// // load additional environment variables from .env file
// dotenv.config();
//
// // connect to firebase
// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// const firebaseCredentials: any = {
//     type: process.env.firebase_type,
//     project_id: process.env.firebase_project_id,
//     private_key_id: process.env.firebase_private_key_id,
//     private_key: process.env.firebase_private_key
//         ? process.env.firebase_private_key.replace(/\\n/gm, "\n")
//         : undefined,
//     client_email: process.env.firebase_client_email,
//     client_id: process.env.firebase_client_id,
//     auth_uri: process.env.firebase_auth_uri,
//     token_uri: process.env.firebase_token_uri,
//     auth_provider_x509_cert_url: process.env.firebase_auth_provider_x509_cert_url,
//     client_x509_cert_url: process.env.firebase_client_x509_cert_url,
// }
//
// for (const [key, value] of Object.entries(firebaseCredentials)) {
//     if (value === undefined) {
//         console.error(`${key} environment variable is undefined `)
//         process.exit(1);
//     }
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// firebase.initializeApp({
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
//     credential: firebase.credential.cert(firebaseCredentials),
// })
//
// export const db = firebase.firestore();
