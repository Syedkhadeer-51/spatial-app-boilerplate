import React from 'react';

function ImportContainer({ onImport }) {
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="import-container">
      <input type="file" accept=".glb, .gltf" onChange={handleImport} />
    </div>
  );
}

export default ImportContainer;
