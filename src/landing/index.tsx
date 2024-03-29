import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import styles from './styles.module.css';
import wave from '../wave.png';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {
    k_login_page_trainee_route,
    k_login_page_admin_route,
    k_login_page_facility_route,
    k_register_page_trainee_route,
} from '../index';

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

const LandingPage = () => {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthListener(auth, navigate, false, true);
    }, [auth, navigate]);

    return (
        <div className={styles.container}>
            <Navbar />
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <Title />
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <SubTitle />
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <Rectangle />
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <Dots />
            <div className={styles.pageOuterContainer}>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>The Secret Cocktail </div>
                    <div className={styles.pageContainerText2}>Admin</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Customize phone survey</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>View Facility List</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Moderate Facilities</div>
                        </div>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            navigate(k_login_page_admin_route);
                        }}
                    >
                        Admin Login
                    </button>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤 Individual </div>
                    <div className={styles.pageContainerText2}>CNA Trainer</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>
                                Search nearby facilities
                            </div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>
                                View facility information
                            </div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>
                                Map View by Location
                            </div>
                        </div>
                    </div>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => {
                            navigate(k_login_page_trainee_route);
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={styles.primaryTrainerBtn}
                        onClick={() => {
                            navigate(k_register_page_trainee_route);
                        }}
                    >
                        Sign Up
                    </button>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.pageContainerText1}>👤👤 Nursing Facilities</div>
                    <div className={styles.pageContainerText2}>Facility</div>
                    <div className={styles.bulletPointContainer}>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            {/* eslint-disable-next-line max-len */}
                            <div className={styles.pageContainerText3}>View facility information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            {/* eslint-disable-next-line max-len */}
                            <div className={styles.pageContainerText3}>Amend contact information</div>
                        </div>
                        <div className={styles.bulletPoint}>
                            <Circle />
                            <div className={styles.pageContainerText3}>Contact administrator</div>
                        </div>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            navigate(k_login_page_facility_route);
                        }}
                    >
                        Facility Login
                    </button>
                </div>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <Waves />
        </div>
    );
};

const Title = () => (
    <div className={styles.titleContainer}>
        <div className={styles.titleTextContainer}>
            <p className={styles.title} style={{ color: '#E75C5C', marginRight: '20px' }}>
                CNA
            </p>
            <p className={styles.title} style={{ color: '#2D3436' }}>
                Facilities
            </p>
        </div>
        <div className={styles.greenPillContainer}>
            <div className={styles.greenPill} />
        </div>
    </div>
);

const SubTitle = () => (
    <p className={styles.subtitle} style={{ color: '#2D3436' }}>
        Find a partner near you
    </p>
);

const Rectangle = () => (
    <svg
        width="873"
        height="753"
        viewBox="0 0 873 753"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.rectangleSVG}
    >
        <rect
            x="-41"
            y="251"
            width="1376.03"
            height="767.907"
            rx="99"
            transform="rotate(-45 -41 251)"
            fill="#faebb9"
        />
    </svg>
);

