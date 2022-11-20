import React from 'react';
import styles from './styles.module.css';
import logo from '../logo.png';

function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbarInnerContainer}>
                <img src={logo} alt={'The Secret Cocktail company logo'} className={styles.navbarLogo}/>
                <div className={styles.navbarTitleText}>The Secret Cocktail</div>
            </div>
        </div>
    );
}

export default Navbar;
