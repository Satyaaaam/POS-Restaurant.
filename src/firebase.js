// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzzzx_Ty4C73BeK5DwtBuOWxDAbUn_iMw",
  authDomain: "pos-firebase-d09e0.firebaseapp.com",
  projectId: "pos-firebase-d09e0",
  storageBucket: "pos-firebase-d09e0.appspot.com",
  messagingSenderId: "484606895419",
  appId: "1:484606895419:web:2f3bb56cc793a77391831e"
};

const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);




export {
  authentication,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  app as default,
  db,
  firestore,
  deleteUser
};
