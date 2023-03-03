# Secert Cocktail Automated Phone Survey Server

## About

Server that manages the sending of phone surveys to facilities

## Requirements

- [NodeJS Version 16.x](https://nodejs.org/en/download/)

## Environment Variables
Create `.env` file with following content (derived from Firebase Admin SDK JSON):

```shell
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="..."
TWILIO_STATUS_CALLBACK_URL="https://something.com"
EMAIL_EMAIL="someone@gmail.com"
EMAIL_PASSWORD="..."
```

## Get Started (server)

To run in watch mode, `yarn serve`.

## Change User Roles

Ensure the environment variables above are defined and the userID below is changed

userID can be found in the "Authentication" panel of the Firebase dashboard

- Promote a user to admin role
    - `node promote-user.js --userID="fKzXmW7HVlRXSr1As7Z8lAZgcvT2" --role="admin"`

- Promote a user to facility role
    - `node promote-user.js --userID="fKzXmW7HVlRXSr1As7Z8lAZgcvT2" --role="facility"`
