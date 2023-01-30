import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import styles from './styles.module.css';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import { checkedIfAllowedOnPage, k_admin_role } from '../authredirect/auth-check';
import wave from '../wave.png';
import { k_admin_phone_survey_page_route, k_admin_facility_page_route } from '../index';

const Circle = () => (
    <svg width="27" height="27" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_65_2560)">
            <rect x="0.540527" width="32" height="32" rx="16" fill="#FDCB6E" />
        </g>
        <defs>
            <filter
                id="filter0_b_65_2560"
                x="-47.4595"
                y="-48"
                width="128"
                height="128"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="24" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_65_2560" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_65_2560" result="shape" />
            </filter>
        </defs>
    </svg>
);

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

const AdminPortalPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                <div className={styles.title}>Admin Portal</div>
            </div>
            <div className={styles.pageOuterContainer}>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤 Phone Survey</div>
                    <div className={styles.pageContainerText2}>Phone Survey</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>View phone survey</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Edit questions</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Delete questions</div>
                        </div>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            navigate(k_admin_phone_survey_page_route);
                        }}
                    >
                        Customize Survey
                    </button>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤 Manage Facilities</div>
                    <div className={styles.pageContainerText2}>Facility Dashboard</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>View facility information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Verify facility information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Delete facilities</div>
                        </div>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            navigate(k_admin_facility_page_route);
                        }}
                    >
                        Open Dashboard
                    </button>
                </div>
            </div>
            <Waves />
        </div>
    );
};

export default AdminPortalPage;
