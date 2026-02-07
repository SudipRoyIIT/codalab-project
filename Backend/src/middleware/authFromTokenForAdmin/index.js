import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

// Initialize the Firebase Admin SDK
const firebaseConfigForAdmin = {
  "apiKey": "AIzaSyDl8nKkPb2UuCViMk3Q7ShBUlapLmaluZY",
  "authDomain": "codalabadmin.firebaseapp.com",
  "projectId": "codalabadmin",
  "storageBucket": "codalabadmin.appspot.com",
  "messagingSenderId": "429457587137",
  "appId": "1:429457587137:web:6862a145d881d186fc0d40",
  "measurementId": "G-DR5ZLTS1FP"  
};

if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.applicationDefault(),
    ...firebaseConfigForAdmin
  });
}

const auth = getAuth();

// Middleware for authentication
const authentication = async (req, res, next) => {
  const header = req.headers.authorization;
  console.log(header);
  
  if (!header || !header.startsWith("Bearer ")) {
    const statusMessage = 'Unauthorized Header. Access Denied';
    return res.status(401).send({ message: statusMessage });
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
    console.log(error);
    res.status(401).send({ message: 'You are not SubAdmin or wrong authorization',error:error});
  }
};

export default authentication;
