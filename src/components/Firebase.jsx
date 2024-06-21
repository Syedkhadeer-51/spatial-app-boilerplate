import { getStorage } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: "mulx-scenes",
  storageBucket: "gs://mulx-scenes.appspot.com",
  databaseURL: "https://mulx-scenes-default-rtdb.asia-southeast1.firebasedatabase.app/",
  appId: "1:483207095001:web:8cbe26215b4e9676cf94c8"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);

export { storage, database };