import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";
// @ts-ignore
import {db} from "../config/firebase-config";

export const createAccountAndSendEmail = (email: string, name: string, id: string) => {
    if (email) {
        const password: string = id + Date.now().toString(10);
        admin.auth().createUser({
            email: email,
            emailVerified: false,
            // phoneNumber: '+11234567890',
            password: password,
            displayName: name || 'No Name',
            disabled: false,
        })
        .then((userRecord) => {
            admin.auth().setCustomUserClaims(userRecord.uid, {facility: true})
                .then(() => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    console.log('Successfully created new facility:', userRecord.uid);
                    sendEmail(email, name, password);
                }).catch((error) => {
                    console.error(`Error updating ${userRecord.uid} to facility`, error);
                });
        })
        .catch((error) => {
            console.error('Error creating new facility:', error);
        });
    } else {
        console.error("Blank email provided for facility account to be created");
    }
}

export const sendEmail = (email: string, name: string, password: string) => {
    if (email) {
        const ourEmail = process.env.EMAIL_EMAIL;
        const ourPassword = process.env.EMAIL_PASSWORD;
        console.log(ourEmail, ourPassword);
        if (!ourEmail || !ourPassword) {
            console.error('Email credentials not provided');
            return;
        }
        const emailSubject = `Secret Cocktail Facility Account`;
        const emailBody = `\nHello ${name}!\n\nYou can view information about your facility by logging into https://secret-cocktail.web.app/sign-in-facility\n\nYour email is ${email}\nYour password is ${password}\n\nPlease change your password, so your account is secure.\n\nThank you!`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ourEmail,
                pass: ourPassword
            }
        });

        const mailOptions = {
            from: ourEmail,
            to: email,
            subject: emailSubject,
            text: emailBody
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('Error sending email', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
