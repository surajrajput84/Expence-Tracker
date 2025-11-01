import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzfXwL4drhxcDsJDXEQD8KRxklW9QRAXc",
  authDomain: "expence-tracker-d5ea2.firebaseapp.com",
  projectId: "expence-tracker-d5ea2",
  storageBucket: "expence-tracker-d5ea2.appspot.com",
  messagingSenderId: "1002231881311",
  appId: "1:1002231881311:web:xxxxxxxxxxxxxxxx" // ← this last line you’ll find in Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
