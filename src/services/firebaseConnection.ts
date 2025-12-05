import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "*********???????????",
  authDomain: "tarefasplus-e15c8.firebaseapp.com",
  projectId: "tarefasplus-e15c8",
  storageBucket: "tarefasplus-e15c8.firebasestorage.app",
  messagingSenderId: "216023179141",
  appId: "1:216023179141:web:*******"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const db = getFirestore(fireBaseApp)

export {db};