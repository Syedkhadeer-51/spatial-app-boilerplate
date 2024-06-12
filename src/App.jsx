import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Scene from './components/Scene';
import ImportContainer from './components/ImportContainer';
import { importModel } from './functions/Import';
import { exportModel } from './functions/Export';
import { mergeMeshes } from './functions/Merge';
import './App.css';

export default function App() {
  const sceneRef = useRef();
  const [mergeMessage, setMergeMessage] = useState(null);

  const handleMeshMerge = () => {
    const scene = sceneRef.current;
    const geometries = [];

    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        geometries.push(child.geometry);
      }
    });

    if (geometries.length === 0) {
      setMergeMessage({ message: 'No geometries found in the model', color: 'red' });
      return;
    }

    try {
      mergeMeshes(geometries, scene);
      setMergeMessage({ message: 'Mesh merging successful! :)', color: 'green' });
    } catch (error) {
      console.error('Mesh merging failed:', error);
      setMergeMessage({ message: 'Mesh merging unavailable for this model :(', color: 'red' });
    }

    setTimeout(() => {
      setMergeMessage(null);
    }, 3000);
  };

  const handleExport = () => {
    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true
    };
    exportModel(sceneRef.current, options);
  };

  const handleImport = (file) => {
    importModel(file, (importedScene) => {
      sceneRef.current.clear();
      sceneRef.current.add(importedScene);
    });
  };

  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <directionalLight intensity={7.0} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Scene sceneRef={sceneRef} />
        <Stats />
      </Canvas>
      <h2>Model Compressor</h2>
      <div className="bottom-right-panel">
        <div className="button-group">
          <button className="panel-button" onClick={handleMeshMerge}>Merge All Meshes</button>
          <button className="panel-button" onClick={handleExport}>Compress and Export</button>
        </div>
      </div>

      {mergeMessage && (
        <div className="merge-message" style={{ backgroundColor: mergeMessage.color }}>
          <p>{mergeMessage.message}</p>
        </div>
      )}

      <ImportContainer onImport={handleImport} />
    </div>
  );
}