const Dots = () => (
    <svg
        width="209"
        height="285"
        viewBox="0 0 209 285"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.dotsSVG}
    >
        <g clipPath="url(#clip0_65_4460)">
            <path
                d="M162.704 35.6611C166.397 35.6611 169.391 32.6675 169.391 28.9747C169.391 25.2818 166.397 22.2882 162.704 22.2882C159.011 22.2882 156.018 25.2818 156.018 28.9747C156.018 32.6675 159.011 35.6611 162.704 35.6611Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 13.3729C188.685 13.3729 191.679 10.3793 191.679 6.68647C191.679 2.99363 188.685 0 184.992 0C181.299 0 178.306 2.99363 178.306 6.68647C178.306 10.3793 181.299 13.3729 184.992 13.3729Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 35.6611C210.973 35.6611 213.967 32.6675 213.967 28.9747C213.967 25.2818 210.973 22.2882 207.281 22.2882C203.588 22.2882 200.594 25.2818 200.594 28.9747C200.594 32.6675 203.588 35.6611 207.281 35.6611Z"
                fill="#FDCB6E"
            />
            <path
                d="M118.128 80.2377C121.82 80.2377 124.814 77.2441 124.814 73.5512C124.814 69.8584 121.82 66.8647 118.128 66.8647C114.435 66.8647 111.441 69.8584 111.441 73.5512C111.441 77.2441 114.435 80.2377 118.128 80.2377Z"
                fill="#FDCB6E"
            />
            <path
                d="M140.416 57.9494C144.109 57.9494 147.102 54.9557 147.102 51.2629C147.102 47.5701 144.109 44.5764 140.416 44.5764C136.723 44.5764 133.729 47.5701 133.729 51.2629C133.729 54.9557 136.723 57.9494 140.416 57.9494Z"
                fill="#FDCB6E"
            />
            <path
                d="M162.704 80.2377C166.397 80.2377 169.391 77.2441 169.391 73.5512C169.391 69.8584 166.397 66.8647 162.704 66.8647C159.011 66.8647 156.018 69.8584 156.018 73.5512C156.018 77.2441 159.011 80.2377 162.704 80.2377Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 57.9494C188.685 57.9494 191.679 54.9557 191.679 51.2629C191.679 47.5701 188.685 44.5764 184.992 44.5764C181.299 44.5764 178.306 47.5701 178.306 51.2629C178.306 54.9557 181.299 57.9494 184.992 57.9494Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 80.2377C210.973 80.2377 213.967 77.2441 213.967 73.5512C213.967 69.8584 210.973 66.8647 207.281 66.8647C203.588 66.8647 200.594 69.8584 200.594 73.5512C200.594 77.2441 203.588 80.2377 207.281 80.2377Z"
                fill="#FDCB6E"
            />
            <path
                d="M73.5512 124.814C77.244 124.814 80.2376 121.82 80.2376 118.128C80.2376 114.435 77.244 111.441 73.5512 111.441C69.8583 111.441 66.8647 114.435 66.8647 118.128C66.8647 121.82 69.8583 124.814 73.5512 124.814Z"
                fill="#FDCB6E"
            />
            <path
                d="M95.8394 102.526C99.5323 102.526 102.526 99.5323 102.526 95.8394C102.526 92.1466 99.5323 89.153 95.8394 89.153C92.1466 89.153 89.153 92.1466 89.153 95.8394C89.153 99.5323 92.1466 102.526 95.8394 102.526Z"
                fill="#FDCB6E"
            />
            <path
                d="M118.128 124.814C121.82 124.814 124.814 121.82 124.814 118.128C124.814 114.435 121.82 111.441 118.128 111.441C114.435 111.441 111.441 114.435 111.441 118.128C111.441 121.82 114.435 124.814 118.128 124.814Z"
                fill="#FDCB6E"
            />
            <path
                d="M140.416 102.526C144.109 102.526 147.102 99.5323 147.102 95.8394C147.102 92.1466 144.109 89.153 140.416 89.153C136.723 89.153 133.729 92.1466 133.729 95.8394C133.729 99.5323 136.723 102.526 140.416 102.526Z"
                fill="#FDCB6E"
            />
            <path
                d="M162.704 124.814C166.397 124.814 169.391 121.82 169.391 118.128C169.391 114.435 166.397 111.441 162.704 111.441C159.011 111.441 156.018 114.435 156.018 118.128C156.018 121.82 159.011 124.814 162.704 124.814Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 102.526C188.685 102.526 191.679 99.5323 191.679 95.8394C191.679 92.1466 188.685 89.153 184.992 89.153C181.299 89.153 178.306 92.1466 178.306 95.8394C178.306 99.5323 181.299 102.526 184.992 102.526Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 124.814C210.973 124.814 213.967 121.82 213.967 118.128C213.967 114.435 210.973 111.441 207.281 111.441C203.588 111.441 200.594 114.435 200.594 118.128C200.594 121.82 203.588 124.814 207.281 124.814Z"
                fill="#FDCB6E"
            />
            <path
                d="M95.8394 147.102C99.5323 147.102 102.526 144.109 102.526 140.416C102.526 136.723 99.5323 133.729 95.8394 133.729C92.1466 133.729 89.153 136.723 89.153 140.416C89.153 144.109 92.1466 147.102 95.8394 147.102Z"
                fill="#FDCB6E"
            />
            <path
                d="M118.128 169.391C121.82 169.391 124.814 166.397 124.814 162.704C124.814 159.011 121.82 156.018 118.128 156.018C114.435 156.018 111.441 159.011 111.441 162.704C111.441 166.397 114.435 169.391 118.128 169.391Z"
                fill="#FDCB6E"
            />
            <path
                d="M140.416 147.102C144.109 147.102 147.102 144.109 147.102 140.416C147.102 136.723 144.109 133.729 140.416 133.729C136.723 133.729 133.729 136.723 133.729 140.416C133.729 144.109 136.723 147.102 140.416 147.102Z"
                fill="#FDCB6E"
            />
            <path
                d="M162.704 169.391C166.397 169.391 169.391 166.397 169.391 162.704C169.391 159.011 166.397 156.018 162.704 156.018C159.011 156.018 156.018 159.011 156.018 162.704C156.018 166.397 159.011 169.391 162.704 169.391Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 147.102C188.685 147.102 191.679 144.109 191.679 140.416C191.679 136.723 188.685 133.729 184.992 133.729C181.299 133.729 178.306 136.723 178.306 140.416C178.306 144.109 181.299 147.102 184.992 147.102Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 169.391C210.973 169.391 213.967 166.397 213.967 162.704C213.967 159.011 210.973 156.018 207.281 156.018C203.588 156.018 200.594 159.011 200.594 162.704C200.594 166.397 203.588 169.391 207.281 169.391Z"
                fill="#FDCB6E"
            />
            <path
                d="M140.416 191.679C144.109 191.679 147.102 188.685 147.102 184.992C147.102 181.299 144.109 178.306 140.416 178.306C136.723 178.306 133.729 181.299 133.729 184.992C133.729 188.685 136.723 191.679 140.416 191.679Z"
                fill="#FDCB6E"
            />
            <path
                d="M162.704 213.967C166.397 213.967 169.391 210.973 169.391 207.281C169.391 203.588 166.397 200.594 162.704 200.594C159.011 200.594 156.018 203.588 156.018 207.281C156.018 210.973 159.011 213.967 162.704 213.967Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 191.679C188.685 191.679 191.679 188.685 191.679 184.992C191.679 181.299 188.685 178.306 184.992 178.306C181.299 178.306 178.306 181.299 178.306 184.992C178.306 188.685 181.299 191.679 184.992 191.679Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 213.967C210.973 213.967 213.967 210.973 213.967 207.281C213.967 203.588 210.973 200.594 207.281 200.594C203.588 200.594 200.594 203.588 200.594 207.281C200.594 210.973 203.588 213.967 207.281 213.967Z"
                fill="#FDCB6E"
            />
            <path
                d="M184.992 236.255C188.685 236.255 191.679 233.262 191.679 229.569C191.679 225.876 188.685 222.882 184.992 222.882C181.299 222.882 178.306 225.876 178.306 229.569C178.306 233.262 181.299 236.255 184.992 236.255Z"
                fill="#FDCB6E"
            />
            <path
                d="M207.281 258.543C210.973 258.543 213.967 255.55 213.967 251.857C213.967 248.164 210.973 245.171 207.281 245.171C203.588 245.171 200.594 248.164 200.594 251.857C200.594 255.55 203.588 258.543 207.281 258.543Z"
                fill="#FDCB6E"
            />
        </g>
        <defs>
            <clipPath id="clip0_65_4460">
                <rect width="209" height="285" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const Waves = () => (
    <img src={wave} className="wave" alt="Wave for styling webpage." />
);

export default LandingPage;
