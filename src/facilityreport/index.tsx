import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import { checkedIfAllowedOnPage, k_facility_role } from '../authredirect/auth-check';

import { k_facility_page_route } from '../index';

const ReportFacilityCorrectionPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const location = useLocation();
    const db = getFirestore();
    const [reportSent, setReportSent] = useState<boolean>(false);
    const [report, setReport] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<any>();

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_facility_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            const userCpy = JSON.parse(JSON.stringify(user));
            if (userCpy) {
                userCpy.accessToken = undefined;
                delete userCpy.accessToken;
                userCpy.stsTokenManager = undefined;
                delete userCpy.stsTokenManager;
                userCpy.providerData = undefined;
                delete userCpy.providerData;
                userCpy.apiKey = undefined;
                delete userCpy.apiKey;
                setCurrentUser(userCpy);
            }
        });
    }, [auth]);

    return (
        <div className={styles.container}>
            <Navbar />
            {
                !reportSent
                && (
                    <div className={styles.innerContainer}>
                        <div className={styles.innerContainerHeader}>
                            {/* eslint-disable-next-line max-len */}
                            <div className={styles.helpText}>Report a correction about your facility to the Admin team!</div>
                        </div>
                        <textarea value={report} onChange={(event) => { setReport(event.target.value); }} className={styles.textArea} placeholder="Leave your message" />
                        <div className={styles.btnOuterContainer}>
                            <div className={styles.btnContainer}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => { navigate(k_facility_page_route); }}
                                    style={{
                                        width: '150px', marginRight: '10px', background: '#D2042D', borderColor: '#D2042D',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => {
                                        const facilityId = location?.state?.facilityId;
                                        const currentTimestamp = Math.round(new Date().getTime());

                                        if (!report || report.length <= 0) {
                                            // eslint-disable-next-line no-alert
                                            alert('Report cannot be empty');
                                            return;
                                        }

                                        if (facilityId) {
                                            const cityRef = doc(db, 'support-ticket', (`${currentTimestamp.toString()}.${facilityId.toString()}`));
                                            setDoc(cityRef, {
                                                report,
                                                facilityId,
                                                timeReported: currentTimestamp,
                                                user: currentUser,
                                            }, { merge: true }).then(() => {
                                                setReportSent(true);
                                            });
                                        } else {
                                            // eslint-disable-next-line no-alert
                                            alert('Error sending report. Please try again.');
                                            navigate(k_facility_page_route);
                                        }
                                    }}
                                    style={{ background: '#50C878', borderColor: '#50C878' }}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                reportSent
                && (
                    <div className={styles.innerContainer}>
                        {/* eslint-disable-next-line max-len */}
                        <div className={styles.helpText}>Thank you for contacting the Admin team! We will be processing your request soon and will be in touch!</div>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <div
                            className={styles.backBtnContainer}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M27 20H13"
                                    stroke="#5C5C5C"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M20 27L13 20L20 13"
                                    stroke="#5C5C5C"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className={styles.backBtnText}>Back</div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ReportFacilityCorrectionPage;
