import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import {setupAuthListener} from "../authredirect/setup-auth-listener";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import firebaseApp from "../firebase";
import {checkedIfAllowedOnPage, k_admin_role} from "../authredirect/auth-check";
import {k_admin_portal_page_route} from "../index";

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
            <div className={styles.innerContainer2}>
                <div className={styles.title}>Phone Survey Dashboard</div>
            </div>
            <div className={styles.innerContainer3}>

            </div>
            <div className={styles.innerContainer}>
                <div className={styles.backBtnContainer} onClick={() => {
                    navigate(k_admin_portal_page_route)
                }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27 20H13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M20 27L13 20L20 13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                    <div className={styles.backBtnText}>Back</div>
                </div>
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
