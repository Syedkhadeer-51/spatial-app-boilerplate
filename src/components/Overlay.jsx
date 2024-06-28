import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { scenesAtom, slideAtom } from './Experience';
import { storage } from './Firebase';
import CloudLoader from './CloudLoaderComponent';
import leftArrow from '../assets/left-arrow.svg';
import rightArrow from '../assets/right-arrow.svg';
import logo from '../assets/logo.svg';
import trash from '../assets/trash.svg'
import '../index.css';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  const [scenes, setScenes] = useAtom(scenesAtom);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 200);
  }, [slide]);

  const getModelData = async () => {
    const currentScene = scenes[displaySlide];
    if (currentScene) {
      const modelUrl = currentScene.path;
      try {
        const response = await fetch(modelUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch model data');
        }
        return await response.arrayBuffer();
      } catch (error) {
        console.error('Error fetching model data:', error);
        return null;
      }
    } else {
      console.warn('No scene found to export.');
      return null;
    }
  };

  const handleImportDevice = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const path = URL.createObjectURL(file);
        const name = file.name.replace(/\.glb$/i, '');
        const obj = {
          path: `${path}`,
          name: `${name}`
        }
        scenes.push(obj);
        setSlide(scenes.length-1);
        alert("Model imported to the last step");
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportDevice = () => {
    const modelData = null; 

    const blob = new Blob([modelData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.glb';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const modelData = await getModelData();
    if (modelData) {
      const modelName = prompt('Enter a name for the model:');
      if (modelName) {
        try {
          const modelRef = storageRef(storage, `${modelName}.glb`);
          const blob = new Blob([modelData], { type: 'application/octet-stream' });
          await uploadBytes(modelRef, blob);
          alert('Model uploaded successfully!');
        } catch (error) {
          console.error('Error uploading model:', error);
        }
      }
    } else {
      alert('No model data available to export!');
    }
  };

  const handleDelete = (index) => {
    if (scenes.length > 1) {
      const confirmDeletion = window.confirm("Are you sure you want to delete this model?");
      if (confirmDeletion) {
        scenes.splice(index, 1);
        setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
      }
    } else {
      alert("Cannot delete the last remaining model.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setSlide(pageNumber);
  };
  

  return (
    <div className={`overlay ${visible ? 'visible' : 'invisible'}`}>
      <>
        <div className="nav-bar">
          <div className="nav-left">
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleImportDevice}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file" className="nav-link">
              Import From Device
            </label>
            <button onClick={handleExportDevice} className="exportbtn">
              Export To Device
            </button>
          </div>
          <h1 className='logo'>PeterCatCo</h1>
          <div className="nav-right">
            <div className="dropdown">
              <button className="dropbtn" onClick={() => setShowDropdown(!showDropdown)}>
                Import From Firebase
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <CloudLoader onSelectModel={(car) => console.log(`Selected car: ${car}`)} />
                </div>
              )}
            </div>
            <button onClick={handleExport} className="exportbtn">
              Export To Firebase
            </button>
          </div>
        </div>
        <img
          src = {trash}
          alt="delete"
          className="delete"
          onClick={()=> handleDelete(slide)}
        />
        <div className="content">
          <h1 className="title">{scenes[slide].name}</h1>
          <div className="pages">
            <button className='pages-button' 
              onClick={() => setSlide((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}>
              &laquo;    
            </button>
            {scenes.map((scene, index) => (
              <button
                key={index}
                className={`pages-button ${slide === index ? 'active' : ''}`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))} 
            <button className='pages-button' 
              onClick={() => setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0))}>
              &raquo;    
            </button>
          </div>

        </div>
        
      </>
    </div>
  );
};