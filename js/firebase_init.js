// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhCasLUOO0hvQ0-42H2QuQfG3JIQAi2w4",
  authDomain: "landingpage-7f0ce.firebaseapp.com",
  databaseURL: "https://landingpage-7f0ce-default-rtdb.firebaseio.com",
  projectId: "landingpage-7f0ce",
  storageBucket: "landingpage-7f0ce.firebasestorage.app",
  messagingSenderId: "1014662309246",
  appId: "1:1014662309246:web:6d649d076f82bba4b67f2f",
  measurementId: "G-ZS6E80P9VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };