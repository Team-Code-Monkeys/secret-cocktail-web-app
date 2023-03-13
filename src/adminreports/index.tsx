import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    collection,
    getDocs,
    query,
    getFirestore,
    deleteDoc,
    doc, setDoc,
    GeoPoint, getDoc,
} from 'firebase/firestore';
import {
    Form,
    Modal,
} from 'react-bootstrap';
import { Geopoint } from 'geofire-common';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {
    checkedIfAllowedOnPage,
    k_admin_role,
} from '../authredirect/auth-check';
import { k_admin_portal_page_route } from '../index';
import wave from '../wave.png';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

const ReportsPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore();
    const { search } = useLocation();

    const [phoneSurveyResponseRefID, setPhoneSurveyResponseRefID] = useState(undefined);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [geopoint, setGeopoint] = useState<Geopoint>([0, 0]);
    const [geohash, setGeohash] = useState('');

    const [isUnknownLocation, setIsUnknownLocation] = useState(true);

    const [facilities, setFacilities] = useState<any>([]);

    const handleCloseModal = () => {
        setShowModal(false);
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setGeopoint([0, 0]);
        setGeohash('');
        setIsUnknownLocation(true);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(search);
        const phoneSurveyResponseID: any = searchParams.get('phoneSurveyResponseID');
        setPhoneSurveyResponseRefID(phoneSurveyResponseID || undefined);
        if (phoneSurveyResponseID) {
            setShowModal(true);
            const docRef = doc(db, 'phone-survey-responses', phoneSurveyResponseID);
            getDoc(docRef)
                .then((phoneSurveyResponseDoc: any) => {
                    const phoneSurveyResponse = phoneSurveyResponseDoc.data();
                    phoneSurveyResponse.id = phoneSurveyResponseDoc.id;
                    let nameQuestionID = '';
                    let locationQuestionID = '';
                    let phoneQuestionID = '';
                    let emailQuestionID = '';
                    getDocs(query(collection(db, 'question')))
                        .then((questionsDocs) => {
                            questionsDocs.forEach((questionDoc) => {
                                const question = questionDoc.data();
                                question.id = questionDoc.id;
                                const questionText = question?.question || '';
                                // eslint-disable-next-line max-len
                                // TODO: in future allow admin to define which question maps to which field
                                if (questionText.includes('facility name') || questionText.includes('name of your facility')) {
                                    nameQuestionID = question.id;
                                } else if (questionText.includes('location')) {
                                    locationQuestionID = question.id;
                                } else if (questionText.includes('phone')) {
                                    phoneQuestionID = question.id;
                                } else if (questionText.includes('email')) {
                                    emailQuestionID = question.id;
                                }
                            });
                            // digit responses
                            if (phoneSurveyResponse?.questions) {
                                phoneSurveyResponse.questions.forEach((questionResponse: any) => {
                                    const digit = questionResponse?.digit || 0;
                                    const questionID = questionResponse?.questionDBOID || '_%&none';
                                    if (questionID === phoneQuestionID) {
                                        setPhone(digit);
                                    }
                                });
                            }
                            // transcription responses
                            if (phoneSurveyResponse?.questionTranscriptions) {
                                // eslint-disable-next-line max-len
                                phoneSurveyResponse.questionTranscriptions.forEach((questionResponse: any) => {
                                    const transcriptionText = questionResponse?.transcriptionText || '';
                                    const questionID = questionResponse?.questionDBOID || '_%&none';
                                    if (questionID === nameQuestionID) {
                                        setName(transcriptionText);
                                    }
                                    if (questionID === locationQuestionID) {
                                        setAddress(transcriptionText);
                                    }
                                    if (questionID === emailQuestionID) {
                                        setEmail(transcriptionText);
                                    }
                                });
                            }
                        })
                        .catch((err) => {
                            // eslint-disable-next-line no-console
                            console.error('Error getting questions', err);
                            // eslint-disable-next-line no-alert
                            alert('Error getting questions');
                        });
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error('Error getting phone survey information', err);
                    // eslint-disable-next-line no-alert
                    alert('Error getting phone survey information');
                });
        }
    }, []);

    // useEffect(() => {
    //     debouncedSearchInput(address);
    // }, [address, debouncedSearchInput]);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        async function fetchFacilities() {
            setFacilities([]);
            const q = query(collection(db, 'support-ticket'));
            const querySnapshot = await getDocs(q);
            const facilitiesList: any = [];
            // eslint-disable-next-line @typescript-eslint/no-shadow
            querySnapshot.forEach((doc) => {
                const facility = doc.data();
                facility.id = doc.id;
                facilitiesList.push(facility);
            });
            setFacilities(facilitiesList);
        }

        fetchFacilities();
    }, [db]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                <div className="title">User Support Tickets</div>
            </div>
            <div className={styles.innerContainer3}>
                {
                    facilities.length === 0 && (
                        <h3 style={{ marginTop: '10px' }}>All support tickets have been resolved!</h3>
                    )
                }
                {facilities.map((facility: any) => (
                    <div className={styles.listItemContainer} key={facility.id}>
                        <div className={styles.listItemText2}>
                            REPORT:
                            {' '}
                            {facility.report || 'No text'}
                        </div>
                        <div className={styles.listItemText2}>
                            USER EMAIL:
                            {' '}
                            {facility?.user?.email || 'No Email for User'}
                        </div>
                        <div className={styles.listItemButtonsContainer}>
                            <button
                                style={{ border: '#e13d3d', background: '#e13d3d' }}
                                className={styles.deleteBtnListView}
                                onClick={() => {
                                    deleteDoc(doc(db, 'support-ticket', facility.id || ''))
                                        .then(() => {
                                            window.location.reload();
                                        })
                                        .catch((error: any) => {
                                            // eslint-disable-next-line no-alert
                                            alert('Error deleting facility.');
                                            // eslint-disable-next-line no-console
                                            console.error('Error deleting facility', error);
                                        });
                                }}
                            >
                                Resolve
                            </button>
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
                        navigate(k_admin_portal_page_route);
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
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Facility</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(event) => {
                                    setName(event?.target?.value || '');
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event?.target?.value || '');
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(event) => {
                                    setGeohash('');
                                    setGeopoint([0, 0]);
                                    setAddress(event?.target?.value || '');
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(event) => {
                                    setPhone(event?.target?.value || '');
                                }}
                            />
                        </Form.Group>
                        {
                            geohash
                            && (
                                <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                    <Form.Label>Latitude (auto-generated)</Form.Label>
                                    <Form.Control
                                        disabled
                                        type="text"
                                        placeholder="Latitude"
                                        value={geopoint[0].toString()}
                                    />
                                </Form.Group>
                            )
                        }
                        {
                            geohash
                            && (
                                <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                    <Form.Label>Longitude (auto-generated)</Form.Label>
                                    <Form.Control
                                        disabled
                                        type="text"
                                        placeholder="Longitude"
                                        value={geopoint[1].toString()}
                                    />
                                </Form.Group>
                            )
                        }
                        {
                            geohash
                            && (
                                <Form.Group className="mb-3" controlId="formBasicFacilityName">
                                    <Form.Label>Geohash (auto-generated)</Form.Label>
                                    <Form.Control
                                        disabled
                                        type="text"
                                        placeholder="Geohash"
                                        value={geohash}
                                    />
                                </Form.Group>
                            )
                        }
                        {
                            (address && isUnknownLocation)
                            && (
                                <p style={{ color: 'red' }}>Unknown location</p>
                            )
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className={styles.sendBtn}
                        onClick={() => {
                            if (geohash === undefined || geohash.length === 0) {
                                // eslint-disable-next-line no-alert
                                alert('Location cannot be found');
                            } else {
                                // eslint-disable-next-line no-console
                                console.log('test');
                                const newFacilityRef = doc(collection(db, 'facility'));
                                setDoc(newFacilityRef, {
                                    name,
                                    email,
                                    address,
                                    phone,
                                    geopoint: new GeoPoint(geopoint[0], geopoint[1]),
                                    geohash,
                                })
                                    .then(() => {
                                        async function fetchFacilities() {
                                            setFacilities([]);
                                            const q = query(collection(db, 'support-ticket'));
                                            const querySnapshot = await getDocs(q);
                                            const facilitiesList: any = [];
                                            // eslint-disable-next-line @typescript-eslint/no-shadow
                                            querySnapshot.forEach((doc) => {
                                                const facility = doc.data();
                                                facility.id = doc.id;
                                                facilitiesList.push(facility);
                                            });
                                            setFacilities(facilitiesList);
                                        }

                                        if (phoneSurveyResponseRefID) {
                                            const docRef = doc(db, 'phone-survey-responses', phoneSurveyResponseRefID);
                                            // eslint-disable-next-line max-len
                                            setDoc(docRef, { added: true }, { merge: true }).then(() => {
                                                handleCloseModal();
                                                fetchFacilities();
                                            });
                                        } else {
                                            handleCloseModal();
                                            fetchFacilities();
                                        }
                                    }).catch((err) => {
                                    // eslint-disable-next-line no-console
                                        console.error('Error creating facility', err);
                                        // eslint-disable-next-line no-alert
                                        alert('Error adding facility to database');
                                    });
                            }
                        }}
                    >
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
            <Waves />
        </div>
    );
};

export default ReportsPage;
