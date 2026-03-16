// app/config/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // just getAuth

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCurD4lxvW8ki1gLMO-onDHZbV6ZqI-hoc",
  authDomain: "fixgo-8a79b.firebaseapp.com",
  projectId: "fixgo-8a79b",
  storageBucket: "fixgo-8a79b.appspot.com",
  messagingSenderId: "938962742816",
  appId: "1:938962742816:web:9c51d5b8ca9b4ffc13d645",
  measurementId: "G-P570TB7VRH",
};

// Initialize Firebase App (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Export instances
export { app, auth, db };