// import React from 'react';
import {k_admin_portal_page_route, k_facility_page_route, k_landing_page_route, k_map_page_route} from "../index";
import {Auth} from "@firebase/auth";
import {NavigateFunction} from "react-router/dist/lib/hooks";

/**
 * Automatically redirect the user to their respective homepage if they are already logged in, otherwise go to landing page
 * @param auth Firebase auth state of user
 * @param navigate React Router function to navigate the user to a different page
 * @param redirectIfNotLoggedIn redirect to landing page if not logged in
 * @param redirectIfLoggedIn redirect to user's home page if logged in
 */
export const setupAuthListener = (auth: Auth, navigate: NavigateFunction, redirectIfNotLoggedIn: boolean, redirectIfLoggedIn: boolean) => {
    if (auth) {
        auth.onAuthStateChanged((user: any) => {
            if (user && redirectIfLoggedIn) {
                user.getIdTokenResult()
                    .then((idTokenResult: any) => {
                        const isAdmin = idTokenResult?.claims?.admin === true;
                        const isFacility = idTokenResult?.claims?.facility === true;
                        if (isAdmin) {
                            navigate(k_admin_portal_page_route);
                            return;
                        } else if (isFacility) {
                            navigate(k_facility_page_route);
                            return;
                        } else {
                            navigate(k_map_page_route);
                            return;
                        }
                    })
                    .catch((error: any) => {
                        console.log('Error verifying user information', error);
                        alert('Error verifying user information');
                        navigate(k_landing_page_route);
                        return;
                    });
            } else if (!user && redirectIfNotLoggedIn) {
                navigate(k_landing_page_route);
                return;
            }
        });
    }
}
