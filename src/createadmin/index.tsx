import React from 'react';
import { API_URL } from '../api';

const CreateAdminPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [responseText, setResponseText] = React.useState<any>(undefined);

    return (
        <div>
            <h1>Create Admin Account</h1>
            {/* eslint-disable-next-line max-len */}
            <p>Fill out this form to create an admin account. Only one admin account can exist at a time.</p>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); }} />
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); }} />
            <button onClick={() => {
                if (email && password) {
                    setResponseText('Loading');
                    const body = JSON.stringify({
                        email,
                        password,
                    });
                    const headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    fetch(`${API_URL}/create-admin`, { method: 'POST', body, headers })
                        .then((response) => {
                            // eslint-disable-next-line no-console
                            response.text().then((t) => {
                                setResponseText(t);
                            }).catch(() => {
                                setResponseText('Error');
                            });
                            setEmail('');
                            setPassword('');
                        })
                        .catch((error) => {
                            // eslint-disable-next-line no-console
                            console.error(error);
                            // eslint-disable-next-line no-alert
                            alert('Error creating admin account');
                            setEmail('');
                            setPassword('');
                        });
                } else {
                    // eslint-disable-next-line no-alert
                    alert('Please fill out the email and password fields');
                }
            }}
            >
                Create Account
            </button>
            {
                responseText
                && <p>{responseText}</p>
            }
        </div>
    );
};

export default CreateAdminPage;
