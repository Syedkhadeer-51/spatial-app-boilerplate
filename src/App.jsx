import React, { useEffect, useState, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls, Stats } from "@react-three/drei";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';
import "./App.css";

// Helper function to fetch file size
async function fetchFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      const size = response.headers.get('content-length');
      return parseInt(size, 10);
    } else {
      console.error(`Failed to fetch file size for ${url}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching file size for ${url}:`, error);
    return null;
  }
}

// Helper function to compress and export GLTF
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
      console.error('An error happened during GLTF export', error);
      reject(error);
    }, options);
  });
}

function Scene({ gltf }) {
  return gltf ? <primitive object={gltf.scene} /> : null;
}

export default function App() {
  const [gltf, setGltf] = useState(null);
  const [originalFileSize, setOriginalFileSize] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(null);
  const [compressionStatus, setCompressionStatus] = useState("");
  const inputFileRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const size = file.size;
      setOriginalFileSize(size);

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        url,
        (loadedGltf) => {
          setGltf(loadedGltf);
          setCompressionStatus("");
        },
        undefined,
        (error) => {
          console.error('Error loading the model:', error);
          setCompressionStatus("Error loading the model");
        }
      );
    }
  };

  const handleCompressAndExport = async () => {
    if (gltf) {
      setCompressionStatus("Compressing...");
      try {
        const compressedBlob = await compressAndExportGLTF(gltf, "model_compressed.glb");
        setCompressedFileSize(compressedBlob.size);
        setCompressionStatus("Compression and export successful!");
      } catch (error) {
        console.error("Error during compression and export:", error);
        setCompressionStatus("Error during compression and export");
      }
    }
  };

  return (
    <div className="app">
      <h1>3D Model Viewer and Compressor</h1>
      <input type="file" accept=".glb,.gltf" ref={inputFileRef} onChange={handleFileUpload} />
      <div className="file-info">
        {originalFileSize && <p>Original Model Size: {originalFileSize} bytes</p>}
        {compressedFileSize && <p>Compressed Model Size: {compressedFileSize} bytes</p>}
      </div>
      <button onClick={handleCompressAndExport} disabled={!gltf}>
        Compress and Export
      </button>
      <p>{compressionStatus}</p>
      <Canvas style={{ background: "#171717", height: "500px" }}>
        <OrbitControls />
        <ambientLight intensity={5.0} />
        <directionalLight intensity={10.0} />
        <Scene gltf={gltf} />
        <Stats />
      </Canvas>
    </div>
  );
}
