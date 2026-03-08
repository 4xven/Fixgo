// app/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyCurD4lxvW8ki1gLMO-onDHZbV6ZqI-hoc",
  authDomain: "fixgo-8a79b.firebaseapp.com",
  projectId: "fixgo-8a79b",
  storageBucket: "fixgo-8a79b.firebasestorage.app",
  messagingSenderId: "938962742816",
  appId: "1:938962742816:web:9c51d5b8ca9b4ffc13d645",
  measurementId: "G-P570TB7VRH"
};

const app = initializeApp(firebaseConfig);


// Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);