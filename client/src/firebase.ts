// Import the functions you need from the SDKs you need
/// reference type = '../node_modules/vite/types/importMeta' />
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'mern-estate-731c5.firebaseapp.com',
  projectId: 'mern-estate-731c5',
  storageBucket: 'mern-estate-731c5.appspot.com',
  messagingSenderId: '569002410714',
  appId: '1:569002410714:web:1bfec83cdea2210d211be3',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
