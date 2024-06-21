import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig.jsx';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function CloudContainer({ onImport }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    // Function to fetch files from Firebase Storage
    const fetchFiles = async () => {
      const storageRef = ref(storage, 'models/glb');
      const result = await listAll(storageRef);
      const fileList = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setFiles(fileList);
    };

    // Initial fetch of files
    fetchFiles();

    // Refresh files every 5 seconds
    const interval = setInterval(() => {
      fetchFiles();
    }, 5000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to handle file selection from dropdown
  const handleFileChange = async (event) => {
    const selectedFileUrl = event.target.value;
    setSelectedFile(selectedFileUrl);

    const loader = new GLTFLoader();
    loader.load(
      selectedFileUrl,
      (gltf) => {
        onImport(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );
  };

  return (
    <div className="cloud-container">
      <label htmlFor="file-select">Import a file from cloud:</label>
      <select id="file-select" value={selectedFile} onChange={handleFileChange}>
        <option value="" disabled>Select a file</option>
        {files.map((file) => (
          <option key={file.name} value={file.url}>
            {file.name}
          </option>
        ))}
      </select>
    </div>
  );
}
