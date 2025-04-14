// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNK0jbyyoN4rgGoTrcMuSFx7_thCf20ns",
  authDomain: "majority-report-0.firebaseapp.com",
  projectId: "majority-report-0",
  storageBucket: "majority-report-0.firebasestorage.app",
  messagingSenderId: "756693728796",
  appId: "1:756693728796:web:13ce912a9f3175ffe969d9",
  measurementId: "G-2TY86YRZG1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export let CurTeamId: string;
setInterval(() => {
  CurTeamId = (localStorage.getItem("TeamId") ?? "") + "/wtf/";
}, 1000);
