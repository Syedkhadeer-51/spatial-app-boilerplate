import React from 'react';

function UploadButton({ onUpload, setMessage, setError }) {
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
      setMessage('File uploaded successfully!');
    } else {
      setError('File upload failed');
    }
  };

  return <input type="file" accept=".glb, .gltf" onChange={handleUpload} />;
}

export default UploadButton;
