import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_facility_role} from "../authredirect/auth-check";
import {k_facility_page_route} from "../index";

function ReportFacilityCorrectionPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const [reportSent, setReportSent] = useState<boolean>(false);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_facility_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar/>
            {
                !reportSent &&
                <div className={styles.innerContainer}>
                    <div className={styles.innerContainerHeader}>
                        <div className={styles.helpText}>Report a correction about your facility to the Admin team!</div>
                    </div>
                    <textarea className={styles.textArea} placeholder={'Leave your message'}></textarea>
                    {/*<div>*/}
                    {/*    <button onClick={() => {navigate(k_facility_page_route)}}>Cancel</button>*/}
                    {/*    <button onClick={() => {setReportSent(true)}}>Send Message</button>*/}
                    {/*</div>*/}
                    <div className={styles.btnOuterContainer}>
                        <div className={styles.btnContainer}>
                            <button className={styles.primaryBtn} onClick={() => {navigate(k_facility_page_route)}} style={{width: '150px', marginRight: '10px', background: '#D2042D', borderColor: '#D2042D'}}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={() => {setReportSent(true)}} style={{background: '#50C878', borderColor: '#50C878'}}>Send Message</button>
                        </div>
                    </div>
                </div>
            }
            {
                reportSent &&
                <div className={styles.innerContainer}>
                    <div className={styles.helpText}>Thank you for contacting the Admin team! We will be processing your request soon and will be in touch!</div>
                    <div className={styles.backBtnContainer} onClick={() => {
                        navigate(k_facility_page_route)
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
            }
        </div>
    );
}

export default ReportFacilityCorrectionPage;
