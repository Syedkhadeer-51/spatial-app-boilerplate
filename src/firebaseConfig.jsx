import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX5WFGVL_FV7Aco6GsLtWLIoQzK3dmXBI",
  authDomain: "fabrik-shreya.firebaseapp.com",
  projectId: "fabrik-shreya",
  storageBucket: "fabrik-shreya.appspot.com",
  messagingSenderId: "854097276727",
  appId: "1:854097276727:web:a090e650e5548bb7a734b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };