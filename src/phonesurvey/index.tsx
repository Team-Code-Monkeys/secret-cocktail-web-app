import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where, writeBatch,
} from 'firebase/firestore';
import { Button, Form, Modal } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useCSVReader } from 'react-papaparse';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import { checkedIfAllowedOnPage, k_admin_role } from '../authredirect/auth-check';
import { k_admin_portal_page_route } from '../index';

function AdminPhoneSurveyPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const { CSVReader } = useCSVReader();
    const db = getFirestore();

    const [questions, setQuestions] = useState<any>([]);

    const [showModal, setShowModal] = useState(false);
    const [sendToMultipleFacilities, setSendToMultipleFacilities] = useState(true);
    const [facilitiesToSendSurveyTo, setFacilitiesToSendSurveyTo] = useState([]);
    const [facilityName, setFacilityName] = useState('');
    const [facilityPhoneNumber, setFacilityPhoneNumber] = useState('');
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        async function fetchQuestions() {
            const q = query(collection(db, 'question'), where('order', '>=', 0));
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

    const hashCode = (s: string) => s.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer2}>
                <div className={styles.title}>Phone Survey Dashboard</div>
            </div>
            <div className={styles.innerContainer3}>
                {
                    questions.map((question: any, _: number) => (
                        <div className={styles.listItemContainer} key={question.id}>
                            <div className={styles.listItemText}>{question.title || 'No title'}</div>
                            <div className={styles.listItemText2}>{question.question || 'No text'}</div>
                            <div className={styles.listItemButtonsContainer}>
                                <button
                                    style={{ border: '#e13d3d', background: '#e13d3d' }}
                                    className={styles.primaryBtnListView} onClick={() => {
                                        deleteDoc(doc(db, 'question', question.id || '')).then(() => {
                                            window.location.reload();
                                        }).catch((error: any) => {
                                            alert('Error deleting question.');
                                            console.error('Error deleting question', error);
                                        });
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.primaryBtnListView} onClick={() => {
                                        const newQuestionText = prompt('Edit Question', question.question || '');
                                        if (newQuestionText) {
                                            const questionRef = doc(db, 'question', question.id || '');
                                            setDoc(questionRef, {
                                                question: newQuestionText,
                                            }, { merge: true }).then(() => {
                                                window.location.reload();
                                            });
                                        }
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={styles.innerContainer4}>
                <button
                  style={{ width: 300 }} className={styles.primaryBtn} onClick={() => {
                        const questionRef = doc(db, 'question', Math.round(new Date().getTime()).toString());
                        const time = Math.round(new Date().getTime());
                        setDoc(questionRef, {
                            createdAt: time,
                            updatedAt: time,
                            order: questions.length,
                            question: 'Sample question text.',
                            title: `Question ${questions.length + 1}`,
                        }, { merge: true }).then(() => {
                            window.location.reload();
                        }).catch((err) => {
                            alert('Error adding question');
                        });
                    }}
                >
                    Add Question
                </button>
            </div>
            <div className={styles.innerContainer4} style={{ marginTop: '20px' }}>
                <button
                  style={{ width: 300 }} className={styles.sendBtn} onClick={() => {
                        setShowModal(true);
                    }}
                >
                    Send Survey
                </button>
            </div>
            <div className={styles.innerContainer4} style={{ marginTop: '20px' }}>
                <Button style={{ width: 300 }} className={styles.downloadBtn} variant="primary">
                    Download CSV
                </Button>
            </div>
            <div className={styles.innerContainer}>
                <div
                  className={styles.backBtnContainer} onClick={() => {
                        navigate(k_admin_portal_page_route);
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M27 20H13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 27L13 20L20 13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                    </svg>
                    <div className={styles.backBtnText}>Back</div>
                </div>
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Send Phone Survey to Facilities</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DropdownButton
                          id="dropdown-button"
                          title={sendToMultipleFacilities ? 'Send to Multiple Facilities' : 'Send to Single Facility'}
                          className={styles.coloredBtn}
                        >
                            {
                                sendToMultipleFacilities
                                    ? <Dropdown.Item onClick={() => { setSendToMultipleFacilities(false); }}>Send to Single Facility</Dropdown.Item>
                                    : <Dropdown.Item onClick={() => { setSendToMultipleFacilities(true); }}>Send to Multiple Facilities</Dropdown.Item>
                            }
                        </DropdownButton>
                        {
                            sendToMultipleFacilities
                                ? (
                                    <Form>
                                        <CSVReader
                                            onUploadAccepted={(results: any) => {
                                                // convert CSV to JSON data
                                                const data = results?.data || [];
                                                const keys = data.shift();
                                                const jsonResult = data.map((data: any[]) => Object.assign({}, ...data.map((x: any, i: any) => ({ [keys[i]]: x }))));
                                                for (let i = 0; i < jsonResult.length; i++) {
                                                    jsonResult[i].contacted = false;
                                                }
                                                setFacilitiesToSendSurveyTo(jsonResult);
                                            }}
                                        >
                                            {({
                                                getRootProps,
                                                acceptedFile,
                                                getRemoveFileProps,
                                            }: any) => (
                                                <>
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <button type="button" {...getRootProps()} className={styles.browseBtn}>
                                                            Upload CSV File
                                                        </button>
                                                        <div>
                                                            {acceptedFile && acceptedFile.name}
                                                        </div>
                                                        {
                                                            acceptedFile
                                                            && (
                                                                <button {...getRemoveFileProps()} className={styles.removeBtn}>
                                                                    X
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                    <div>
                                                        <span>Confused about the format? Refer to this </span>
                                                        <a
                                                            style={{ marginTop: '10px' }} href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4o7EvXy3qVhg4LTBA6rbxGS0oHIR4vJCW0QKnu-I9gFmWEXxZDaWLOz7Zxv1tL_A_lqQoNTo-AwCY/pub?output=csv"
                                                            target="_blank" rel="noreferrer"
                                                        >
                                                            sample file
                                                        </a>
                                                    </div>
                                                </>
                                            )}
                                        </CSVReader>
                                    </Form>
                                )
                                : (
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text" placeholder="Enter facility name" value={facilityName} onChange={(event) => {
                                                    setFacilityName(event?.target?.value || '');
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel" placeholder="Enter facility phone number" value={facilityPhoneNumber} onChange={(event) => {
                                                    setFacilityPhoneNumber(event?.target?.value || '');
                                                }}
                                            />
                                        </Form.Group>
                                    </Form>
                                )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                          className={styles.sendBtn} onClick={() => {
                                if (sendToMultipleFacilities) {
                                    const batch = writeBatch(db);
                                    facilitiesToSendSurveyTo.forEach((facilityInfo: any) => {
                                        if (facilityInfo?.phone && facilityInfo?.name) {
                                            const phoneRef = doc(db, 'to-contact-for-survey', hashCode(facilityInfo?.phone).toString() + Math.round(new Date().getTime()).toString());
                                            batch.set(phoneRef, facilityInfo);
                                        }
                                    });
                                    batch.commit().then(() => {
                                        alert(`Sending phone surveys to ${facilitiesToSendSurveyTo.length} facilities!`);
                                        setShowModal(false);
                                        setFacilitiesToSendSurveyTo([]);
                                    }).catch((err) => {
                                        alert('Error sending phone surveys');
                                        console.error('Error sending phone surveys', err);
                                    });
                                } else {
                                    setFacilitiesToSendSurveyTo([]);
                                    const phoneRef = doc(db, 'to-contact-for-survey', hashCode(facilityPhoneNumber).toString() + Math.round(new Date().getTime()).toString());
                                    setDoc(phoneRef, {
                                        contacted: false,
                                        name: facilityName,
                                        phone: facilityPhoneNumber.toString(),
                                    }, { merge: true }).then(() => {
                                        alert(`${facilityPhoneNumber} will be sent a survey!`);
                                        setFacilityPhoneNumber('');
                                        setFacilityName('');
                                        setShowModal(false);
                                    }).catch((err) => {
                                        alert('Error sending phone survey');
                                        console.error('Error sending phone survey', err);
                                    });
                                }
                            }}
                        >
                            Send
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Waves />
        </div>
    );
}

function Waves() {
    return (
        <img src={wave} className="wave" alt="Wave for styling webpage." />
    );
}

export default AdminPhoneSurveyPage;
