// import React from 'react';
import {k_landing_page_route, k_map_page_route} from "../index";
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
                console.log('redirecting to home page of user');
                // TODO: check user role (trainee, facility, or admin) to determine which page to navigate to
                navigate(k_map_page_route);
                // console.log(user);
            } else if (!user && redirectIfNotLoggedIn) {
                console.log('redirecting to landing page');
                navigate(k_landing_page_route);
            }
        });
    }
}
