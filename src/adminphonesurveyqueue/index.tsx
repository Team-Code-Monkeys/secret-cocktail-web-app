import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    collection, deleteDoc, doc, getDocs, getFirestore, query,
} from 'firebase/firestore';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import wave from '../wave.png';
import { checkedIfAllowedOnPage, k_admin_role } from '../authredirect/auth-check';
import { k_admin_facility_page_route, k_admin_phone_survey_page_route } from '../index';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);
const AdminPhoneSurveyQueuePage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore(firebaseApp);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [phoneSurveyResponses, setPhoneSurveyResponses] = useState<any>([]);
    const [questions, setQuestions] = useState<any>(undefined);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    // @ts-ignore
    useEffect(() => {
        async function fetchPhoneSurveyResponsesAndQuestions() {
            // fetch questions
            const questionsObj: any = {};
            const questionsQuery = await getDocs(query(collection(db, 'question')));
            // eslint-disable-next-line @typescript-eslint/no-shadow
            questionsQuery.forEach((doc) => {
                const question = doc.data();
                question.id = doc.id;
                questionsObj[question.id] = question;
            });
            // @ts-ignore
            setQuestions(questionsObj);

            // fetch phone survey responses
            const phoneSurveyResponsesArr: any = [];
            const phoneSurveyResponsesQuery = await getDocs(query(collection(db, 'phone-survey-responses')));
            // eslint-disable-next-line @typescript-eslint/no-shadow
            phoneSurveyResponsesQuery.forEach((doc) => {
                const phoneSurveyResponse = doc.data();
                phoneSurveyResponse.id = doc.id;
                phoneSurveyResponsesArr.push(phoneSurveyResponse);
            });
            // @ts-ignore
            setPhoneSurveyResponses(phoneSurveyResponsesArr);
        }
        fetchPhoneSurveyResponsesAndQuestions();
    }, [db]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                <div className={styles.title}>Phone Survey Responses</div>
            </div>
            {
                questions && (
                    <div className={styles.innerContainer3}>
                        {phoneSurveyResponses.map((phoneSurveyResponse: any) => (
                            <div className={styles.listItemContainer} key={phoneSurveyResponse.id}>
                                <div className={styles.listItemText2}>
                                    Twilio Call SID:
                                    {' '}
                                    {phoneSurveyResponse?.callSid || 'None'}
                                </div>
                                <div className={styles.listItemText2}>
                                    Phone:
                                    {' '}
                                    {phoneSurveyResponse?.toPhoneNumber || 'None'}
                                </div>
                                {
                                    phoneSurveyResponse?.recordingUrl && (
                                        <div>
                                            <div className={styles.listItemText2}>
                                                Recording:
                                            </div>
                                            {/* eslint-disable-next-line max-len */}
                                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                            <audio controls>
                                                <source src={phoneSurveyResponse?.recordingUrl} type="audio/mpeg" />
                                            </audio>
                                        </div>
                                    )
                                }
                                {
                                    Object.keys(questions).map((questionID: any) => {
                                        let questionText = `${questions[questionID]?.question || ''}`;
                                        let response: any = 'Failed to capture response';
                                        let recordingURL: any;
                                        // eslint-disable-next-line max-len
                                        if (phoneSurveyResponse?.questions) {
                                            // eslint-disable-next-line no-unsafe-optional-chaining
                                            // eslint-disable-next-line max-len
                                            const digitResponses: any = phoneSurveyResponse?.questions;
                                            digitResponses.forEach((questionResponse: any) => {
                                                // eslint-disable-next-line max-len
                                                if (questionID === questionResponse?.questionDBOID) {
                                                    response = questionResponse?.digit || 'Failed to capture key press';
                                                    // eslint-disable-next-line max-len
                                                    recordingURL = recordingURL || questionResponse?.recordingUrl;
                                                }
                                            });
                                        }

                                        if (phoneSurveyResponse?.questionTranscriptions) {
                                            questionText = `${questions[questionID]?.question || ''}`;
                                            // eslint-disable-next-line max-len
                                            const transcriptionResponses: any = phoneSurveyResponse?.questionTranscriptions;
                                            // eslint-disable-next-line max-len
                                            transcriptionResponses.forEach((questionResponse: any) => {
                                                // eslint-disable-next-line max-len
                                                if (questionID === questionResponse?.questionDBOID) {
                                                    response = questionResponse?.transcriptionText || 'Failed to transcribe audio';
                                                    // eslint-disable-next-line max-len
                                                    recordingURL = recordingURL || questionResponse?.recordingUrl;
                                                }
                                            });
                                        }
                                        if (questionText) {
                                            return (
                                                <div style={{ marginTop: '10px' }} key={questionID}>
                                                    {/* eslint-disable-next-line max-len */}
                                                    <div className={styles.listItemText2}>{questionText}</div>
                                                    <div>
                                                        {`${response}`}
                                                    </div>
                                                    {
                                                        recordingURL
                                                        // eslint-disable-next-line max-len
                                                        // eslint-disable-next-line max-len,jsx-a11y/media-has-caption
                                                        && (
                                                            // eslint-disable-next-line max-len
                                                            // eslint-disable-next-line jsx-a11y/media-has-caption
                                                            <audio controls>
                                                                <source src={recordingURL} type="audio/mpeg" />
                                                            </audio>
                                                        )
                                                    }
                                                </div>
                                            );
                                        }
                                        return <div />;
                                    })
                                }
                                <div className={styles.listItemButtonsContainer}>
                                    <button
                                        style={{ border: '#e13d3d', background: '#e13d3d' }}
                                        className={styles.deleteBtnListView}
                                        onClick={() => {
                                            deleteDoc(doc(db, 'phone-survey-responses', phoneSurveyResponse.id || ''))
                                                .then(() => {
                                                    window.location.reload();
                                                })
                                                .catch((error: any) => {
                                                    // eslint-disable-next-line no-alert
                                                    alert('Error deleting phone survey response.');
                                                    // eslint-disable-next-line no-console
                                                    console.error('Error deleting phone survey response', error);
                                                });
                                        }}
                                    >
                                        Delete
                                    </button>
                                    {/* eslint-disable-next-line max-len */}
                                    { (phoneSurveyResponse?.added === undefined || phoneSurveyResponse?.added === false)
                                        && (
                                            <a
                                                className={styles.primaryBtnListView}
                                                target="_blank"
                                                href={`${k_admin_facility_page_route}?phoneSurveyResponseID=${phoneSurveyResponse.id}`}
                                                rel="noreferrer"
                                            >
                                                Create Facility
                                            </a>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
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
