import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './Firebase';
import { scenes } from './Experience';

const CloudLoader = ({ onSelectModel }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        //const storageInstance = getStorage(storage);
        const listRef = storageRef(storage, '/');
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

  const ArrayAppend = (index)=> {
    const segments = files[index].split('/');
    const fileName = decodeURIComponent(segments.pop().split('?')[0]).replace('.glb', '');
    const obj = {
      path: `${files[index]}`,
      name: `${fileName}`
    }
    scenes.push(obj);
    alert("Model imported to the last step");
  }

  return (
    <div className="dropdown-content">
      {files.map((url, index) => {
        const segments = url.split('/');
        const fileName = decodeURIComponent(segments.pop().split('?')[0]).replace('.glb', '');
        return (
          <button key={index} onClick={() => ArrayAppend(index)}>
            {fileName}
          </button>
        );
      })}
    </div>
  );
};

export default CloudLoader;
