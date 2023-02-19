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
    doc, setDoc,
    GeoPoint,
} from 'firebase/firestore';
import { CSVLink } from 'react-csv';
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
import { k_admin_portal_page_route, k_facility_page_route } from '../index';
import wave from '../wave.png';

const CSV_FIELDS = ['name', 'email', 'phone', 'address', 'about', 'geohash', 'geopoint'];

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

const AdminFacilities = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore();

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [geopoint, setGeopoint] = useState<Geopoint>([0, 0]);
    const [geohash, setGeohash] = useState('');

    const [facilities, setFacilities] = useState<any>([]);
    const [facilityData, setFacilityData] = useState<Array<Array<string>>>([]);

    const handleCloseModal = () => {
        setShowModal(false);
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setGeopoint([0, 0]);
        setGeohash('');
    };

    useEffect(() => {
        // TODO: use query parameters to auto-fill new facility info and show the modal
    }, []);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(address);
        // TODO: update geopoint and geohash based off address input
    }, [address]);

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

    useEffect(() => {
        async function fetchFacilityData() {
            try {
                const newFacilityData: Array<Array<string>> = [CSV_FIELDS];
                const querySnapshot = await getDocs(query(collection(db, 'facility')));
                // eslint-disable-next-line @typescript-eslint/no-shadow
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
            // eslint-disable-next-line no-alert
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
                <div className={styles.innerContainer4} style={{ marginBottom: '15px' }}>
                    <button
                        style={{ width: 300 }}
                        className={styles.downloadBtn}
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        Add Facility
                    </button>
                </div>
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
                                className={styles.deleteBtnListView}
                                onClick={() => {
                                    deleteDoc(doc(db, 'facility', facility.id || ''))
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
                                Delete
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
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Latitude (auto-generated)</Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                placeholder="Latitude"
                                value={geopoint[0].toString()}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Longitude (auto-generated)</Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                placeholder="Longitude"
                                value={geopoint[1].toString()}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFacilityName">
                            <Form.Label>Geohash (auto-generated)</Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                placeholder="Geohash"
                                value={geohash}
                            />
                        </Form.Group>
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
                                        handleCloseModal();
                                    }).catch((err) => {
                                        // eslint-disable-next-line no-console
                                        console.error('Error creating facility', err);
                                        // eslint-disable-next-line no-alert
                                        alert('Error adding facility to database');
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
    );
};

export default AdminFacilities;
