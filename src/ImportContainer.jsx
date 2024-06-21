// ImportContainer.jsx
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ImportContainer({ onImport }) {
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const loader = new GLTFLoader();
        loader.parse(contents, '', (gltf) => {
          onImport(gltf.scene);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="import-container">
      <label htmlFor="file-select">Import a file from local storage:</label>
      <input type="file" accept=".glb, .gltf" onChange={handleImport}  />
    </div>
  );
}

export default ImportContainer;