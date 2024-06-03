import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css'; // Import App.css here
import {Stats} from '@react-three/drei'

function Model() {
  const gltf = useLoader(GLTFLoader, '/free_1975_porsche_911_930_turbo.glb');
  return <primitive object={gltf.scene} />;
}
export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-8, 5, 8] }}>
      <ambientLight intensity={10}  />
        <directionalLight color="white" intensity={19} position={[4, 1, 1]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
        <Stats/>
      </Canvas>
    </>
  );
}