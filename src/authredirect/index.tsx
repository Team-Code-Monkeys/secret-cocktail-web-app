import React, {useEffect} from 'react';
import firebaseApp from '../firebase';
import {getAuth} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import {setupAuthListener} from "./setup-auth-listener";

/**
 * Page that shows blank content until auth state is finalized.
 * If the user is logged in, go to their home page. Otherwise, go to the landing page.
 * Note: for slow Wi-Fi this will show a blank page for a while, so I added a 3 second timeout.
 */
function AuthRedirectPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, true, true);
    }, [auth, navigate]);

    useEffect(() => {
        const slowWiFiLimitSeconds = 3;
        const timeoutID = setTimeout(() => {
            alert('Slow Wi-Fi detected')
        }, slowWiFiLimitSeconds * 1000.0);
        return () => {
            clearTimeout(timeoutID);
        };
    }, [])

    return (
        <div/>
    );
}

export default AuthRedirectPage;
