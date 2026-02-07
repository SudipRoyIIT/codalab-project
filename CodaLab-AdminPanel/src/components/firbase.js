// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfigForSubAdmin = 
    {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY_SUBADMIN,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_SUBADMIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_SUBADMIN,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_SUBADMIN,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_SUBADMIN,
      appId: import.meta.env.VITE_FIREBASE_APP_ID_SUBADMIN,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_SUBADMIN
      };

const firebaseConfigForAdmin = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_ADMIN,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_ADMIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_ADMIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_ADMIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_ADMIN,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_ADMIN,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_ADMIN
};

export const firebaseAppAdmin = initializeApp(firebaseConfigForAdmin);
export const firebaseAppSubAdmin = initializeApp(firebaseConfigForSubAdmin, 'SubAdmin');

 

export const Admin = getAuth(firebaseAppAdmin);
console.log(Admin.name);

export const Subadmin = getAuth(firebaseAppSubAdmin);
console.log(Subadmin.name);


