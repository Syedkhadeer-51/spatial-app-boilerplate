//final
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import FileUploader from './components/FileUploader';
import ModelViewer from './components/ModelViewer';
import ExportToLocalButton from './components/CompressExportButton';
import AnimatedText from './components/AnimatedText';
import ExportToFirebaseButton from './components/ExportToFirebaseButton';
import { handleExportText } from './components/TextExporter';
import './App.css';

export default function App() {
  const modelRef = useRef();
  const [modelUrl, setModelUrl] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState("hello");
  const [fontSize, setFontSize] = useState(1);
  const [fontColor, setFontColor] = useState("#6495ED");
  const [selectedFont, setSelectedFont] = useState("gentilis_regular");
  const [transparency, setTransparency] = useState(1);
  const [scale, setScale] = useState([1, 1, 1]);
  const [animationType, setAnimationType] = useState("none");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0, z: 0 });
  const [speedFactor, setSpeedFactor] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');

  const scaleModel = [0.2, 0.2, 0.2];

  const handleFileUploaded = (url) => {
    setModelUrl(url);
    setModelLoaded(true);
  };

  const exportTextToLocal = () => {
    handleExportText({
      text,
      font: selectedFont,
      size: fontSize,
      color: fontColor,
      transparency,
      scale,
      position,
      exportToLocal: true,
      exportToFirebase: false,
    });
  };

  const exportTextToFirebase = () => {
    handleExportText({
      text,
      font: selectedFont,
      size: fontSize,
      color: fontColor,
      transparency,
      scale,
      position,
      exportToLocal: false,
      exportToFirebase: true,
      setUploadProgress,
      onComplete: (url) => setDownloadURL(url),
    });
  };

  useEffect(() => {
    setCurrentPosition(position);
  }, [animationType, position]);

  return (
    // <div className="app-wrapper">
    //   <h2>3D-Model Viewer and Compressor</h2>
      <div className="app-container">
        <div className="controls">
          <FileUploader onFileUploaded={handleFileUploaded} />
          <div>
            <button onClick={() => setShowText(true)}>Add 3D Text</button>
          </div>
          {showText && (
            <>
              <div>
                <label>Text: </label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" />
              </div>
              <div>
                <label>Font Size: </label>
                <input type="number" min={0} max={2} step={0.2} value={fontSize} onChange={(e) => setFontSize(parseFloat(e.target.value))} />
              </div>
              <div>
                <label>Font Color: </label>
                <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
              </div>
              <div>
                <label>Text Transparency: </label>
                <input type="range" min={0} max={1} step={0.1} value={transparency} onChange={(e) => setTransparency(parseFloat(e.target.value))} />
              </div>
              <div>
                <label>Text Scaling: </label>
                <input type="number" min={0.1} max={2} step={0.1} value={scale[0]} onChange={(e) => setScale([parseFloat(e.target.value), parseFloat(e.target.value), parseFloat(e.target.value)])} placeholder="Scale" />
              </div>
              <div>
                <label>Position X: </label>
                <input type="number" value={position.x} onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label>Position Y: </label>
                <input type="number" value={position.y} onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label>Position Z: </label>
                <input type="number" value={position.z} onChange={(e) => setPosition({ ...position, z: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label>Font: </label>
                <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                  <option value="gentilis_regular">Gentilis Regular</option>
                  <option value="helvetiker_regular">Helvetiker Regular</option>
                  <option value="optimer_regular">Optimer Regular</option>
                  <option value="dancingScript_regular">Dancing Script Regular</option>
                </select>
              </div>
              <div>
                <label>Animation: </label>
                <select value={animationType} onChange={(e) => setAnimationType(e.target.value)}>
                  <option value="none">None</option>
                  <option value="bounce">Bounce</option>
                  <option value="spin">Spin</option>
                </select>
              </div>
              <div>
                <label>Speed Factor: </label>
                <input type="number" min={0.1} max={10} step={0.1} value={speedFactor} onChange={(e) => setSpeedFactor(parseFloat(e.target.value))} />
              </div>
              <div>
                <button onClick={exportTextToLocal}>Export Text to Local</button>
                <button onClick={exportTextToFirebase}>Export Text to Firebase</button>
                {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}
              </div>
            </>
          )}
          <ExportToLocalButton modelRef={modelRef} modelLoaded={modelLoaded} />
          <ExportToFirebaseButton modelRef={modelRef} modelLoaded={modelLoaded} />
        </div>
        <div className="viewer canvas-wrapper">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            <Center>
              {modelUrl && (
                <ModelViewer
                  modelUrl={modelUrl}
                  scale={scaleModel}
                  onModelLoaded={(gltf) => {
                    modelRef.current = gltf;
                    setModelLoaded(true);
                  }}
                />
              )}
              {showText && (
                <AnimatedText
                  text={text}
                  fontSize={fontSize}
                  fontColor={fontColor}
                  selectedFont={selectedFont}
                  transparency={transparency}
                  scale={scale}
                  animationType={animationType}
                  position={currentPosition}
                  speedFactor={speedFactor}
                />
              )}
            </Center>
          </Canvas>
        </div>
      </div>
    // </div>
  );
}