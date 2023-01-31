import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import styles from './styles.module.css';
import logo from '../logo.png';
import {
    k_admin_phone_survey_page_route,
    k_admin_portal_page_route, k_facility_page_route, k_facility_report_correction_page_route,
    k_landing_page_route,
    k_login_page_trainee_route,
    k_map_page_route,
    k_register_page_trainee_route,
} from '../index';
import firebaseApp from '../firebase';

const Navbar = () => {
    const location = useLocation();
    const pathname = location?.pathname;
    return (
        <div className={styles.container}>
            <div className={styles.navbarInnerContainer}>
                <Logo />
                <TitleText />
                {(pathname === k_landing_page_route)
                    && <AuthButtons />}
                {([k_admin_portal_page_route, k_facility_page_route, k_facility_report_correction_page_route, k_map_page_route, k_admin_phone_survey_page_route].includes(pathname) || pathname?.includes(k_facility_page_route))
                    && <SignOutButton />}
            </div>
        </div>
    );
};

const Logo = () => (
    <img src={logo} alt="The Secret Cocktail company logo" className={styles.navbarLogo} />
);

const TitleText = () => (
    <div className={styles.navbarTitleText}>The Secret Cocktail</div>
);

const AuthButtons = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.navbarBtnsContainer}>
            <button
                className={styles.btnSecondary}
                onClick={() => {
                    navigate(k_login_page_trainee_route);
                }}
            >
                Login
            </button>
            <button
                className={styles.btnPrimary}
                onClick={() => {
                    navigate(k_register_page_trainee_route);
                }}
            >
                Sign Up
            </button>
        </div>
    );
};

const SignOutButton = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    return (
        <div className={styles.navbarBtnsContainer}>
            <button
                className={styles.btnPrimary}
                onClick={() => {
                    if (auth) {
                        auth.signOut()
                            .then((response) => {
                                navigate(k_landing_page_route);
                                // eslint-disable-next-line no-console
                                console.log('Sign out response', response);
                            })
                            .catch((error) => {
                                // eslint-disable-next-line no-alert
                                alert('Unable to sign out.');
                                // eslint-disable-next-line no-console
                                console.error('Unable to sign out.', error);
                            });
                    }
                }}
            >
                Log Out
            </button>
        </div>
    );
};

export default Navbar;
