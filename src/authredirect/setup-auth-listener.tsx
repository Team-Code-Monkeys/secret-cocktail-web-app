import React from 'react';
import {k_landing_page_route, k_map_page_route} from "../index";
import {Auth} from "@firebase/auth";
import {NavigateFunction} from "react-router/dist/lib/hooks";

export const setupAuthListener = (auth: Auth, navigate: NavigateFunction) => {
    if (auth) {
        auth.onAuthStateChanged((user: any) => {
            console.log(user);
            if (user) {
                // TODO: check user role (trainee, facility, or admin) to determine which page to navigate to
                navigate(k_map_page_route);
            } else {
                navigate(k_landing_page_route);
            }
        });
    }
}
