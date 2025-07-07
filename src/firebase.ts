import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsDWR5CnnDEcl4je7nn-AzVm4aw21j1cs",
  authDomain: "rushrescue.firebaseapp.com",
  projectId: "rushrescue",
  storageBucket: "rushrescue.firebasestorage.app",
  messagingSenderId: "372637326718",
  appId: "1:372637326718:web:6f57e0345ae376e920672f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);