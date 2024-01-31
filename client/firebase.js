// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-26443.firebaseapp.com",
  projectId: "mernestate-26443",
  storageBucket: "mernestate-26443.appspot.com",
  messagingSenderId: "329124264633",
  appId: "1:329124264633:web:648055b3d5115c92f8b968",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
