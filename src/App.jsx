import React, { useEffect, useState, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls, Stats } from "@react-three/drei";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';
import "./App.css";

async function compressAndExportGLTF(gltf, fileName) {
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    dracoOptions: {
      compressionLevel: 10
    }
  };

  return new Promise((resolve, reject) => {
    exporter.parse(gltf.scene, (result) => {
      const blob = new Blob([result], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
      resolve(blob);
    }, (error) => {
      console.error('Error during GLTF export', error);
      reject(error);
    }, options);
  });
}

function Scene({ onModelLoaded }) {
  const path = "summer_house_ruin.glb"; 
  const gltf = useLoader(GLTFLoader, path, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });

  useEffect(() => {
    if (gltf) {
      onModelLoaded(gltf);
    }
  }, [gltf, onModelLoaded]);

  return <primitive object={gltf.scene} />;
}

export default function App() {
  const [originalSize, setOriginalSize] = useState(null);
  const modelLoadedRef = useRef(false);
  const [originalModelName, setOriginalModelName] = useState("");

  useEffect(() => {
    const originalPath = "summer_house_ruin.glb"; 

    fetch(originalPath)
      .then(response => response.blob())
      .then(blob => {
        setOriginalSize(blob.size);
        const originalName = getFileNameFromPath(originalPath);
        setOriginalModelName(originalName);
        console.log("Original Model Size (bytes): ", blob.size);
      })
      .catch(error => {
        console.error(`Error fetching the model from ${originalPath}:`, error);
      });
  }, []);

  const handleModelLoaded = async (gltf) => {
    if (modelLoadedRef.current || originalSize === null) {
      return;
    }
    console.log('Draco Compression ...')
    modelLoadedRef.current = true;
    try {
      const originalPath = "summer_house_ruin.glb"; 
      const originalName = getFileNameFromPath(originalPath);
      const compressedFileName = `${originalName.split('.glb')[0]}_compressed.glb`;
      const compressedBlob = await compressAndExportGLTF(gltf, compressedFileName);
  
      console.log("Size of Compressed Model (bytes): ", compressedBlob.size);
  
      const compressionRatio = (originalSize / compressedBlob.size).toFixed(3);
      const percentageReduction = ((1 - (compressedBlob.size / originalSize)) * 100).toFixed(2);
  
      console.log("Compression Ratio: ", compressionRatio);
      console.log("Percentage Reduction: ", percentageReduction + "%");

    } catch (error) {
      console.error("Error during compression and export:", error);
    }
  };
  
  const getFileNameFromPath = (filePath) => {
    const pathArray = filePath.split("/");
    const fileName = pathArray[pathArray.length - 1];
    return fileName;
  };

  return (
    <div className="app-container">
      <Canvas style={{ background: "#171717" }}>
        <OrbitControls />
        <ambientLight intensity={5.0} />
        <directionalLight intensity={10.0} />
        <Scene onModelLoaded={handleModelLoaded} />
        <Stats /> 
      </Canvas>
    </div>
  );
}
