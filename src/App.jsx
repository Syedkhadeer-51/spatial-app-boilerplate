
import React from "react";
import { Canvas } from "@react-three/fiber" 
import * as THREE from 'three';
import "./App.css";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useRef } from 'react'
import { DragControls } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Stats } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { positionGeometry } from "three/examples/jsm/nodes/Nodes.js";

function Scene() {
  
  const path1 = "/brick_arcs_barn_ruin-transformed.glb"
  const path2 = "/brick_arcs_barn_ruin.glb"
  const comp="compressed"
  const ncomp="not compressed"
  handleExport(path2,ncomp);
  handleExport(path1,comp);
  const gltf = useLoader(GLTFLoader,path1, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    loader.setDRACOLoader(dracoLoader)
  })
  return <primitive object={gltf.scene} />
}



export default function App() {
  return(
    
    <Canvas style={{ background: "#dddddd" }} >
      <OrbitControls> </OrbitControls>
      <ambientLight /> 
      <pointLight position={[0,10,0]}></pointLight> 
      <Scene />
      <Stats />
      <DragControls />
    </Canvas>
)};

const handleExport = (glbModelUrl,comp) => {
  fetch(glbModelUrl)
      .then(response => response.blob())
      .then(blob => {
          // GLB model as a Blob
          console.log("Size of",comp ,"GLB model:", blob.size, "bytes");
        
      })
      .catch(error => {
          console.error('Error fetching GLB model:', error);
        });
};