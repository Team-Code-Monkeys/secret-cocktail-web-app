/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where, writeBatch,
} from 'firebase/firestore';
import {
    Button, Form, Modal, ToggleButton, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { useCSVReader } from 'react-papaparse';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import { checkedIfAllowedOnPage, k_admin_role } from '../authredirect/auth-check';
import { k_admin_portal_page_route } from '../index';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

const AdminPhoneSurveyPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const { CSVReader } = useCSVReader();
    const db = getFirestore();

    const [questions, setQuestions] = useState<any>([]);

    const [showModal, setShowModal] = useState(false);
    const [showQuestionEditModal, setShowQuestionEditModal] = useState(false);
    const [sendToMultipleFacilities, setSendToMultipleFacilities] = useState(true);
    const [facilitiesToSendSurveyTo, setFacilitiesToSendSurveyTo] = useState([]);
    const [facilityName, setFacilityName] = useState('');
    const [facilityPhoneNumber, setFacilityPhoneNumber] = useState('');

    // question modal variables
    const [questionToEditID, setQuestionToEditID] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [title, setTitle] = useState('');
    const [transcribe, setTranscribe] = useState(false);
    const [type, setType] = useState('keypad');
    const [voiceRecordingTimeout, setVoiceRecordingTimeout] = useState(5);

    const handleCloseModal = () => {
        setShowModal(false);
        setShowQuestionEditModal(false);
    };

    const [isRecordingEnabled, setIsRecordingEnabled] = useState(0);

    async function fetchQuestions() {
        const q = query(collection(db, 'question'), where('order', '>=', 0));
        const querySnapshot = await getDocs(q);
        const questionsList: any = [];
        // eslint-disable-next-line @typescript-eslint/no-shadow
        querySnapshot.forEach((doc) => {
            const question = doc.data();
            question.id = doc.id;
            questionsList.push(question);
        });
        questionsList.sort((a: any, b: any) => a.order - b.order);
        setQuestions(questionsList);

        // fix any possible issues with question ordering (no gaps, in order, etc.)
        let shouldQueryAgain = false;
        // eslint-disable-next-line array-callback-return
        questionsList.map(async (question: any, index: number) => {
            if (parseInt((question.order).toString(), 10) !== index) {
                const questionRef = doc(db, 'question', question.id || '');
                await setDoc(questionRef, {
                    order: index,
                }, { merge: true });
                shouldQueryAgain = true;
            }
        });
        if (shouldQueryAgain) {
            window.location.reload();
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, [db]);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    const hashCode = (s: string) => s.split('').reduce((a, b) => {
        // eslint-disable-next-line no-param-reassign,no-bitwise
        a = ((a << 5) - a) + b.charCodeAt(0);
        // eslint-disable-next-line no-bitwise
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
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    questions.map((question: any, index: number) => (
                        <div className={styles.listItemContainer} key={question.id}>
                            <div className={styles.listItemText}>{question.title || 'No title'}</div>
                            <div className={styles.listItemText2}>{question.question || 'No text'}</div>
                            <div className={styles.listItemButtonsContainer}>
                                <button
                                    className={styles.deleteBtnListView}
                                    onClick={() => {
                                        deleteDoc(doc(db, 'question', question.id || '')).then(() => {
                                            fetchQuestions();
                                        }).catch((error: any) => {
                                            // eslint-disable-next-line no-alert
                                            alert('Error deleting question.');
                                            // eslint-disable-next-line no-console
                                            console.error('Error deleting question', error);
                                        });
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.primaryBtnListView}
                                    onClick={() => {
                                        setShowQuestionEditModal(true);
                                        setQuestionToEditID((question?.id || '').toString());
                                        setQuestionText(question?.question);
                                        setTitle(question?.title);
                                        setTranscribe(question?.transcribe);
                                        setType(question?.type);
                                        setVoiceRecordingTimeout(question?.voiceRecordingTimeout);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    disabled={index <= 0}
                                    className={styles.primaryBtnListView}
                                    onClick={async () => {
                                        if (index > 0) {
                                            const previousQuestion: any = questions[index - 1];
                                            const previousQuestionRef = doc(db, 'question', previousQuestion.id || '');
                                            await setDoc(previousQuestionRef, {
                                                order: index,
                                            }, { merge: true });
                                            const currentQuestionRef = doc(db, 'question', question.id || '');
                                            await setDoc(currentQuestionRef, {
                                                order: index - 1,
                                            }, { merge: true });
                                            await fetchQuestions();
                                        }
                                    }}
                                >
                                    Up
                                </button>
                                <button
                                    className={styles.primaryBtnListView}
                                    onClick={async () => {
                                        if (index + 1 < questions.length) {
                                            const nextQuestion: any = questions[index + 1];
                                            const nextQuestionRef = doc(db, 'question', nextQuestion.id || '');
                                            await setDoc(nextQuestionRef, {
                                                order: index,
                                            }, { merge: true });
                                            const currentQuestionRef = doc(db, 'question', question.id || '');
                                            await setDoc(currentQuestionRef, {
                                                order: index + 1,
                                            }, { merge: true });
                                            await fetchQuestions();
                                        }
                                    }}
                                >
                                    Down
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={styles.innerContainer4}>
                <button
                    style={{ width: 300 }}
                    className={styles.primaryBtn}
                    onClick={() => {
                        const defaultQuestion = 'Sample question text.';
                        const defaultTitle = `Question ${questions.length + 1}`;
                        const defaultTranscribe = false;
                        const defaultType = 'keypad';
                        const defaultVoiceRecordingTimeout = 5;
                        const questionRef = doc(db, 'question', Math.round(new Date().getTime()).toString());
                        const time = Math.round(new Date().getTime());
                        setDoc(questionRef, {
                            createdAt: time,
                            updatedAt: time,
                            order: questions.length,
                            question: defaultQuestion,
                            title: defaultTitle,
                            transcribe: defaultTranscribe,
                            type: defaultType,
                            voiceRecordingTimeout: defaultVoiceRecordingTimeout,
                        }, { merge: true }).then(() => {
                            fetchQuestions();
                        }).catch((err) => {
                            // eslint-disable-next-line no-alert
                            alert('Error adding question');
                            // eslint-disable-next-line no-console
                            console.error('Error adding question', err);
                        });
                    }}
                >
                    Add Question
                </button>
            </div>
            <div className={styles.innerContainer4} style={{ marginTop: '20px' }}>
                <button
                    style={{ width: 300 }}
                    className={styles.sendBtn}
                    onClick={() => {
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
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                <div
                    className={styles.backBtnContainer}
                    onClick={() => {
                        navigate(k_admin_portal_page_route);
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
                {/* Edit Question Modal */}
                <Modal
                    show={showQuestionEditModal}
                    onHide={handleCloseModal}
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                <Form.Label>Question Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Question Title"
                                    value={title}
                                    onChange={(event) => {
                                        setTitle(event?.target?.value || '');
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                <Form.Label>Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Question to Ask User"
                                    value={questionText}
                                    onChange={(event) => {
                                        setQuestionText(event?.target?.value || '');
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                <Form.Label>Transcribe Text to Speech</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label={transcribe ? 'Enabled' : 'Disabled'}
                                    value={transcribe ? 'on' : 'off'}
                                    checked={transcribe}
                                    onChange={(event) => {
                                        // eslint-disable-next-line max-len
                                        setTranscribe(event?.target?.checked);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                <Form.Label>Survey Question Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Survey Question Type"
                                    value={type}
                                    onChange={(event) => {
                                        setType(event?.target?.value || 'keypad');
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                <Form.Label>Voice Recording Timeout</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Voice Recording Timeout"
                                    value={voiceRecordingTimeout}
                                    onChange={(event) => {
                                        setVoiceRecordingTimeout(parseInt(event?.target?.value || '5', 10));
                                    }}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className={styles.sendBtn}
                            onClick={() => {
                                const questionRef = doc(db, 'question', questionToEditID);
                                const time = Math.round(new Date().getTime());
                                setDoc(questionRef, {
                                    updatedAt: time,
                                    order: questions.length - 1,
                                    question: questionText,
                                    title,
                                    transcribe,
                                    type,
                                    voiceRecordingTimeout,
                                }, { merge: true }).then(() => {
                                    fetchQuestions().then(() => {
                                        handleCloseModal();
                                    });
                                }).catch((err) => {
                                    // eslint-disable-next-line no-alert
                                    alert('Error adding question');
                                    // eslint-disable-next-line no-console
                                    console.error('Error adding question', err);
                                });
                            }}
                        >
                            Save
                        </button>
                    </Modal.Footer>
                </Modal>
                {/* Send Survey Modal */}
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
                                    ? (
                                        <Dropdown.Item onClick={() => {
                                            setSendToMultipleFacilities(false);
                                        }}
                                        >
                                            Send to Single Facility
                                        </Dropdown.Item>
                                    )
                                    : (
                                        <Dropdown.Item onClick={() => {
                                            setSendToMultipleFacilities(true);
                                        }}
                                        >
                                            Send to Multiple Facilities
                                        </Dropdown.Item>
                                    )
                            }
                        </DropdownButton>
                        <ToggleButton
                            id="toggle-check"
                            className="mb-3"
                            value={0}
                            type="checkbox"
                            variant="outline-primary"
                            checked={isRecordingEnabled === 1}
                            onChange={() => {
                                // eslint-disable-next-line max-len
                                setIsRecordingEnabled(isRecordingEnabled === 1 ? 0 : 1);
                            }}
                        >
                            Recording
                            {' '}
                            {isRecordingEnabled === 1 ? 'Enabled' : 'Disabled'}
                        </ToggleButton>
                        {
                            sendToMultipleFacilities
                                ? (
                                    <Form>
                                        <CSVReader
                                            onUploadAccepted={(results: any) => {
                                                // convert CSV to JSON data
                                                const data = results?.data || [];
                                                const keys = data.shift();
                                                // eslint-disable-next-line max-len
                                                // eslint-disable-next-line @typescript-eslint/no-shadow,max-len
                                                const jsonResult = data.map((data: any[]) => Object.assign({}, ...data.map((x: any, i: any) => ({ [keys[i]]: x }))));
                                                for (let i = 0; i < jsonResult.length; i += 1) {
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
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    >
                                                        <button
                                                            type="button"
                                                            {...getRootProps()}
                                                            className={styles.browseBtn}
                                                        >
                                                            Upload CSV File
                                                        </button>
                                                        <div>
                                                            {acceptedFile && acceptedFile.name}
                                                        </div>
                                                        {
                                                            acceptedFile
                                                            && (
                                                                // eslint-disable-next-line max-len
                                                                // eslint-disable-next-line max-len,react/jsx-props-no-spreading
                                                                <button {...getRemoveFileProps()} className={styles.removeBtn}>
                                                                    X
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                    <div>
                                                        {/* eslint-disable-next-line max-len */}
                                                        <span>Confused about the format? Refer to this </span>
                                                        <a
                                                            style={{ marginTop: '10px' }}
                                                            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4o7EvXy3qVhg4LTBA6rbxGS0oHIR4vJCW0QKnu-I9gFmWEXxZDaWLOz7Zxv1tL_A_lqQoNTo-AwCY/pub?output=csv"
                                                            target="_blank"
                                                            rel="noreferrer"
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
                                                type="text"
                                                placeholder="Enter facility name"
                                                value={facilityName}
                                                onChange={(event) => {
                                                    setFacilityName(event?.target?.value || '');
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="Enter facility phone number"
                                                value={facilityPhoneNumber}
                                                onChange={(event) => {
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
                            className={styles.sendBtn}
                            onClick={() => {
                                if (sendToMultipleFacilities) {
                                    const batch = writeBatch(db);
                                    facilitiesToSendSurveyTo.forEach((facilityInfo: any) => {
                                        if (facilityInfo?.phone && facilityInfo?.name) {
                                            const phoneRef = doc(db, 'to-contact-for-survey', hashCode(facilityInfo?.phone).toString() + Math.round(new Date().getTime()).toString());
                                            // eslint-disable-next-line no-param-reassign
                                            facilityInfo.record = isRecordingEnabled === 1;
                                            batch.set(phoneRef, facilityInfo);
                                        }
                                    });
                                    batch.commit().then(() => {
                                        // eslint-disable-next-line no-alert
                                        alert(`Sending phone surveys to ${facilitiesToSendSurveyTo.length} facilities!`);
                                        setShowModal(false);
                                        setFacilitiesToSendSurveyTo([]);
                                    }).catch((err) => {
                                        // eslint-disable-next-line no-alert
                                        alert('Error sending phone surveys');
                                        // eslint-disable-next-line no-console
                                        console.error('Error sending phone surveys', err);
                                    });
                                } else {
                                    setFacilitiesToSendSurveyTo([]);
                                    const phoneRef = doc(db, 'to-contact-for-survey', hashCode(facilityPhoneNumber).toString() + Math.round(new Date().getTime()).toString());
                                    setDoc(phoneRef, {
                                        contacted: false,
                                        name: facilityName,
                                        phone: facilityPhoneNumber.toString(),
                                        record: isRecordingEnabled === 1,
                                    }, { merge: true }).then(() => {
                                        // eslint-disable-next-line no-alert
                                        alert(`${facilityPhoneNumber} will be sent a survey!`);
                                        setFacilityPhoneNumber('');
                                        setFacilityName('');
                                        setShowModal(false);
                                    }).catch((err) => {
                                        // eslint-disable-next-line no-alert
                                        alert('Error sending phone survey');
                                        // eslint-disable-next-line no-console
                                        console.error('Error sending phone survey', err);
                                    });
                                }
                            }}
                        >
                            Send
                        </button>
                    </Modal.Footer>
                </Modal>
                <Waves />
            </div>
        </div>
    );
};

export default AdminPhoneSurveyPage;
