import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

// Initialize the Firebase Admin SDK
const firebaseConfigForSubAdmin = {
  apiKey: "AIzaSyDBhWsmCnuqXFWByZZNA5kiW9z8grOnqPc",
  authDomain: "codalabsubadmin.firebaseapp.com",
  projectId: "codalabsubadmin",
  storageBucket: "codalabsubadmin.appspot.com",
  messagingSenderId: "727263290741",
  appId: "1:727263290741:web:a9eb28c319c7dd29699f3c",
  measurementId:"G-HVXQBRPVSX"
};


const a =  initializeApp({
    credential: admin.credential.applicationDefault(),
    ...firebaseConfigForSubAdmin
  },'SubAdmin');


const auth = getAuth(a);

const authentication = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).send({ message: 'Unauthorized Header. Access Denied' });
  }

  const token = header.substring(7, header.length);

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized Header. Access Denied' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.headers.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({      message: 'You are not SubAdmin or wrong authorization',error:error });
  }
};

export default authentication;
