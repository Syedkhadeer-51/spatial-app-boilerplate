import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { saveAs } from 'file-saver';
import Model from './components/Model';
import UploadButton from './components/UploadButton';
import CompressButton from './components/CompressButton';
import ExportButton from './components/ExportButton';
import Message from './components/Message';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = (url) => {
    setFile(url);
    setMessage('File uploaded successfully!');
  };

  const handleCompress = (compressedUrl) => {
    setCompressedFile(compressedUrl);
    setMessage('Compression successful!');
  };

  const handleExport = () => {
    if (compressedFile) {
      saveAs(compressedFile, 'compressed_model.glb');
      setMessage('Export successful!');
    } else {
      setError('No compressed file available for export');
    }
  };

  return (
    <div className="App">
      <h1>3D Model Viewer</h1>
      <UploadButton onUpload={handleUpload} setMessage={setMessage} setError={setError} />
      <CompressButton file={file} onCompress={handleCompress} setMessage={setMessage} setError={setError} />
      <ExportButton onExport={handleExport} />
      <Message message={message} error={error} />
      <div className="canvas-container">
        <Canvas style={{ height: 600 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {file && <Model file={file} />}
        </Canvas>
      </div>
    </div>
  );
}

export default App;
