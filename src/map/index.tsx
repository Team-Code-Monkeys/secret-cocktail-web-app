import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role, k_regular_user_role} from "../authredirect/auth-check";

function MapPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_regular_user_role, k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar/>
            {/*TODO: allow admin user to delete facility*/}
            <div className={styles.innerContainer}>
                <div className={styles.listView}>

                </div>
                <div className={styles.mapView}>

                </div>
            </div>
        </div>
    );
}

export default MapPage;
