
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAxfpdrfudfIxyXyJ0P72HKZoklUcLjk0",
  authDomain: "ppt-maker-7f813.firebaseapp.com",
  databaseURL: "https://ppt-maker-7f813-default-rtdb.firebaseio.com",
  projectId: "ppt-maker-7f813",
  storageBucket: "ppt-maker-7f813.firebasestorage.app",
  messagingSenderId: "1025690539388",
  appId: "1:1025690539388:web:1d0f56efe483b31d1000f9",
  measurementId: "G-Q21B30SXRX"
};

// Initialize specific app instance to avoid multiple Initializations
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firestore };
