// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// EcoFinds Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCggZCcBun0cwNfOWGC2K8pZcgIRWMfqwY",
  authDomain: "ecofinds-marketplace.firebaseapp.com",
  projectId: "ecofinds-marketplace",
  storageBucket: "ecofinds-marketplace.appspot.com",
  messagingSenderId: "767411886432",
  appId: "1:767411886432:web:2ef6862afc88f2c423a605",
  measurementId: "G-4ELNR9DJHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Export the app instance
export default app;