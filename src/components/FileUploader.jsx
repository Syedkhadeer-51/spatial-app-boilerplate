import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const FileUploader = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStarted, setUploadStarted] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setProgress(0); // Reset progress when a new file is selected
        setUploadStarted(false); // Reset upload started flag when a new file is selected
    };

    const handleUpload = () => {
        if (file) {
            setUploadStarted(true); // Set upload started flag
            const storageRef = ref(storage, `models/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    console.log('Upload is ' + Math.round(progress) + '% done');
                }, 
                (error) => {
                    console.error('Upload failed', error);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File URL: ' + downloadURL); // Log the file URL
                        onFileUploaded(downloadURL);
                    });
                }
            );
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadStarted && <p>Upload Progress: {Math.round(progress)}%</p>}
        </div>
    );
};

export default FileUploader;
