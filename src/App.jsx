import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper, HemisphereLightHelper } from 'three';
import { ChromePicker } from 'react-color';
import './App.css';

function Model({ castShadow }) {
  const gltf = useLoader(GLTFLoader, '/2018__audi_e-tron_vision_gran_turismo.glb');

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
  const [shadowQuality, setShadowQuality] = useState('sharp'); 
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
  );
}