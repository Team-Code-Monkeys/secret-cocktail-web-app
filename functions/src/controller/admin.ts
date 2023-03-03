import * as admin from "firebase-admin";

export const createAdmin = async (req: any, res: any) => {
    // check if admin account already exists
    try {
        let listUsersResult = await admin.auth().listUsers(1000, undefined);
        do {
            let adminAccountUID = undefined;
            listUsersResult.users.forEach((userRecord) => {
                if (userRecord?.customClaims?.admin) {
                    adminAccountUID = userRecord?.uid;
                }
            });
            if (adminAccountUID) {
                res.send(`Error: admin already exists. If you want to create a new admin account, delete the existing admin with UID ${adminAccountUID}. This can be done by visiting the Firebase console at https://console.firebase.google.com/u/0/project/secret-cocktail/authentication/users`);
                return;
            }
            if (listUsersResult?.pageToken) {
                listUsersResult = await admin.auth().listUsers(1000, listUsersResult?.pageToken);
            }
        } while (listUsersResult?.pageToken);
    } catch (e) {
        res.send("Error: unable to query users to see if admin account already exists");
        return;
    }

    // create the admin account
    const email: string = req?.body?.email;
    const password: string = req?.body?.password;
    if (email && password) {
        admin.auth().createUser({
            email: email,
            emailVerified: true,
            password: password,
            displayName: 'Admin',
            disabled: false,
        })
            .then((userRecord) => {
                admin.auth().setCustomUserClaims(userRecord.uid, {admin: true})
                    .then(() => {
                        // See the UserRecord reference doc for the contents of userRecord.
                        console.log('Successfully created new admin with UID: ', userRecord.uid);
                        res.send('Successfully created new admin with UID: ' + userRecord.uid);
                        return;
                    }).catch((error) => {
                    console.error(`Error updating ${userRecord.uid} to admin`, error);
                    res.send(`Error updating ${userRecord.uid} to admin ${JSON.stringify(error)}`);
                    return;
                });
            })
            .catch((error) => {
                console.error('Error creating new admin:', error);
                res.send('Error creating new admin:' + JSON.stringify(error));
                return;
            });
    } else {
        console.error("Blank email or password provided for admin account to be created");
        res.send("Blank email or password provided for admin account to be created");
        return;
    }
}
