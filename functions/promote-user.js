// import libraries
const minimist = require("minimist");
const dotenv = require('dotenv');
const firebase = require("firebase-admin");

// load environment variables
dotenv.config();

// parse cli arguments to see which user to promote to which role
let userID, role;
const roles = {
    admin: 'admin',
    facility: 'facility'
};
{
    const argv = minimist(process.argv.slice(2));
    userID = argv?.userID;
    role = argv?.role;

    if (!userID) {
        console.error('No userID specified, please refer to README.md documentation');
        process.exit(1);
    }

    if (!role) {
        console.error('No role specified, please refer to README.md documentation');
        process.exit(1);
    }

    if (!Object.keys(roles).includes(role)) {
        console.error('Invalid role provided, please refer to README.md documentation');
        process.exit(1);
    }
}

// connect to Firebase
{
    const firebaseCredentials = {
        type: process.env.firebase_type,
        project_id: process.env.firebase_project_id,
        private_key_id: process.env.firebase_private_key_id,
        private_key: process.env.firebase_private_key
            ? process.env.firebase_private_key.replace(/\\n/gm, "\n")
            : undefined,
        client_email: process.env.firebase_client_email,
        client_id: process.env.firebase_client_id,
        auth_uri: process.env.firebase_auth_uri,
        token_uri: process.env.firebase_token_uri,
        auth_provider_x509_cert_url: process.env.firebase_auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.firebase_client_x509_cert_url,
    }

    for (const [key, value] of Object.entries(firebaseCredentials)) {
        if (value === undefined) {
            console.error(`${key} environment variable is undefined `)
            process.exit(1)
        }
    }

    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseCredentials),
    });
}

// update the role of the account
{
    const updateRole = (userToUpdate, customUserClaims) => {
        firebase.auth().setCustomUserClaims(userToUpdate, customUserClaims)
            .then(() => {
                console.log(`Successfully updated ${userID} to ${role}`);
                process.exit(0);
            }).catch((error) => {
                console.error(`Error updating ${userID} to ${role}`, error);
                process.exit(1);
            }
        );
    }

    console.log(`Attempting to update ${userID} to ${role}`);

    if (role === roles?.admin) {
        updateRole(userID, {admin: true});
    } else if (role === roles?.facility) {
        updateRole(userID, {facility: true});
    } else {
        console.error(`Unknown role ${role}`);
        process.exit(1);
    }
}
