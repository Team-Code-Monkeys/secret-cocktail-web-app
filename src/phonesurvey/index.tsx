import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import {setupAuthListener} from "../authredirect/setup-auth-listener";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import firebaseApp from "../firebase";
import {checkedIfAllowedOnPage, k_admin_role} from "../authredirect/auth-check";
import {k_admin_portal_page_route} from "../index";
import {collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where} from "firebase/firestore";

function AdminPhoneSurveyPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore();

    const [questions, setQuestions] = useState<any>([]);

    useEffect(() => {
        async function fetchQuestions() {
            const q = query(collection(db, "question"), where("order", ">=", 0));
            const querySnapshot = await getDocs(q);
            const questionsList: any = [];
            querySnapshot.forEach((doc) => {
                const question = doc.data();
                question.id = doc.id;
                questionsList.push(question);
            });
            setQuestions(questionsList);
        }

        fetchQuestions();
    }, [db]);

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
                {
                    questions.map((question: any, _: number) => {
                        return (
                            <div className={styles.listItemContainer} key={question.id}>
                                <div className={styles.listItemText}>{question.title || 'No title'}</div>
                                <div className={styles.listItemText2}>{question.question || 'No text'}</div>
                                <div className={styles.listItemButtonsContainer}>
                                    <button style={{border: '#e13d3d', background: '#e13d3d'}}
                                            className={styles.primaryBtnListView} onClick={() => {
                                        deleteDoc(doc(db, 'question', question.id || "")).then(() => {
                                            window.location.reload();
                                        }).catch((error: any) => {
                                            alert("Error deleting question.");
                                            console.error("Error deleting question", error);
                                        });
                                    }}>Delete
                                    </button>
                                    <button className={styles.primaryBtnListView} onClick={() => {
                                        const newQuestionText = prompt("Edit Question", question.question || "");
                                        if (newQuestionText) {
                                            const questionRef = doc(db, 'question', question.id || '');
                                            setDoc(questionRef, {
                                                question: newQuestionText,
                                            }, {merge: true}).then(() => {
                                                window.location.reload();
                                            });
                                        }
                                    }}>Edit
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.innerContainer4}>
                <button style={{width: 300}} className={styles.primaryBtnListView} onClick={() => {
                    const questionRef = doc(db, 'question', Math.round(new Date().getTime()).toString());
                    const time = Math.round(new Date().getTime());
                    setDoc(questionRef, {
                        createdAt: time,
                        updatedAt: time,
                        order: questions.length,
                        question: 'Sample question text.',
                        title: `Question ${questions.length + 1}`
                    }, {merge: true}).then(() => {
                        window.location.reload();
                    });
                }}>Add
                </button>
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
