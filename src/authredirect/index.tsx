import React, {useEffect} from 'react';
import firebaseApp from '../firebase';
import {getAuth} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import {k_landing_page_route, k_map_page_route} from "../index";

function AuthRedirectPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    // TODO: check user role (trainee, facility, or admin) to determine which page to navigate to
                    navigate(k_map_page_route);
                } else {
                    navigate(k_landing_page_route);
                }
            });
        }
    }, [auth]);

    return (
        <div/>
    );
}

export default AuthRedirectPage;
