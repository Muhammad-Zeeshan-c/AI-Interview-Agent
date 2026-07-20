import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-interveiw-agent.firebaseapp.com",
  projectId: "ai-interveiw-agent",
  storageBucket: "ai-interveiw-agent.firebasestorage.app",
  messagingSenderId: "150358070749",
  appId: "1:150358070749:web:10a9ee931f6d4d6062d234",
  measurementId: "G-9K44VNHHC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)

const provider=new GoogleAuthProvider()

export {auth,provider}