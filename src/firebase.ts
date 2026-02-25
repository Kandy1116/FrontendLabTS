// Import the functions you need from the SDKs you need 
 import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
 // TODO: Add SDKs for Firebase products that you want to use 
 // `https://firebase.google.com/docs/web/setup#available-libraries`  
  
 // Your web app's Firebase configuration 
 const firebaseConfig = { 
   apiKey: "AIzaSyCBEnyKZ7pOdQ1X78vxYJqb7pDrDTABOkw", 
   authDomain: "fir-env-local.firebaseapp.com", 
   projectId: "fir-env-local", 
   storageBucket: "fir-env-local.firebasestorage.app", 
   messagingSenderId: "480604341198", 
   appId: "1:480604341198:web:8253764325a01c7aade19f" 
 }; 
  
 // Initialize Firebase 
 const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
