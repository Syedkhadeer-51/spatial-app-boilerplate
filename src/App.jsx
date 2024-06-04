import React, { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css';

function Model({ castShadow }) {
  const gltf = useLoader(GLTFLoader, '/2018__audi_e-tron_vision_gran_turismo.glb');

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

function Lights({ activeLights, castShadow }) {
  return (
    <>
      {activeLights.ambient && <ambientLight intensity={0.5} />}
      {activeLights.directional && (
        <directionalLight color="white" intensity={1} position={[3, 1, 1]} castShadow={castShadow} />
      )}
      {activeLights.point && <pointLight color="white" intensity={0.5} position={[2, 1, 1.5]} castShadow={castShadow} />}
      {activeLights.spot && (
        <spotLight color="white" intensity={50} position={[0, 10, 0]} angle={0.45} penumbra={1} castShadow={castShadow} />
      )}
      {activeLights.hemisphere && <hemisphereLight skyColor="blue" groundColor="green" intensity={0.5} />}
    </>
  );
}

export default function App() {
  const [activeLights, setActiveLights] = useState({
    ambient: false,
    directional: false,
    point: false,
    spot: true,
    hemisphere: false,
  });

  const [shadowsEnabled, setShadowsEnabled] = useState(true);

  const toggleLight = (light) => {
    setActiveLights((prevLights) => ({
      ...prevLights,
      [light]: !prevLights[light],
    }));
  };

  const toggleShadows = () => {
    setShadowsEnabled((prevShadows) => !prevShadows);
  };

  return (
    <>
      <div className="controls">
        <button onClick={() => toggleLight('ambient')}>Toggle Ambient Light</button>
        <button onClick={() => toggleLight('directional')}>Toggle Directional Light</button>
        <button onClick={() => toggleLight('point')}>Toggle Point Light</button>
        <button onClick={() => toggleLight('spot')}>Toggle Spot Light</button>
        <button onClick={() => toggleLight('hemisphere')}>Toggle Hemisphere Light</button>
        <button onClick={toggleShadows}>
          {shadowsEnabled ? 'Disable Shadows' : 'Enable Shadows'}
        </button>
      </div>
      <Canvas camera={{ position: [-8, 8, 8] }} shadows={shadowsEnabled}>
        <Lights activeLights={activeLights} castShadow={shadowsEnabled} />
        <Suspense fallback={null}>
          <Model castShadow={shadowsEnabled} />
          <Stage receiveShadow={shadowsEnabled} />
          <Cube castShadow={shadowsEnabled} />
        </Suspense>
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
}
