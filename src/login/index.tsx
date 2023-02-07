/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import styles from './styles.module.css';
import Navbar from '../navbar';
import {
    k_landing_page_route,
    k_login_page_trainee_route,
    k_login_page_admin_route,
    k_login_page_facility_route, k_root_page_route,
} from '../index';
import firebaseApp from '../firebase';
import { setupAuthListener } from '../authredirect/setup-auth-listener';

const LoginPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location?.pathname;
    const isTrainee = (pathname === k_login_page_trainee_route);
    const isFacility = (pathname === k_login_page_facility_route);
    const isAdmin = (pathname === k_login_page_admin_route);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setupAuthListener(auth, navigate, false, true);
    }, [auth, navigate]);

    function signIn() {
        if (!email || !password) {
            alert('Username and password cannot be blank');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential?.user;
                if (user) {
                    navigate(k_root_page_route);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // eslint-disable-next-line no-console
                console.error('error creating account');
                // eslint-disable-next-line no-console
                console.error(errorCode, errorMessage);
                if (errorCode === 'auth/wrong-password') {
                    alert('Unable to login. Incorrect password provided.');
                } else if (errorCode === 'auth/user-not-found') {
                    alert('Unable to login. User does not exist with this email.');
                } else if (errorCode === 'auth/invalid-email') {
                    alert('Unable to login. Invalid email provided.');
                } else {
                    alert(`Unable to login. ${errorMessage || 'Unknown server error.'}`);
                }
            });
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.titleContainer}>
                <div className={styles.title}>CNA Facilities</div>
                {
                    isTrainee
                    && <div className={styles.subtitle}>CNA Trainer Login</div>
                }
                {
                    isFacility
                    && <div className={styles.subtitle}>CNA Facility Login</div>
                }
                {
                    isAdmin
                    && <div className={styles.subtitle}>Admin Login</div>
                }
            </div>
            <div className={styles.formContainer}>
                <div className={styles.inputContainer}>
                    <input
                        placeholder="Email"
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                signIn();
                            }
                        }}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                    <UserIcon field={email} />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        placeholder="Password"
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                signIn();
                            }
                        }}
                    />
                </div>
                <button
                    className="primaryBtn"
                    onClick={() => {
                        signIn();
                    }}
                >
                    Sign In
                </button>
                {/* TODO: make this a button */}
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className={styles.backBtnContainer}
                    onClick={() => {
                        navigate(k_landing_page_route);
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
            </div>
        </div>
    );
};

const UserIcon = (props: any) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
        {
            (!props.field || props.field.length === 0)
                && (
                    <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.inputIcon}>
                        <path
                            d="M28 29V27C28 25.9391 27.5786 24.9217 26.8284 24.1716C26.0783 23.4214 25.0609 23 24 23H16C14.9391 23 13.9217 23.4214 13.1716 24.1716C12.4214 24.9217 12 25.9391 12 27V29"
                            stroke="#ADADAD"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
                            stroke="#ADADAD"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )
        }
    </>
);

export default LoginPage;
