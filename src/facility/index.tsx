import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useLocation, useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import wave from '../wave.png';
import {k_facility_report_correction_page_route, k_map_page_route} from "../index";
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";
import ReactMarkdown from 'react-markdown'

function FacilityPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const location = useLocation();
    const db = getFirestore(firebaseApp);
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
                        const isFacility = idTokenResult?.claims?.facility === true;
                        setIsFacility(isFacility);
                    });
            }
        });
    }, [auth]);

    useEffect(() => {
        async function findFacilityByEmail(facilityEmail: string) {
            if (email) {
                const q = query(collection(db, "facility"), where("email", "==", email));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const facilityData = doc.data();
                    if (facilityData?.about) {
                        facilityData.about = facilityData.about.replaceAll("\\n", "\n");
                    }
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
                        facilityData.about = facilityData.about.replaceAll("\\n", "\n");
                    }
                    setFacility(facilityData);
                } else {
                    console.log("No facility with ID: ", facilityID);
                }
            }
        }

        if (isFacility) {
            findFacilityByEmail(email);
        } else {
            const splitName = location.pathname.split('/');
            const facilityID = splitName.length > 0 ? splitName[splitName.length - 1] : undefined;
            getFacility(facilityID);
        }
    }, [location, isFacility, db, email]);

    return (
        <div className={styles.container}>
            <Navbar/>
            {
                (isFacility === false) &&
                <div className={styles.backBtnContainer} onClick={() => {
                    navigate(k_map_page_route)
                }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27 20H13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M20 27L13 20L20 13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                    <div className={styles.backBtnText}>Back</div>
                </div>
            }
            {
                facility &&
                <div className={styles.facilityOuterContainer}>
                    <div className={styles.facilityContainer}>
                        <div className={styles.facilityInnerContainer}>
                            <div className={styles.facilityText}>NAME: {facility.name}</div>
                            <div className={styles.facilityText}>ADDRESS: {facility.address}</div>
                            <div className={styles.facilityText}>PHONE: {facility.phone}</div>
                        </div>
                        {
                            facility?.about &&
                            <ReactMarkdown className={styles.aboutText}>{`${facility.about}`}</ReactMarkdown>
                        }
                    </div>
                </div>
            }
            {
                isFacility && facility &&
                <div className={styles.btnOuterContainer}>
                    <div className={styles.btnContainer}>
                        <button className={styles.primaryBtn} onClick={() => {navigate(k_facility_report_correction_page_route)}}>Report a Correction</button>
                    </div>
                </div>
            }
            <Waves/>
        </div>
    );
}

function Waves() {
    return (
        <img src={wave} className={styles.wave} alt={'Wave for styling webpage.'}/>
    );
}

export default FacilityPage;
