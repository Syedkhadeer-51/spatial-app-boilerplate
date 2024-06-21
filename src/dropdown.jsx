import React from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from "firebase/app";
import {getStorage } from "firebase/storage";
import { useEffect } from 'react';

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

const listModels = async () => {
  const modelsRef = ref(storage, 'models'); // Change 'models' to your folder name
  try {
    const res = await listAll(modelsRef);
    const modelPromises = res.items.map(item => getDownloadURL(item).then(url => ({ name: item.name, url })));
    const models = await Promise.all(modelPromises);
    return models;
  } catch (error) {
    console.error("Error listing models:", error);
  }
};

function Dropdown({modelUrls,setExport,setModelPath,setModelUrls,setToCloud}) {
  useEffect(() => {
    const fetchModels = async () => {
      const modelList = await listModels();
      setModelUrls(modelList);
    };

    fetchModels();
  }, []);

  const handleModelChange = (event) => {
    const url = event.target.value;
    setModelPath(url);
    setExport(false);
    setToCloud(false);
  };
  return (
    <div className="model-selector" style={{float:'left',padding:'0px 10px 0px 0px'}}>
        <label htmlFor="model-select">Select a model:</label>
        <select id="model-select" onChange={handleModelChange}>
        <option value="">Select a model</option>
          {modelUrls.map(model => (
          <option key={model.url} value={model.url}>
          {model.name}
        </option>
        ))}
        </select>
      </div>
  );
}

export default Dropdown;