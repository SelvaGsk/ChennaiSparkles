// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5pHp9OUMTRL6mcw1ZIJpGvicerz8ILrY",
  authDomain: "chennai-sparkle-crackers.firebaseapp.com",
  databaseURL: "https://chennai-sparkle-crackers-default-rtdb.firebaseio.com",
  projectId: "chennai-sparkle-crackers",
  storageBucket: "chennai-sparkle-crackers.firebasestorage.app",
  messagingSenderId: "314212698051",
  appId: "1:314212698051:web:52c12c9284d4f953821f76",
  measurementId: "G-F57KNTW44Z"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const storage = getStorage(app);
