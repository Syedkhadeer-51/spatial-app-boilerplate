import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Stats } from '@react-three/drei';
import FileUploader from './components/FileUpload';
import ModelViewer from './components/ModelViewer';
import CompressionButton from './components/CompressionButton';
import './App.css';

export default function App() {
  const modelRef = useRef();
  const [modelUrl, setModelUrl] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const scale = [0.2, 0.2, 0.2]; // set scale

  const handleFileUpload = (file) => {
    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setOriginalSize(file.size);
  };

  const handleModelLoaded = (loadedModel) => {
    modelRef.current = loadedModel;
    setModelLoaded(true);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h2>3D-Model Viewer and Compressor</h2>
        <FileUploader onFileUpload={handleFileUpload} />
        {modelUrl && (
          <Canvas camera={{ position: [-8, 3, 8] }}>
            <ambientLight intensity={2.5} />
            <directionalLight color={"yellow"} position={[0, 0, 5]} />
            <Center>
              <ModelViewer modelUrl={modelUrl} scale={scale} onModelLoaded={handleModelLoaded} />
            </Center>
            <OrbitControls />
            <Stats />
          </Canvas>
        )}
        <CompressionButton modelRef={modelRef} modelLoaded={modelLoaded} originalSize={originalSize} />
      </div>
    </div>
  );
}