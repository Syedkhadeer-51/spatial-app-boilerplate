import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Stats } from '@react-three/drei';
import Model from './Model';
import './App.css'

export default function App() {
  const modelUrl = '/mikudayo.glb'; // Replace with the path of the model
  const setScale = [0.2, 0.2, 0.2]; // Set your desired scale here  
  return (
    <>
      <Canvas camera={{ position: [-8, 5, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[2, 2, 5]} />
        <Center>
          <Model url={modelUrl} scale={setScale} />
        </Center>
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
}