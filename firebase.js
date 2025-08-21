// frontend/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX-XXXXXX-XXXXXX-XXXXXX",
  authDomain: "project-192730050831.firebaseapp.com",
  projectId: "project-192730050831",
  storageBucket: "project-192730050831.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234ef567890"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
