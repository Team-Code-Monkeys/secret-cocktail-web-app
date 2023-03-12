/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import styles from './styles.module.css';
import Navbar from '../navbar';
import firebaseApp from '../firebase';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import wave from '../wave.png';

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

const ForgotPasswordPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        setupAuthListener(auth, navigate, false, true);
    }, [auth, navigate]);

    function resetPassword() {
        if (!email) {
            alert('Email cannot be blank');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmail('');
                alert('Reset Password Email Sent!');
            // Password reset email sent!
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // eslint-disable-next-line no-console
                console.error(errorCode, errorMessage);
                alert('unable to send reset password email');
            });
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.titleContainer}>
                <div className={styles.title}>Reset Password</div>
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
                                resetPassword();
                            }
                        }}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                    <UserIcon field={email} />
                </div>
                <button
                    className="primaryBtn"
                    onClick={() => {
                        resetPassword();
                    }}
                >
                    Reset
                </button>
                {/* TODO: make this a button */}
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className={styles.backBtnContainer}
                    onClick={() => {
                        navigate(-1);
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
            <Waves />
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

export default ForgotPasswordPage;
