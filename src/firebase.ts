// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
// import {getAnalytics} from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ",
    authDomain: "secret-cocktail.firebaseapp.com",
    projectId: "secret-cocktail",
    storageBucket: "secret-cocktail.appspot.com",
    messagingSenderId: "389621210114",
    appId: "1:389621210114:web:0b9e06bc35d57a3430db1b",
    measurementId: "G-TSBWQ81G3G"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
