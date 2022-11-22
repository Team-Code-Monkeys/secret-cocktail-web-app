import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import {setupAuthListener} from "../authredirect/setup-auth-listener";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import firebaseApp from "../firebase";
import {checkedIfAllowedOnPage, k_admin_role} from "../authredirect/auth-check";

function AdminPhoneSurveyPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar/>
            <div>
                <div>hello world</div>
            </div>
            <Waves/>
        </div>
    );
}

function Waves() {
    return (
        <img src={wave} className={styles.wave} alt={'Wave for styling webpage.'}/>
    );
}

export default AdminPhoneSurveyPage;
