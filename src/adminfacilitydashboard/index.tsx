import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    getDocs,
    query,
    where,
    getFirestore,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {
    checkedIfAllowedOnPage,
    k_admin_role,
} from '../authredirect/auth-check';
import { k_admin_portal_page_route, k_facility_page_route } from '../index';

const CSV_FIELDS = ['name', 'email', 'phone', 'address', 'about', 'geohash', 'geopoint'];

const AdminFacilities = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore();

    const [facilities, setFacilities] = useState<any>([]);
    const [facilityData, setFacilityData] = useState<Array<Array<string>>>([]);

    function makeStringCSVCompliant(str: string | undefined) {
        if (!str) {
            return '';
        }
        let result = str;
        result = result.replace(/"/g, '""');
        result = result.replace(/,/g, ',');
        result = result.replace(/'/g, '\'');
        return result;
    }

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        async function fetchFacilities() {
            const q = query(collection(db, 'facility'), where('name', '>=', ''));
            const querySnapshot = await getDocs(q);
            const facilitiesList: any = [];
            querySnapshot.forEach((doc) => {
                const facility = doc.data();
                facility.id = doc.id;
                facilitiesList.push(facility);
            });
            setFacilities(facilitiesList);
        }

        fetchFacilities();
    }, [db]);

    useEffect(() => {
        async function fetchFacilityData() {
            try {
                const newFacilityData: Array<Array<string>> = [CSV_FIELDS];
                const querySnapshot = await getDocs(query(collection(db, 'facility')));
                querySnapshot.forEach((doc) => {
                    const facility = doc.data();
                    const facilityDataArr: Array<string> = [];

                    CSV_FIELDS.forEach(((field) => {
                        facilityDataArr.push(facility[field] ? `${makeStringCSVCompliant(JSON.stringify(facility[field]))}` : '');
                    }));

                    newFacilityData.push(facilityDataArr);
                });
                return newFacilityData;
            } catch (e: any) {
                throw Error(e?.message || 'unable to query database');
            }
        }

        fetchFacilityData().then((res) => {
            setFacilityData(res);
        }).catch((err) => {
            alert(`Unable to generate CSV file for facilities ${err?.message}` || '');
        });
    }, [db]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                <div className={styles.title}>Facility Dashboard</div>
            </div>
            <div className={styles.innerContainer3}>
                {
                    (facilityData && facilityData.length > 0)
                        ? (
                            <CSVLink data={facilityData} filename="facilities.csv" className={styles.downloadBtn}>
                                <span>Download CSV</span>
                            </CSVLink>
                        )
                        : <button className={styles.downloadBtn} disabled>Loading...</button>
                }
                {facilities.map((facility: any) => (
                    <div className={styles.listItemContainer} key={facility.id}>
                        <div className={styles.listItemText2}>
                            NAME:
                            {' '}
                            {facility.name || 'No text'}
                        </div>
                        <div className={styles.listItemText2}>
                            ADDRESS:
                            {' '}
                            {facility.address || 'No text'}
                        </div>
                        <div className={styles.listItemText2}>
                            PHONE:
                            {' '}
                            {facility.phone || 'No text'}
                        </div>
                        <div className={styles.listItemButtonsContainer}>
                            <button
                                className={styles.primaryBtnListView}
                                onClick={() => {
                                    navigate(`${k_facility_page_route}/${facility.id}` || 'none', {
                                        state: {
                                            distance: undefined,
                                            goBackToAdminPage: true,
                                        },
                                    });
                                }}
                            >
                                More Info
                            </button>
                            <button
                                style={{ border: '#e13d3d', background: '#e13d3d' }}
                                className={styles.primaryBtnListView}
                                onClick={() => {
                                    deleteDoc(doc(db, 'facility', facility.id || ''))
                                        .then(() => {
                                            window.location.reload();
                                        })
                                        .catch((error: any) => {
                                            alert('Error deleting facility.');
                                            console.error('Error deleting facility', error);
                                        });
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.innerContainer}>
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
        </div>
    );
};

export default AdminFacilities;
