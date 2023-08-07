// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import {getAnalytics} from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: 'AIzaSyAxAi1EsechS9MWXOHhY53u2JthptfPN1g',
    authDomain: 'tsc-phone-survey.firebaseapp.com',
    projectId: 'tsc-phone-survey',
    storageBucket: 'tsc-phone-survey.appspot.com',
    messagingSenderId: '583655314154',
    appId: '1:583655314154:web:b96b1c40990f8ff8a5bd93',
    measurementId: 'G-4NMJ5BVPCJ',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
