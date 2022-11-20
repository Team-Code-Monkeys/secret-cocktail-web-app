import React from 'react';
import styles from './navstyles.module.css';
import logo from '../logo.png';

function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbarInnerContainer}>
                <Logo/>
                <TitleText/>
                <AuthButtons/>
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
    return (
        <div className={styles.navbarBtnsContainer}>
            <button className={styles.loginBtn} onClick={() => {alert('login')}}>Login</button>
            <button className={styles.signUpBtn} onClick={() => {alert('sign-up')}}>Sign Up</button>
        </div>
    );
}

export default Navbar;
