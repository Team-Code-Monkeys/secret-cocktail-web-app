import React from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';

function LandingPage() {
    return (
        <div className={styles.landingPageContainer}>
            <Navbar/>
            <div className={styles.titleContainer}>
                <div className={styles.titleTextContainer}>
                    <p className={styles.title} style={{color: '#E75C5C', marginRight: '20px'}}>
                        CNA
                    </p>
                    <p className={styles.title} style={{color: '#2D3436'}}>
                        Facilities
                    </p>
                </div>
                <div className={styles.greenPillContainer}>
                    <div className={styles.greenPill} />
                </div>
            </div>
            <p className={styles.subtitle} style={{color: '#2D3436'}}>
                Find a partner near you
            </p>
        </div>
    );
}

export default LandingPage;
