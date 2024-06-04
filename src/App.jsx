import React from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef } from 'react';
import { Stats } from '@react-three/drei'

// Component to load the GLB file
const Model = () => {
  const glb = useLoader(GLTFLoader, '/sample/skibidi.glb');
  const ref = useRef();

  return <primitive ref={ref} object={glb.scene} scale={[3, 3, 3]} />;
};
//comment
export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-8, 3, 8] }}>
        <ambientLight intensity={9.5} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <Model />
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
}

