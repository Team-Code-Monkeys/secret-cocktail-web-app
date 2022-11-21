import React, {useEffect, useState} from 'react';
import styles from './registerstyles.module.css';
import Navbar from '../navbar';
import {useLocation, useNavigate} from "react-router-dom";
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {
    k_landing_page_route, k_register_page_trainee_route, k_root_page_route
} from '../index';
import {setupAuthListener} from "../authredirect/setup-auth-listener";
import firebaseApp from '../firebase';

function RegisterPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const location = useLocation();
    const isTrainee = (location?.pathname === k_register_page_trainee_route);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setupAuthListener(auth, navigate, false, true);
    }, [auth, navigate]);

    function signUp() {
        if (!email || !password) {
            alert('Username and password cannot be blank');
            return;
        }
        if (confirmPassword !== password) {
            alert('Password and confirm password fields must match');
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential?.user;
                if (user) {
                    navigate(k_root_page_route);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('error creating account');
                console.error(errorCode, errorMessage);
                if (errorCode === 'auth/email-already-in-use') {
                    alert('Unable to create account. An account already exists with this email.');
                } else if(errorCode === 'auth/invalid-email') {
                    alert('Unable to create account. Invalid email provided.');
                } else if(errorCode === 'auth/weak-password') {
                    alert('Unable to create account. Password should be at least 6 characters long.');
                } else {
                    alert(`Unable to create account. ${errorMessage ? errorMessage : 'Unknown server error.'}`);
                }
            });
    }

    return (
        <div className={styles.registerPageContainer}>
            <Navbar/>
            <div className={styles.titleContainer}>
                <div className={styles.title}>CNA Facilities</div>
                {
                    isTrainee &&
                    <div className={styles.subtitle}>Create Nursing Trainee Account</div>
                }
            </div>
            <div className={styles.formContainer}>
                <div className={styles.inputContainer}>
                    <input placeholder={'Email'} type={'email'} className={styles.input} value={email}
                           onChange={(event) => setEmail(event.target.value)}/>
                    <UserIcon field={email}/>
                </div>
                <div className={styles.inputContainer}>
                    <input placeholder={'Password'} type={'password'} className={styles.input} value={password}
                           onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <div className={styles.inputContainer}>
                    <input placeholder={'Confirm Password'} type={'password'} className={styles.input}
                           value={confirmPassword}
                           onChange={(event) => setConfirmPassword(event.target.value)}/>
                </div>
                <button className={styles.primaryBtn} onClick={() => {
                    signUp()
                }}>Sign Up
                </button>
                <div className={styles.backBtnContainer} onClick={() => {
                    navigate(k_landing_page_route)
                }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27 20H13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M20 27L13 20L20 13" stroke="#5C5C5C" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                    <div className={styles.backBtnText}>Back</div>
                </div>
            </div>
        </div>
    );
}

function UserIcon(props: any) {
    return (
        <>
            {
                (!props.field || props.field.length === 0) &&
                <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.inputIcon}>
                    <path
                        d="M28 29V27C28 25.9391 27.5786 24.9217 26.8284 24.1716C26.0783 23.4214 25.0609 23 24 23H16C14.9391 23 13.9217 23.4214 13.1716 24.1716C12.4214 24.9217 12 25.9391 12 27V29"
                        stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path
                        d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
                        stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
        </>
    );
}

export default RegisterPage;
