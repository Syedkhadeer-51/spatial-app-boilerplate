import "./App.css";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { OrbitControls } from "@react-three/drei";
import { Stats } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

function Scene() {
  const path = "/sold.glb"
  const gltf = useLoader(GLTFLoader, path, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    loader.setDRACOLoader(dracoLoader)
  })
  return <primitive object={gltf.scene} />
}

export default function App() {
  return(
    
    <Canvas style={{ background: "#FFC0CB" }}>
      <OrbitControls> </OrbitControls>
      <ambientLight />  
      <Scene />
      <Stats />
    </Canvas>
)};
