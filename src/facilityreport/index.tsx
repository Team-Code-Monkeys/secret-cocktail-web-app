import React, {useEffect} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';

function ReportFacilityCorrectionPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar/>
            <div>TODO: page to report correction about facility information (for 'facility' user type only)</div>
        </div>
    );
}

export default ReportFacilityCorrectionPage;
