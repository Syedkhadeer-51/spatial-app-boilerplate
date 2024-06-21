import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './Firebase';

const CloudLoader = ({ onSelectModel }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const storageInstance = getStorage(storage);
        const listRef = storageRef(storageInstance, '/');
        const res = await listAll(listRef);
        const downloadURLPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
        const fileUrls = await Promise.all(downloadURLPromises);
        setFiles(fileUrls);
      } catch (error) {
        console.error('Error listing files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="dropdown-content">
      {files.map((url, index) => {
        const segments = url.split('/');
        const fileName = decodeURIComponent(segments.pop().split('?')[0]).replace('.glb', '');
        return (
          <div key={index} onClick={() => onSelectModel(fileName)}>
            {fileName}
          </div>
        );
      })}
    </div>
  );
};

export default CloudLoader;
