import { Canvas } from '@react-three/fiber'
import './App.css'
import { OrbitControls } from '@react-three/drei'


export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-8, 5, 8] }}>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh scale={3}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <OrbitControls />
      </Canvas>
    </>
  )
}