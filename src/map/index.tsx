import React from 'react';
import Navbar from '../navbar';
import styles from './mapstyles.module.css';

function MapPage() {
    return (
        <div className={styles.mapPageContainer}>
            <Navbar/>
            <div>hello world</div>
        </div>
    );
}

export default MapPage;
