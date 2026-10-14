import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA13DkwxQPbznhjz6k02w7XP88JCn3-EVI",
  authDomain: "equipe-gaditas.firebaseapp.com",
  projectId: "equipe-gaditas",
  storageBucket: "equipe-gaditas.firebasestorage.app",
  messagingSenderId: "228465556497",
  appId: "1:228465556497:web:fa02a4db17759d8e5b45b0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
