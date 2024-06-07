import { Canvas} from '@react-three/fiber'
import './App.css'
import { OrbitControls} from '@react-three/drei'
import CustomGizmoHelper from './CustomGizmoHelper.jsx';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper.jsx';
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import  {Stats} from '@react-three/drei'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Camera, CameraHelper } from 'three'
import { useState,useEffect } from 'react';
import { saveAs } from 'file-saver';

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
  const path = "./model5.glb"; // Ensure this path is correct and the file is present
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
    const originalPath = "/model5.glb"; // Ensure this path is correct and the file is present

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


    // This exporter function is only because to download the gbl file this is not compulsory it is only to check the compression
  return (
    <>
      <Canvas camera={{position: [0, 0, 10]}}>
        <ambientLight/>
      <Scene onModelLoaded={handleModelLoaded} />
      <CustomGizmoHelper/>
        <PerspectiveCameraWithHelper position={[5,6,8]}/>
        <Stats/>
      </Canvas>
    </>
  )
}