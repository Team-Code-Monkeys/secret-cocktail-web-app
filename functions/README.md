# Secert Cocktail Automated Phone Survey Server

## About

Server that manages the sending of phone surveys to facilities

## Requirements

- [NodeJS Version 16.x](https://nodejs.org/en/download/)

## Environment Variables
Create `.env.dev` file with following content (derived from Firebase Admin SDK JSON):

```shell
firebase_type="..."
firebase_project_id="..."
firebase_private_key_id="..."
firebase_private_key="..."
firebase_client_email="..."
firebase_client_id="..."
firebase_auth_uri="..."
firebase_token_uri="..."
firebase_auth_provider_x509_cert_url="..."
firebase_client_x509_cert_url="..."
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="..."
TWILIO_STATUS_CALLBACK_URL="https://something.com"
```

Note: for production call this file `.env.prod`

## Get Started (server)

To run in watch mode, `yarn serve`.

## Change User Roles

Ensure the environment variables above are defined and the userID below is changed

userID can be found in the "Authentication" panel of the Firebase dashboard

- Promote a user to admin role
    - `node promote-user.js --userID="fKzXmW7HVlRXSr1As7Z8lAZgcvT2" --role="admin"`

- Promote a user to facility role
    - `node promote-user.js --userID="fKzXmW7HVlRXSr1As7Z8lAZgcvT2" --role="facility"`
