import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAJkrS5e52b1EO3yZIp0pv28J6VGyZX-L4",
  authDomain: "tarefasplus-e15c8.firebaseapp.com",
  projectId: "tarefasplus-e15c8",
  storageBucket: "tarefasplus-e15c8.firebasestorage.app",
  messagingSenderId: "216023179141",
  appId: "1:216023179141:web:dfe66de1fd0da465166eec"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const db = getFirestore(fireBaseApp)

export {db};