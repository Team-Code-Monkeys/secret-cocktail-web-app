import React from 'react';
import styles from './registerstyles.module.css';
import Navbar from "../navbar";

function RegisterPage() {
    return (
        <div className={styles.registerPageContainer}>
            <Navbar/>
            <div>hello world register</div>
        </div>
    );
}

export default RegisterPage;
