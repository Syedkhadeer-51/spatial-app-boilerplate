//app.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Lights from './components/Lights';
import Model from './components/model';
import Stage from './components/stage';
import LightControls from './components/LightControls';
import CloudContainer from './components/cloudcontainer';
import CloudExportContainer from './components/cloudexportcontainer';
import ImportContainer from './components/importcontainer';
import * as THREE from 'three'; // Import Three.js to create geometries

import './App.css';

const App = () => {
  const [lights, setLights] = useState([]);
  const [expandedLightId, setExpandedLightId] = useState(null);
  const [globalShadows, setGlobalShadows] = useState(true);
  const [globalExposure, setGlobalExposure] = useState(1);
  const sceneRef = useRef(null); // Ref for the 3D scene

  useEffect(() => {
    console.log("Lights:", lights);
  }, [lights]);

  const addLight = (type) => {
    const newLight = {
      id: lights.length,
      type: type,
      color: '#ffffff',
      intensity: 1,
      position: [0, 5, 0],
      exposure: 1,
      shadows: true,
      shadowIntensity: 1,
      ...(type === 'spot' && { angle: Math.PI / 4, penumbra: 0.1, distance: 10 }),
      ...(type === 'point' && { distance: 10 })
    };
    setLights([...lights, newLight]);
  };

  const updateLight = (id, property, value) => {
    const updatedLights = lights.map(light =>
      light.id === id ? { ...light, [property]: value } : light
    );
    setLights(updatedLights);
  };

  const deleteLight = (id) => {
    setLights(lights.filter(light => light.id !== id));
  };

  const resetLights = () => {
    setLights([]);
  };

  const toggleGlobalShadows = () => {
    const newGlobalShadows = !globalShadows;
    setGlobalShadows(newGlobalShadows);
    const updatedLights = lights.map(light => ({
      ...light,
      shadows: newGlobalShadows,
    }));
    setLights(updatedLights);
  };

  const updateGlobalExposure = (value) => {
    setGlobalExposure(value);
    const updatedLights = lights.map(light => ({
      ...light,
      exposure: value,
    }));
    setLights(updatedLights);
  };

  const handleImportFromLocal = (scene) => {
    // Handle import from local storage here
    // Example: setLights based on imported scene
    console.log('Imported scene from local:', scene);
  };

  const handleImportFromCloud = (scene) => {
    // Handle import from cloud (CloudContainer)
    // Example: setLights based on imported scene
    console.log('Imported scene from cloud:', scene);
  };

  return (
    <div id="root">
      <div className="canvas-container">
        <Canvas shadows={globalShadows} camera={{ position: [-8, 8, 8] }} ref={sceneRef}>
          <ambientLight intensity={0.5} />
          <Lights lights={lights} expandedLightId={expandedLightId} globalExposure={globalExposure} />
          <Model />
          <Stage />
          <OrbitControls />
          <Stats />
          {/* Neutral background */}
          <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial color={0xf0f0f0} />
          </mesh>
        </Canvas>
      </div>
      <div className="controls-container">
        <div className="controls-container-draggable">
        <LightControls 
          lights={lights} 
          updateLight={updateLight} 
          setExpandedLight={setExpandedLightId}
          addLight={addLight}
          deleteLight={deleteLight}
          resetLights={resetLights}
          toggleGlobalShadows={toggleGlobalShadows}
          globalShadows={globalShadows}
          globalExposure={globalExposure}
          updateGlobalExposure={updateGlobalExposure}
        />
        </div>
        <CloudContainer onImport={handleImportFromCloud} />
        <CloudExportContainer sceneRef={sceneRef} />
        <ImportContainer onImport={handleImportFromLocal} />
      </div>
    </div>
  );
};

export default App;
