import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseApp from '../firebase';
import { setupAuthListener } from './setup-auth-listener';

/**
 * Page that shows blank content until auth state is finalized.
 * If the user is logged in, go to their home page. Otherwise, go to the landing page.
 * Note: for slow Wi-Fi this will show a blank page for a while, so I added a 3 second timeout.
 */
const AuthRedirectPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, true, true);
    }, [auth, navigate]);

    useEffect(() => {
        const slowWiFiLimitSeconds = 3;
        const timeoutID = setTimeout(() => {
            // eslint-disable-next-line no-alert
            alert('Slow Wi-Fi detected');
        }, slowWiFiLimitSeconds * 1000.0);
        return () => {
            clearTimeout(timeoutID);
        };
    }, []);

    return (
        <div />
    );
};

export default AuthRedirectPage;
