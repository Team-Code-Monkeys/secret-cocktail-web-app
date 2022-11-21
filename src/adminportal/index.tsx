import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';

function AdminPortalPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar/>
            <div>TODO: page to select phone survey editor page or view facilities [use existing facility page, but add options for admin to delete facilities] (for 'admin' user only)</div>
        </div>
    );
}

export default AdminPortalPage;
