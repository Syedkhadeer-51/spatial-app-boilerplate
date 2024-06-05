import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css';

function Model({ castShadow }) {
  const gltf = useLoader(GLTFLoader, '/sample/audi.glb');

  // Traversing the loaded model to set castShadow for meshes
  gltf.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = castShadow;
  });

  return <primitive object={gltf.scene} />;
}

function Stage({ receiveShadow }) {
  return (
    <mesh position={[0, -0.245, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow={receiveShadow}>
      <cylinderGeometry args={[2.75, 2.75, 0.1, 60]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function Cube({ castShadow }) {
  return (
    <mesh position={[2, 0, 1.5]} castShadow={castShadow}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

function Lights({ lightSettings }) {
  return (
    <>
      {lightSettings.type === 'ambient' && (
        <ambientLight color={lightSettings.color} intensity={lightSettings.intensity} />
      )}
      {lightSettings.type === 'directional' && (
        <directionalLight
          color={lightSettings.color}
          intensity={lightSettings.intensity}
          position={[3, 1, 1]}
          castShadow={lightSettings.castShadow}
          shadow-mapSize-width={lightSettings.shadowQuality}
          shadow-mapSize-height={lightSettings.shadowQuality}
        />
      )}
      {lightSettings.type === 'point' && (
        <pointLight
          color={lightSettings.color}
          intensity={lightSettings.intensity}
          position={[2, 1, 1.5]}
          castShadow={lightSettings.castShadow}
          shadow-mapSize-width={lightSettings.shadowQuality}
          shadow-mapSize-height={lightSettings.shadowQuality}
        />
      )}
      {lightSettings.type === 'spot' && (
        <spotLight
          color={lightSettings.color}
          intensity={lightSettings.intensity}
          position={[0, 10, 0]}
          angle={0.45}
          penumbra={1}
          castShadow={lightSettings.castShadow}
          shadow-mapSize-width={lightSettings.shadowQuality}
          shadow-mapSize-height={lightSettings.shadowQuality}
        />
      )}
      {lightSettings.type === 'hemisphere' && (
        <hemisphereLight skyColor={lightSettings.color} groundColor="green" intensity={lightSettings.intensity} />
      )}
    </>
  );
}

export default function App() {
  const defaultLightSettings = {
    type: 'spot',
    color: '#ffffff',
    intensity: 1,
    castShadow: true,
    shadowQuality: 1024,
  };

  const defaultExposureSettings = {
    enabled: true,
    intensity: 1,
  };

  const [lightSettings, setLightSettings] = useState(() => {
    const savedSettings = localStorage.getItem('lightSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultLightSettings;
  });

  const [exposureSettings, setExposureSettings] = useState(() => {
    const savedExposure = localStorage.getItem('exposureSettings');
    return savedExposure ? JSON.parse(savedExposure) : defaultExposureSettings;
  });

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    localStorage.setItem('lightSettings', JSON.stringify(lightSettings));
  }, [lightSettings]);

  useEffect(() => {
    localStorage.setItem('exposureSettings', JSON.stringify(exposureSettings));
  }, [exposureSettings]);

  const updateSettings = (newLightSettings, newExposureSettings) => {
    setUndoStack((prev) => [
      ...prev,
      { lightSettings, exposureSettings }
    ]);
    setRedoStack([]);

    setLightSettings(newLightSettings);
    setExposureSettings(newExposureSettings);
  };

  const handleLightTypeChange = (e) => {
    updateSettings(
      { ...lightSettings, type: e.target.value },
      exposureSettings
    );
  };

  const handleColorChange = (e) => {
    updateSettings(
      { ...lightSettings, color: e.target.value },
      exposureSettings
    );
  };

  const handleIntensityChange = (e) => {
    updateSettings(
      { ...lightSettings, intensity: parseFloat(e.target.value) },
      exposureSettings
    );
  };

  const handleExposureToggle = (e) => {
    updateSettings(
      lightSettings,
      { ...exposureSettings, enabled: e.target.checked }
    );
  };

  const handleExposureIntensityChange = (e) => {
    updateSettings(
      lightSettings,
      { ...exposureSettings, intensity: parseFloat(e.target.value) }
    );
  };

  const handleShadowToggle = (e) => {
    updateSettings(
      { ...lightSettings, castShadow: e.target.checked },
      exposureSettings
    );
  };

  const handleShadowQualityChange = (e) => {
    updateSettings(
      { ...lightSettings, shadowQuality: parseInt(e.target.value) },
      exposureSettings
    );
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      { lightSettings, exposureSettings }
    ]);

    setLightSettings(previousState.lightSettings);
    setExposureSettings(previousState.exposureSettings);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack((prev) => [
      ...prev,
      { lightSettings, exposureSettings }
    ]);

    setLightSettings(nextState.lightSettings);
    setExposureSettings(nextState.exposureSettings);
  };

  return (
    <>
      <div className="controls">
        <div>
          <label>Light Type:</label>
          <select value={lightSettings.type} onChange={handleLightTypeChange}>
            <option value="ambient">Ambient Light</option>
            <option value="directional">Directional Light</option>
            <option value="point">Point Light</option>
            <option value="spot">Spot Light</option>
            <option value="hemisphere">Hemisphere Light</option>
          </select>
        </div>
        <div>
          <label>Color:</label>
          <input type="color" value={lightSettings.color} onChange={handleColorChange} />
        </div>
        <div>
          <label>Intensity:</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={lightSettings.intensity}
            onChange={handleIntensityChange}
          />
        </div>
        <div>
          <label>Exposure:</label>
          <input
            type="checkbox"
            checked={exposureSettings.enabled}
            onChange={handleExposureToggle}
          />
        </div>
        <div>
          <label>Exposure Intensity:</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={exposureSettings.intensity}
            onChange={handleExposureIntensityChange}
            disabled={!exposureSettings.enabled}
          />
        </div>
        <div>
          <label>Shadows:</label>
          <input
            type="checkbox"
            checked={lightSettings.castShadow}
            onChange={handleShadowToggle}
          />
        </div>
        <div>
          <label>Shadow Quality:</label>
          <select value={lightSettings.shadowQuality} onChange={handleShadowQualityChange}>
            <option value={256}>Sharp</option>
            <option value={512}>Soft</option>
          </select>
        </div>
        <button onClick={handleUndo} disabled={undoStack.length === 0}>Undo</button>
        <button onClick={handleRedo} disabled={redoStack.length === 0}>Redo</button>
      </div>
      <Canvas
        camera={{ position: [-8, 8, 8] }}
        shadows={lightSettings.castShadow}
        gl={{ toneMappingExposure: exposureSettings.enabled ? exposureSettings.intensity : 1 }}
      >
        <Lights lightSettings={lightSettings} />
        <Suspense fallback={null}>
          <Model castShadow={lightSettings.castShadow} />
          <Stage receiveShadow={lightSettings.castShadow} />
          <Cube castShadow={lightSettings.castShadow} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
}
