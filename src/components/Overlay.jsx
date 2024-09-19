import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { scenesAtom, slideAtom } from './Experience';
import { storage } from './Firebase';
import CloudLoader from './CloudLoaderComponent';
import '../index.css';
import './info_panel.css'
import { ref, uploadBytesResumable} from 'firebase/storage';

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';


export const Overlay = ({sceneRef, store}) => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  const [scenes, setScenes] = useAtom(scenesAtom);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);


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

  const handleExportDevice = async () => {
    const modelData = await getModelData();
  
    if (!modelData) {
      console.error('No model data to export.');
      return;
    }
  
    const exporter = new GLTFExporter();
  
    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true,
      maxTextureSize: 1024 || Infinity,
    };
  
    exporter.parse(sceneRef.current, (result) => {
      try {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'model.glb'; 
          document.body.appendChild(a); 
          a.click();
          document.body.removeChild(a); 
          URL.revokeObjectURL(url); 
        } else {
          const output = JSON.stringify(result, null, 2);
          const blob = new Blob([output], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'model.gltf';
          document.body.appendChild(a); 
          a.click();
          document.body.removeChild(a); 
          URL.revokeObjectURL(url); 
        }
      } catch (error) {
        console.error('Error exporting file:', error);
      }
    }, options);
  };
  

  const handleExport = async () => {
    const modelName = prompt('Enter a name for the model:');
    if (!sceneRef.current || !sceneRef.current.children.length) {
      console.error('Invalid or empty scene');
      return;
    }
    const exporter = new GLTFExporter();
  
    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true,
      maxTextureSize: 1024 || Infinity,
    };
  
    exporter.parse(sceneRef.current, async (result) => {
      try {
        if (result instanceof ArrayBuffer) {
          const file = new Blob([result], { type: 'application/octet-stream' });
          const storageRef = ref(storage, `${modelName}.glb`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed',
            (snapshot) => {
              // Progress monitoring if needed
            },
            (error) => {
              console.error('Error uploading file:', error);
            },
            () => {
              console.log('Upload successful!');
            }
          );
          
  
        } else {
          const output = JSON.stringify(result, null, 2);
          const file = new Blob([output], { type: 'text/plain' });
          const storageRef = ref(storage, `${modelName}.gltf`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed',
            (snapshot) => {
              // Progress monitoring if needed
            },
            (error) => {
              console.error('Error uploading file:', error);
            },
            () => {
              console.log('Upload successful!');
            }
          );
  
          // Add progress monitoring and error handling for uploadTask
        }
      } catch (error) {
        console.error('Error exporting or uploading file:', error);
        // Add more specific error handling if needed
      }
    }, options);
  };
  



  const handlePageChange = (pageNumber) => {
    setSlide(pageNumber);
  };

  const handleARClick = () => {
    if (store.enterAR) {
      store.enterAR();
    } else {
      console.error('store.enterAR is not defined');
    }
  };
  
  const handleVRClick = () => {
    if (store.enterVR) {
      store.enterVR();
    } else {
      console.error('store.enterVR is not defined');
    }
  };
  

  return (
    <div className={`overlay ${visible ? 'visible' : 'invisible'}`}>
      <>
        <div className="nav-bar">
          <div className="hamburger-menu" onClick={() => setShowMenu(!showMenu)}>
            &#9776;
          </div>
          <h1 className='logo'>bluCrystal</h1>
          <div className={`navbar-links ${showMenu ? 'active' : ''}`}>
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

          <div className="vr-ar-buttons">
            <button className='buttons' onClick={handleARClick}>Enter AR</button>
            <button className='buttons' onClick={handleVRClick}>Enter VR</button>
          </div>
          </div>
        </div>
        
        
      </>
    </div>
  );
};