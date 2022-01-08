import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsA3hO5Y6gvFRGd1yrIsls5toElEV3bEM",
  authDomain: "listofstudents-d7a94.firebaseapp.com",
  projectId: "listofstudents-d7a94",
  storageBucket: "listofstudents-d7a94.appspot.com",
  messagingSenderId: "965139438441",
  appId: "1:965139438441:web:3afaa9ccce1e365f2cbbf8",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();

export { projectFirestore };
