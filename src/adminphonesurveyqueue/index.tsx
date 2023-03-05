import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    collection, doc, getDocs, getFirestore, query, setDoc,
} from 'firebase/firestore';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import wave from '../wave.png';
import { checkedIfAllowedOnPage, k_admin_role } from '../authredirect/auth-check';
import { k_admin_phone_survey_page_route } from '../index';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);
const AdminPhoneSurveyQueuePage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore(firebaseApp);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [phoneSurveyQueue, setPhoneSurveyQueue] = useState<any>([]);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    // @ts-ignore
    useEffect(() => {
        async function fetchPhoneSurveyQueue() {
            // fetch phone survey queue
            const phoneSurveyQueueArr: any = [];
            const phoneSurveyQueueQuery = await getDocs(query(collection(db, 'to-contact-for-survey')));
            // eslint-disable-next-line @typescript-eslint/no-shadow
            phoneSurveyQueueQuery.forEach((doc) => {
                const phoneSurveyQueueObj = doc.data();
                phoneSurveyQueueObj.id = doc.id;
                phoneSurveyQueueArr.push(phoneSurveyQueueObj);
            });
            // @ts-ignore
            setPhoneSurveyQueue(phoneSurveyQueueArr);
        }
        fetchPhoneSurveyQueue();
    }, [db]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                <div className="title">Phone Survey Queue</div>
            </div>
            <div className={styles.innerContainer3}>
                {phoneSurveyQueue.map((phoneSurveyQueueObj: any) => (
                    <div className={styles.listItemContainer} key={phoneSurveyQueueObj.id}>
                        <div className={styles.listItemText2}>
                            Name:
                            {' '}
                            {phoneSurveyQueueObj?.name || 'None'}
                        </div>
                        <div className={styles.listItemText2}>
                            Phone:
                            {' '}
                            {phoneSurveyQueueObj?.phone || 'None'}
                        </div>
                        <div className={styles.listItemText2}>
                            Recording:
                            {' '}
                            {phoneSurveyQueueObj?.record ? 'Enabled' : 'Disabled'}
                        </div>
                        {
                            phoneSurveyQueueObj?.callStatus && (
                                <div className={styles.listItemText2}>
                                    Call Status:
                                    {' '}
                                    {phoneSurveyQueueObj?.callStatus}
                                </div>
                            )
                        }
                        <div className={styles.listItemButtonsContainer}>
                            {
                                // eslint-disable-next-line max-len
                                (phoneSurveyQueueObj?.contacted === undefined && phoneSurveyQueueObj.id) && (
                                    <button
                                        className={styles.primaryBtnListView}
                                        onClick={() => {
                                            setDoc(doc(db, 'to-contact-for-survey', phoneSurveyQueueObj.id), {
                                                contacted: false,
                                            }, { merge: true })
                                                .then(() => {
                                                    window.location.reload();
                                                }).catch((err) => {
                                                    // eslint-disable-next-line no-console
                                                    console.error('Error updating database to send survey', err);
                                                    // eslint-disable-next-line no-alert
                                                    alert('Error sending survey');
                                                });
                                        }}
                                    >
                                        Send
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.innerContainer}>
                {/* TODO: make this a button */}
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className={styles.backBtnContainer}
                    onClick={() => {
                        navigate(k_admin_phone_survey_page_route);
                    }}
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
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
            <Waves />
        </div>
    );
};

export default AdminPhoneSurveyQueuePage;
