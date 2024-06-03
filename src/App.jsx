// import React from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef } from 'react';
import { Stats } from '@react-three/drei'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Component to load the GLB file
const Model = () => {
  const glb = useLoader(GLTFLoader, '/mikudayo.glb');
  const ref = useRef();

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(dracoLoader)

  return <primitive ref={ref} object={glb.scene} scale={[0.2, 0.2, 0.2]} />;
};


export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-8, 3, 8] }}>
        <ambientLight intensity={2.5} />
        {/* <directionalLight color="white" position={[0, 0, 5]} /> */}
        <Model />
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
}