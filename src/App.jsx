
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper, HemisphereLightHelper } from 'three';
import { ChromePicker } from 'react-color';

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


function Lights({
  lightType, lightColor, castShadow, ambientLightColor, hemisphereLightColors,
  activeLights, lightIntensity, ambientLightIntensity, hemisphereLightIntensity,
  shadowQuality
}) {
  const lightRef = useRef();
  const hemisphereLightRef = useRef();

  useEffect(() => {
    if (lightRef.current) {
      let helper;
      if (lightType === 'directional') {
        helper = new DirectionalLightHelper(lightRef.current, 5, 0xff0000); // Red color
      } else if (lightType === 'point') {
        helper = new PointLightHelper(lightRef.current, 1, 0x00ff00); // Green color
      } else if (lightType === 'spot') {
        helper = new SpotLightHelper(lightRef.current, 0x0000ff); // Blue color
      }
      if (helper) {
        lightRef.current.add(helper);
      }
    }

    if (hemisphereLightRef.current) {
      const helper = new HemisphereLightHelper(hemisphereLightRef.current, 5);
      hemisphereLightRef.current.add(helper);
    }
  }, [lightType, activeLights]);


  return <primitive ref={ref} object={glb.scene} scale={[3, 3, 3]} />;
};
//comment
export default function App() {

  return (
    <>
      {activeLights.ambient && <ambientLight color={ambientLightColor} intensity={ambientLightIntensity} />}
      {lightType === 'directional' && (
        <directionalLight
          ref={lightRef}
          color={lightColor}
          intensity={lightIntensity}
          position={[3, 1, 1]}
          castShadow={castShadow}
          shadowBias={shadowQuality === 'sharp' ? -0.001 : -0.01}
          shadow-mapSize-width={shadowQuality === 'sharp' ? 2048 : 1024}
          shadow-mapSize-height={shadowQuality === 'sharp' ? 2048 : 1024}
        />
      )}
      {lightType === 'point' && (
        <pointLight
          ref={lightRef}
          color={lightColor}
          intensity={lightIntensity}
          position={[2, 1, 1.5]}
          castShadow={castShadow}
          shadowBias={shadowQuality === 'sharp' ? -0.001 : -0.01}
          shadow-mapSize-width={shadowQuality === 'sharp' ? 2048 : 1024}
          shadow-mapSize-height={shadowQuality === 'sharp' ? 2048 : 1024}
        />
      )}
      {lightType === 'spot' && (
        <spotLight
          ref={lightRef}
          color={lightColor}
          intensity={100 * lightIntensity}
          position={[0, 5, 0]}
          angle={0.6}
          penumbra={shadowQuality === 'soft' ? 0.8 : 1}
          distance={6}
          castShadow={castShadow}
          shadowBias={shadowQuality === 'sharp' ? -0.001 : -0.01}
          shadow-mapSize-width={shadowQuality === 'sharp' ? 2048 : 1024}
          shadow-mapSize-height={shadowQuality === 'sharp' ? 2048 : 1024}
        />
      )}
      {activeLights.hemisphere && (
        <hemisphereLight
          ref={hemisphereLightRef}
          skyColor={hemisphereLightColors.sky}
          groundColor={hemisphereLightColors.ground}
          intensity={hemisphereLightIntensity}
        />

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

  const [lightType, setLightType] = useState('spot');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [lightIntensity, setLightIntensity] = useState(1);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff');
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5);
  const [hemisphereLightColors, setHemisphereLightColors] = useState({
    sky: '#0000ff',
    ground: '#00ff00'
  });
  const [hemisphereLightIntensity, setHemisphereLightIntensity] = useState(0.5);
  const [activeLights, setActiveLights] = useState({
    ambient: false,
    hemisphere: false,
  });
  const [shadowQuality, setShadowQuality] = useState('sharp'); // 'sharp' or 'soft'
  const [exposureEnabled, setExposureEnabled] = useState(true);
  const [exposureIntensity, setExposureIntensity] = useState(1);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setLightType(settings.lightType);
      setLightColor(settings.lightColor);
      setLightIntensity(settings.lightIntensity);
      setShadowsEnabled(settings.shadowsEnabled);
      setAmbientLightColor(settings.ambientLightColor);
      setAmbientLightIntensity(settings.ambientLightIntensity);
      setHemisphereLightColors(settings.hemisphereLightColors);
      setHemisphereLightIntensity(settings.hemisphereLightIntensity);
      setActiveLights(settings.activeLights);
      setShadowQuality(settings.shadowQuality);
      setExposureEnabled(settings.exposureEnabled);
      setExposureIntensity(settings.exposureIntensity);
    }
  }, []);

  const saveSettingsToLocalStorage = () => {
    const settings = {
      lightType,
      lightColor,
      lightIntensity,
      shadowsEnabled,
      ambientLightColor,
      ambientLightIntensity,
      hemisphereLightColors,
      hemisphereLightIntensity,
      activeLights,
      shadowQuality,
      exposureEnabled,
      exposureIntensity,
    };
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  const handleLightTypeChange = (e) => {
    setLightType(e.target.value);
    saveSettingsToLocalStorage();
  };

  const toggleShadows = () => {
    setShadowsEnabled((prevShadows) => !prevShadows);
    saveSettingsToLocalStorage();
  };

  const toggleLight = (light) => {
    setActiveLights((prevLights) => ({
      ...prevLights,
      [light]: !prevLights[light],
    }));
    saveSettingsToLocalStorage();
  };

  const handleShadowQualityChange = (e) => {
    setShadowQuality(e.target.value);
    saveSettingsToLocalStorage();
  };

  const toggleExposure = () => {
    setExposureEnabled((prevExposure) => !prevExposure);
    saveSettingsToLocalStorage();
  };

  return (
    <div id="root">
      <div className="controls-container">
        <select value={lightType} onChange={handleLightTypeChange}>
          <option value="directional">Directional Light</option>
          <option value="point">Point Light</option>
          <option value="spot">Spot Light</option>
        </select>
        <ChromePicker
          color={lightColor}
          onChange={(color) => setLightColor(color.hex)}
        />
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={lightIntensity}
          onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
        />
        <button onClick={() => toggleLight('ambient')}>
          {activeLights.ambient ? 'Disable Ambient Light' : 'Enable Ambient Light'}
        </button>
        {activeLights.ambient && (
          <>
            <ChromePicker
              color={ambientLightColor}
              onChange={(color) => setAmbientLightColor(color.hex)}
            />
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={ambientLightIntensity}
              onChange={(e) => setAmbientLightIntensity(parseFloat(e.target.value))}
              disabled={!activeLights.ambient}
            />
          </>
        )}
        <button onClick={() => toggleLight('hemisphere')}>
          {activeLights.hemisphere ? 'Disable Hemisphere Light' : 'Enable Hemisphere Light'}
        </button>
        {activeLights.hemisphere && (
          <>
            <ChromePicker
              color={hemisphereLightColors.sky}
              onChange={(color) => setHemisphereLightColors((prevColors) => ({ ...prevColors, sky: color.hex }))}
            />
            <ChromePicker
              color={hemisphereLightColors.ground}
              onChange={(color) => setHemisphereLightColors((prevColors) => ({ ...prevColors, ground: color.hex }))}
            />
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={hemisphereLightIntensity}
              onChange={(e) => setHemisphereLightIntensity(parseFloat(e.target.value))}
              disabled={!activeLights.hemisphere}
            />
          </>
        )}
        <select value={shadowQuality} onChange={handleShadowQualityChange}>
          <option value="sharp">Sharp Shadows</option>
          <option value="soft">Soft Shadows</option>
        </select>
        <button onClick={toggleShadows}>
          {shadowsEnabled ? 'Disable Shadows' : 'Enable Shadows'}
        </button>
        <button onClick={toggleExposure}>
          {exposureEnabled ? 'Disable Exposure' : 'Enable Exposure'}
        </button>
        {exposureEnabled && (

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

            value={exposureIntensity}
            onChange={(e) => setExposureIntensity(parseFloat(e.target.value))}
          />
        )}
      </div>
      <div className="canvas-container">
        <Canvas
          camera={{ position: [-8, 8, 8] }}
          shadows={shadowsEnabled}
          gl={{ toneMappingExposure: exposureEnabled ? exposureIntensity : 1 }}
        >
          <Lights
            lightType={lightType}
            lightColor={lightColor}
            castShadow={shadowsEnabled}
            lightIntensity={lightIntensity}
            ambientLightColor={ambientLightColor}
            ambientLightIntensity={ambientLightIntensity}
            hemisphereLightColors={hemisphereLightColors}
            hemisphereLightIntensity={hemisphereLightIntensity}
            activeLights={activeLights}
            shadowQuality={shadowQuality}
          />
          <Suspense fallback={null}>
            <Model castShadow={shadowsEnabled} />
            <Stage receiveShadow={shadowsEnabled} />
            <Cube castShadow={shadowsEnabled} />
          </Suspense>
          <OrbitControls />
          <Stats />
        </Canvas>
      </div>
    </div>

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
