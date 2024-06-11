import React, { useEffect } from "react";
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

function Scene({ onModelLoaded }) {
  const path = "sample/original-model.glb"; // Ensure this path is correct and the file is present
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
  const compressedFileName = "model_compressed.glb";

  useEffect(() => {
    const originalPath = "/sample/original-model.glb"; // Ensure this path is correct and the file is present

    fetchFileSize(originalPath).then(size => {
      if (size !== null) {
        console.log("Original Model Size (bytes): ", size);
      }
    });
  }, []);

  const handleModelLoaded = async (gltf) => {
    try {
      const compressedBlob = await compressAndExportGLTF(gltf, compressedFileName);

      console.log("Compressed Model Size (bytes): ", compressedBlob.size);

      // For debugging: Log the GLTF object and options
      console.log("GLTF object:", gltf);
      console.log("Exporter options:", {
        binary: true,
        dracoOptions: {
          compressionLevel: 10
        }
      });
    } catch (error) {
      console.error("Error during compression and export:", error);
    }
  };

  return (
    <Canvas style={{ background: "#171717" }}>
      <OrbitControls />
      <ambientLight intensity={5.0} />
      <directionalLight intensity={10.0} />
      <Scene onModelLoaded={handleModelLoaded} />
      <Stats /> {/* Show stats to record the model loading */}
    </Canvas>
  );
}

