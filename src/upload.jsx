// uploadModel.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';

const firebaseConfig = {
    apiKey: "AIzaSyBUsbX0lNGuDwn_sDkqy4djrDJpdL3Qr5g",
    authDomain: "twojs-bdb50.firebaseapp.com",
    projectId: "twojs-bdb50",
    storageBucket: "twojs-bdb50.appspot.com",
    messagingSenderId: "667804797365",
    appId: "1:667804797365:web:0abfa39c37ece6f5bef1fc",
    measurementId: "G-MRTQCCHDXN"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function compressAndExportGLTF(gltf, storageRef) {
    const exporter = new GLTFExporter();
    const options = {
        binary: true,
        dracoOptions: {
            compressionLevel: 10
        }
    };

    return new Promise((resolve, reject) => {
        exporter.parse(gltf.scene, (result) => {
            const blob = new Blob([result], { type: 'application/octet-stream' });
            const snapshot = uploadBytes(storageRef, blob);
            console.log('Uploaded a blob or file!', snapshot);        
            resolve(blob);
        }, (error) => {
            console.error('An error happened during GLTF export', error);
            reject(error);
        }, options);
    });
}

const uploadFile = async (gltf,name) => {
  const storageRef = ref(storage, 'models/'+name+'.glb'); // Specify the path in Firebase Storage
  const compressedBlob = compressAndExportGLTF(gltf, storageRef);
};

export {uploadFile};