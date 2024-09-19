import { getStorage } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';




const firebaseConfig = {
  apiKey: "AIzaSyCeZM9UhmDItW7UiP3Dv6mKDma45NYJB4Q",
  authDomain: "blucrystal-openhouse.firebaseapp.com",
  databaseURL: "https://blucrystal-openhouse-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blucrystal-openhouse",
  storageBucket: "blucrystal-openhouse.appspot.com",
  messagingSenderId: "327755956461",
  appId: "1:327755956461:web:f4b9cd48673ab1ebe70ce4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);

export { storage, database };