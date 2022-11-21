import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './mapstyles.module.css';
import {getAuth} from "firebase/auth";
import firebaseApp from "../firebase";
import {useNavigate} from "react-router-dom";
import {setupAuthListener} from "../authredirect/setup-auth-listener";

function MapPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.mapPageContainer}>
            <Navbar/>
            <div>hello world</div>
        </div>
    );
}

export default MapPage;
