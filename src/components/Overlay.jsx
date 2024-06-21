import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { scenesAtom, slideAtom } from './Experience';
import { storage } from './Firebase';
import CloudLoader from './CloudLoaderComponent';
import leftArrow from '../assets/left-arrow.svg';
import rightArrow from '../assets/right-arrow.svg';
import logo from '../assets/logo.svg';
import '../index.css';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  const [scenes, setScenes] = useAtom(scenesAtom);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 2000);
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
        setScenes((prevScenes) => [...prevScenes, { path, name }]);
        setSlide(prevScenes.length);
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
          <img src={logo} alt="Logo" className="logo" />
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
        <div className="nav">
          <img
            src={leftArrow}
            alt="Previous Slide"
            className="nav-button"
            onClick={() => setSlide((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}
          />
          <img
            src={rightArrow}
            alt="Next Slide"
            className="nav-button"
            onClick={() => setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0))}
          />
        </div>
        <div className="content">
          <h1 className="title">{scenes[displaySlide].name}</h1>
        </div>
      </>
    </div>
  );
};

