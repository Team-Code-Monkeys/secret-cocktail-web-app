import React from 'react';
import {k_landing_page_route, k_map_page_route} from "../index";
import {Auth} from "@firebase/auth";
import {NavigateFunction} from "react-router/dist/lib/hooks";

/**
 * Automatically redirect the user to their respective homepage if they are already logged in, otherwise go to landing page
 * @param auth Firebase auth state of user
 * @param navigate React Router function to navigate the user to a different page
 */
export const setupAuthListener = (auth: Auth, navigate: NavigateFunction) => {
    if (auth) {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                // TODO: check user role (trainee, facility, or admin) to determine which page to navigate to
                navigate(k_map_page_route);
            } else {
                navigate(k_landing_page_route);
            }
        });
    }
}
