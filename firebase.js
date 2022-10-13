import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/auth'
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGAHbeXjVscBhSVEnkwvGwqVOu5NLCJfE",
  authDomain: "whatsapp-2-6e14c.firebaseapp.com",
  projectId: "whatsapp-2-6e14c",
  storageBucket: "whatsapp-2-6e14c.appspot.com",
  messagingSenderId: "140615763823",
  appId: "1:140615763823:web:a647ffea30ab27a3a64a9a",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
// const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
