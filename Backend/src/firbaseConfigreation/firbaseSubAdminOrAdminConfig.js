import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'dotenv/config'
// Firebase Admin SDK initialization
const firebaseConfigForSubAdmin = {
  apiKey: process.env.FIREBASE_SUBADMIN_API_KEY,
  authDomain: process.env.FIREBASE_SUBADMIN_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_SUBADMIN_PROJECT_ID,
  storageBucket: process.env.FIREBASE_SUBADMIN_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SUBADMIN_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_SUBADMIN_APP_ID,
  measurementId: process.env.FIREBASE_SUBADMIN_MEASUREMENT_ID
};

const firebaseConfigForAdmin = {
  apiKey: process.env.FIREBASE_ADMIN_API_KEY,
  authDomain: process.env.FIREBASE_ADMIN_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_ADMIN_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_ADMIN_APP_ID,
  measurementId: process.env.FIREBASE_ADMIN_MEASUREMENT_ID
};

const firebaseAppAdmin = initializeApp(firebaseConfigForAdmin);
const firebaseAppSubAdmin = initializeApp(firebaseConfigForSubAdmin, 'other');

export const Admin = getAuth(firebaseAppAdmin);
console.log(Admin.name);

export const Subadmin = getAuth(firebaseAppSubAdmin);
console.log(Subadmin.name);
