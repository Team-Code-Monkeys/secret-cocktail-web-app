// import * as firebase from "firebase-admin";
//
// // connect to firebase
// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// const firebaseCredentials: any = {
//     type: process.env.F_FIREBASE_TYPE,
//     project_id: process.env.F_FIREBASE_PROJECT_ID,
//     private_key_id: process.env.F_FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.F_FIREBASE_PRIVATE_KEY
//         ? process.env.F_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
//         : undefined,
//     client_email: process.env.F_FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.F_FIREBASE_CLIENT_ID,
//     auth_uri: process.env.F_FIREBASE_AUTH_URI,
//     token_uri: process.env.F_FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.F_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.F_FIREBASE_CLIENT_X509_CERT_URL,
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
