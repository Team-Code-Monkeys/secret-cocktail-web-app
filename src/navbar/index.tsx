import React from 'react';
import styles from './navstyles.module.css';
import logo from '../logo.png';
import {useNavigate, useLocation} from 'react-router-dom';
import {k_landing_page_route, k_login_page_trainee_route, k_register_page_trainee_route} from '../index';

function Navbar() {
    const location = useLocation();
    const pathname = location?.pathname;
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbarInnerContainer}>
                <Logo/>
                <TitleText/>
                {(pathname === k_landing_page_route) &&
                    <AuthButtons/>
                }
            </div>
        </div>
    );
}

function Logo() {
    return (
        <img src={logo} alt={'The Secret Cocktail company logo'} className={styles.navbarLogo}/>
    );
}

function TitleText() {
    return (
        <div className={styles.navbarTitleText}>The Secret Cocktail</div>
    );
}

function AuthButtons() {
    const navigate = useNavigate();

    return (
        <div className={styles.navbarBtnsContainer}>
            <button className={styles.loginBtn} onClick={() => {
                navigate(k_login_page_trainee_route)
            }}>Login
            </button>
            <button className={styles.signUpBtn} onClick={() => {
                navigate(k_register_page_trainee_route)
            }}>Sign Up
            </button>
        </div>
    );
}

export default Navbar;
