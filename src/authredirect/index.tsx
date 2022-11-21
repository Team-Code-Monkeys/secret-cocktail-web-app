import React, {useEffect} from 'react';
import firebaseApp from '../firebase';
import {getAuth} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import {setupAuthListener} from "./setup-auth-listener";

function AuthRedirectPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate);
    }, [auth, navigate]);

    return (
        <div/>
    );
}

export default AuthRedirectPage;
