// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "ai-intevriew.firebaseapp.com",
  projectId: "ai-intevriew",
  storageBucket: "ai-intevriew.firebasestorage.app",
  messagingSenderId: "391122074547",
  appId: "1:391122074547:web:f0085608862e49de1a69c6",
  measurementId: "G-SK22ELYKSV",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
