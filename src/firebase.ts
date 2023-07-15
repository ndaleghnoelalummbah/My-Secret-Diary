import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "@firebase/storage";
//import "firebase/storage";
// const firebaseConfig = {
//   // Your Firebase configuration object here
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDjp-7yR3-nSm9tDB4oG1-DCJTIiFS5Auo",
  authDomain: "my-secret-diary-fa48b.firebaseapp.com",
  projectId: "my-secret-diary-fa48b",
  storageBucket: "my-secret-diary-fa48b.appspot.com",
  messagingSenderId: "130407956294",
  appId: "1:130407956294:web:208919c7499197a5286f47",
  measurementId: "G-KBBD5V6052",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//get references to authentication, firstore and storage services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// export const storageRef = storage.ref();
// export  const storage=firebase.storage();
// const storageRef=storage.ref();