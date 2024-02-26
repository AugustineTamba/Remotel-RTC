// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ1TUmxzd_AnzXGzhBH3P295M9IvlnJUQ",
  authDomain: "remotelrtc.firebaseapp.com",
  projectId: "remotelrtc",
  storageBucket: "remotelrtc.appspot.com",
  messagingSenderId: "156818135393",
  appId: "1:156818135393:web:aa876616b537751db68d20",
  measurementId: "G-G2H256S9HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB, "user");
export const meetingsRef = collection(firebaseDB, "meetings");