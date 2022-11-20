import React from 'react';
import styles from './styles.module.css';
import logo from '../logo.png';

function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbarInnerContainer}>
                <img src={logo} alt={'The Secret Cocktail company logo'} className={styles.navbarLogo}/>
                <div className={styles.navbarTitleText}>The Secret Cocktail</div>
                <div className={styles.navbarBtnsContainer}>
                    <button className={styles.loginBtn} onClick={() => {alert('login')}}>Login</button>
                    <button className={styles.signUpBtn} onClick={() => {alert('sign-up')}}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
