// uploadModel.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';
import Swal from 'sweetalert2';

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
    Swal.fire({
        title: 'Uploading...',
        html: 'Please wait while the model is being uploaded',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });

    return new Promise(async (resolve, reject) => {
        exporter.parse(gltf.scene, async(result) => {
            console
            const blob = new Blob([result], { type: 'application/octet-stream' });
            const snapshot = await uploadBytes(storageRef, blob);
            Swal.close();    
            console.log('Uploaded a blob or file!', snapshot);   
            Swal.fire({
                title: 'Success!',
                text: 'Upload completed successfully!',
                icon: 'success',
                confirmButtonText: '🚀 Got it!'
            });            resolve(blob);
        }, (error) => {
            console.error('An error happened during GLTF export', error);
            reject(error);
        }, options);
    });
}

const uploadFile = async (gltf,name) => {
    console.log(name);
  const storageRef = ref(storage, 'models/'+name+'.glb'); // Specify the path in Firebase Storage
  try {
    const compressedBlob = await compressAndExportGLTF(gltf, storageRef); // Wait for the promise to resolve
    console.log('File upload completed:', compressedBlob);
} catch (error) {
    console.error('File upload failed:', error);
}

};

export {uploadFile};