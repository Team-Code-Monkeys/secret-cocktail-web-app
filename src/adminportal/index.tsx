import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role} from "../authredirect/auth-check";
import wave from "../wave.png";
import {k_admin_phone_survey_page_route, k_admin_facility_page_route} from "../index";
import { CSVLink } from "react-csv";
import {collection, getDocs, getFirestore, query} from "firebase/firestore";

const CSV_FIELDS = ["name", "email", "phone", "address", "about", "geohash", "geopoint"];

function AdminPortalPage() {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();
    const [facilityData, setFacilityData] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        async function fetchFacilityData() {
            try {
                const newFacilityData: Array<Array<string>> = [CSV_FIELDS];
                const querySnapshot = await getDocs(query(collection(db, "facility")));
                querySnapshot.forEach((doc) => {
                    const facility = doc.data();
                    const facilityDataArr: Array<string> = [];
                    for (const field of CSV_FIELDS) {
                        facilityDataArr.push(facility[field] ? `${makeStringCSVCompliant(JSON.stringify(facility[field]))}` : "");
                    }
                    newFacilityData.push(facilityDataArr);
                });
                return newFacilityData;
            } catch (e: any) {
                throw Error(e?.message || "unable to query database");
            }
        }

        fetchFacilityData().then((res) => {
            setFacilityData(res)
        }).catch((err) => {
            alert("Unable to generate CSV file for facilities " + err?.message || "");
        });
    }, [db]);

    function makeStringCSVCompliant(str: string) {
        let result = str;
        result = result.replace(/"/g, '""');
        result = result.replace(/,/g, ',');
        result = result.replace(/'/g, '\'');
        return result;
    }

    return (
        <div className={styles.container}>
            <Navbar/>
            <div className={styles.innerContainer}>
                <div className={styles.title}>Admin Portal</div>
            </div>
            <div className={styles.pageOuterContainer}>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤 Phone Survey</div>
                    <div className={styles.pageContainerText2}>Phone Survey</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>View phone survey</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>Edit questions</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>Delete questions</div>
                        </div>
                    </div>
                    <button className={styles.primaryBtn} onClick={() => {
                        navigate(k_admin_phone_survey_page_route);
                    }}>Customize Survey
                    </button>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤 Manage Facilities</div>
                    <div className={styles.pageContainerText2}>Facility Dashboard</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>View facility information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>Verify facility information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle/>
                            <div className={styles.pageContainerText3}>Delete facilities</div>
                        </div>
                    </div>
                    <button className={styles.primaryBtn} onClick={() => {
                        navigate(k_admin_facility_page_route);
                    }}>Open Dashboard
                    </button>
                </div>
            </div>
            {
                (facilityData && facilityData.length > 0) ?
                <CSVLink data={facilityData} filename={'facilities.csv'} className={styles.downloadBtn}>
                    <span>Download Facilities CSV File</span>
                </CSVLink>
                :
                <button className={styles.downloadBtn} disabled={true}>Loading...</button>
            }
            <Waves/>
        </div>
    );
}

function Circle() {
    return (
        <svg width="27" height="27" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_65_2560)">
                <rect x="0.540527" width="32" height="32" rx="16" fill="#FDCB6E"/>
            </g>
            <defs>
                <filter id="filter0_b_65_2560" x="-47.4595" y="-48" width="128" height="128" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="24"/>
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_65_2560"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_65_2560" result="shape"/>
                </filter>
            </defs>
        </svg>
    );
}

function Waves() {
    return (
        <img src={wave} className='wave' alt={'Wave for styling webpage.'}/>
    );
}

export default AdminPortalPage;
