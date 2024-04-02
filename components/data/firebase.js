// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5DRGRR0O0puIDg2nR0fRHtrN0QGo4Tzg",
  authDomain: "hanger18-cdfd6.firebaseapp.com",
  databaseURL: "https://hanger18-cdfd6-default-rtdb.firebaseio.com",
  projectId: "hanger18-cdfd6",
  storageBucket: "hanger18-cdfd6.appspot.com",
  messagingSenderId: "884917092791",
  appId: "1:884917092791:web:f2485fc5abbe72aed5a832",
  measurementId: "G-BK72QW171D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
