// Import Firebase functions (v9+ modular SDK)
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, push } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Ensure auth import for auth-related functionality

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "echo-cloud-13574.firebaseapp.com",
  databaseURL: "https://echo-cloud-13574-default-rtdb.firebaseio.com",
  projectId: "echo-cloud-13574",
  storageBucket: "echo-cloud-13574.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting Firebase instances and functions
export const db = getDatabase(app); // Export Realtime Database instance
export const auth = getAuth(app); // Export Auth instance
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  ref,
  set,
  get,
  update,
  remove,
  push,
};
