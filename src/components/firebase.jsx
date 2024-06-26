import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCn_sST0P-YXo-7JFKfx2sXaiV0ywwVk6Q",
    authDomain: "blycrystal-dd7a9.firebaseapp.com",
    projectId: "blycrystal-dd7a9",
    storageBucket: "blycrystal-dd7a9.appspot.com",
    messagingSenderId: "903950422896",
    appId: "1:903950422896:web:b49e9c6664f9d596b3b5b5",
    measurementId: "G-WW9XLGN658"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };