// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { env } from "process";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "ai-intevriew.firebaseapp.com",
  projectId: "ai-intevriew",
  storageBucket: "ai-intevriew.firebasestorage.app",
  messagingSenderId: "391122074547",
  appId: "1:391122074547:web:f0085608862e49de1a69c6",
  measurementId: "G-SK22ELYKSV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
