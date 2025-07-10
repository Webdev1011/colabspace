import { initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

export interface firebaseService {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

const app = initializeApp(firebaseConfig);

export const services: firebaseService = {
  auth: getAuth(app),
  db: getFirestore(app),
  storage: getStorage(app),
};
