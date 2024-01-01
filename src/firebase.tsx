// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGRxn3TzfQHP6oxur_nnxLd9ieyQua2HQ",
  authDomain: "e-commerce-e7c4f.firebaseapp.com",
  projectId: "e-commerce-e7c4f",
  storageBucket: "e-commerce-e7c4f.appspot.com",
  messagingSenderId: "346980550637",
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);