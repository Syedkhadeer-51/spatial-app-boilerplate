// final
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

async function shrinkAndExportGLTF(gltf) {
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
            resolve(blob);
        }, (error) => {
            console.error('An error occurred during GLTF export', error);
            reject(error);
        }, options);
    });
}

const ExportToFirebaseButton = ({ modelRef, modelLoaded }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);

    const handleUpload = async () => {
        if (modelRef.current && modelLoaded) {
            try {
                const compressedBlob = await shrinkAndExportGLTF(modelRef.current);
                const storageRef = ref(storage, `exports/${Date.now()}_model_compressed.glb`);
                const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        console.error('Upload failed', error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('File uploaded to Firebase, URL:', downloadURL);
                        setUploadComplete(true);
                    }
                );
            } catch (error) {
                console.error('Error during compression and export:', error);
            }
        }
    };

    return (
        <div>
            <button onClick={handleUpload}>
                Export Model to Firebase
            </button>
            {uploadProgress > 0 && <p>Upload progress: {Math.round(uploadProgress)}%</p>}
        </div>
    );
};

export default ExportToFirebaseButton;
