// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBx2-mBJ2odFVEEiUcYTDwG_CRGmUnlbGg",
    authDomain: "prepwise-dd4a7.firebaseapp.com",
    projectId: "prepwise-dd4a7",
    storageBucket: "prepwise-dd4a7.firebasestorage.app",
    messagingSenderId: "998230020057",
    appId: "1:998230020057:web:affa80c28014a230a553c8",
    measurementId: "G-4113V250H2"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();
 export const auth = getAuth(app);
 export const db = getFirestore(app);