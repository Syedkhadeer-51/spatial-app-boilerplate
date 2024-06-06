
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
  
  const path1 = "/mutant_mantis_2.0.glb"
   const path2 = "/mutant_mantis_2.0-transformed.glb"
  handleExport(path1);
  handleExport(path2);
  const gltf = useLoader(GLTFLoader,path1, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    loader.setDRACOLoader(dracoLoader)
  })
  return <primitive object={gltf.scene} />
}



export default function App() {
  //const Cam = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
  //Cam.position.set([0,0,0])
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

const handleExport = (glbModelUrl) => {
  // Assuming you already have the URL or ArrayBuffer of the GLB model
 // Change this to the actual URL or ArrayBuffer of your GLB model

  // Fetch the GLB model
  fetch(glbModelUrl)
      .then(response => response.blob())
      .then(blob => {
          // Now you have the GLB model as a Blob
          // Log the size of the blob
          console.log("Size of GLB model:", blob.size, "bytes");
        
      })
      .catch(error => {
          console.error('Error fetching GLB model:', error);
        });
};