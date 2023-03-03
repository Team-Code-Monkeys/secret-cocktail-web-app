import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    collection, doc, getDoc, getDocs, getFirestore, query, where,
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import wave from '../wave.png';
import { k_facility_report_correction_page_route } from '../index';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);
const FacilityPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const location = useLocation();
    const db = getFirestore(firebaseApp);
    const [, setIsAdmin] = useState<any>(undefined);
    const [isFacility, setIsFacility] = useState<any>(undefined);
    const [facility, setFacility] = useState<any>(undefined);
    const [email, setEmail] = useState<any>(undefined);

    useEffect(() => {
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                setEmail(user?.email);
                user.getIdTokenResult()
                    .then((idTokenResult: any) => {
                        setIsAdmin(idTokenResult?.claims?.admin === true);
                        setIsFacility(idTokenResult?.claims?.facility === true);
                    });
            }
        });
    }, [auth]);

    useEffect(() => {
        async function findFacilityByEmail() {
            if (email) {
                const q = query(collection(db, 'facility'), where('email', '==', email));

                const querySnapshot = await getDocs(q);
                // eslint-disable-next-line @typescript-eslint/no-shadow
                querySnapshot.forEach((doc) => {
                    const facilityData = doc.data();
                    if (facilityData?.about) {
                        facilityData.about = facilityData.about.replaceAll('\\n', '\n');
                    }
                    facilityData.id = doc.id;
                    setFacility(facilityData);
                });
            }
        }

        async function getFacility(facilityID: any) {
            if (facilityID) {
                const docRef = doc(db, 'facility', facilityID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const facilityData = docSnap.data();
                    if (facilityData?.about) {
                        facilityData.about = facilityData.about.replaceAll('\\n', '\n');
                    }
                    facilityData.id = docSnap.id;
                    setFacility(facilityData);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('No facility with ID: ', facilityID);
                }
            }
        }

        if (isFacility) {
            findFacilityByEmail();
        } else {
            const splitName = location.pathname.split('/');
            const facilityID = splitName.length > 0 ? splitName[splitName.length - 1] : undefined;
            getFacility(facilityID);
        }
    }, [location, isFacility, db, email]);

    return (
        <div className={styles.container}>
            <Navbar />
            {
                (isFacility === false)
                && (
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
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
                )
            }
            {
                facility
                && (
                    <div className={styles.facilityOuterContainer}>
                        <div className={styles.facilityContainer}>
                            <div className={styles.facilityInnerContainer}>
                                <div className={styles.facilityText}>
                                    NAME:
                                    {facility.name}
                                </div>
                                <div className={styles.facilityText}>
                                    ADDRESS:
                                    {facility.address}
                                </div>
                                <div className={styles.facilityText}>
                                    PHONE:
                                    {facility.phone}
                                </div>
                            </div>
                            {
                                facility?.about
                            && <ReactMarkdown className={styles.aboutText}>{`${facility.about}`}</ReactMarkdown>
                            }
                        </div>
                    </div>
                )
            }
            {
                isFacility && facility
                && (
                    <div className={styles.btnOuterContainer}>
                        <div className={styles.btnContainer}>
                            {/* eslint-disable-next-line max-len */}
                            <button id="reportBtn" className={styles.primaryBtn} onClick={() => { navigate(k_facility_report_correction_page_route, { state: { facilityId: facility.id } }); }}>Report a Correction</button>
                        </div>
                    </div>
                )
            }
            <Waves />
        </div>
    );
};

export default FacilityPage;
