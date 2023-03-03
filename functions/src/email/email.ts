import * as nodemailer from "nodemailer";

export const sendEmail = (email: string, name: string, id: string) => {
    if (email) {
        const ourEmail = process.env.EMAIL_EMAIL;
        const ourPassword = process.env.EMAIL_PASSWORD;
        console.log(ourEmail, ourPassword);
        if (!ourEmail || !ourPassword) {
            console.error('Email credentials not provided');
            return;
        }
        const password: string = id + Date.now().toString(10);
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
