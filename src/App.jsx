import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './scene';
import { importModel } from './Import';
import './App.css';


export default function App() {
  const [importedScenes, setImportedScenes] = useState([]);

  const handleImport = (file) => {
    importModel(file, (importedScene) => {
      setImportedScenes(prevScenes => [...prevScenes, importedScene]);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };
  const handlesearch = () => {
    const searchInput = document.querySelector('input[type="text"]');
    const search = searchInput.value.trim();
    console.log("Search value:", search);
  };
  
  return (
    <div className='scene'>
      <div className='sidebar' id='sidebar'>
        <div className='searchbar' id='searchbar'>
        </div>
        <div className='hierarchy' id='hierarchy'>
        </div>
      </div>

      <div className='viewport'>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".glb, .gltf"
        />
        <Canvas camera={{ position: [2, 2, 2] }}>
          <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          {importedScenes.map((scene, index) => (
            <Scene key={index} importedScene={scene} />
          ))}
          <OrbitControls />
        </Canvas>
        <div className='accessbar' id='accessbar'>
        </div>  
      </div>
    </div>
  );
}
