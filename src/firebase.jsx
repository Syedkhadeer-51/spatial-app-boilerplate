// firebaseConfig.js
import { initializeApp } from "@firebase/app";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB5n4MmE_l6r5U3Icj2EiDWtG6d2Fy2XLY",
    authDomain: "d1078-a91aa.firebaseapp.com",
    projectId: "d1078-a91aa",
    storageBucket: "d1078-a91aa.appspot.com",
    messagingSenderId: "151533610640",
    appId: "1:151533610640:web:f30251322c7fb74c2f1a15",
    measurementId: "G-CH0NW9CETQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app, "d1078-a91aa.appspot.com" );

export { storage };
