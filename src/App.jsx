import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import "./App.css";

// Helper function to resize textures
function resizeTexture(texture, maxSize) {
  const { image } = texture;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  return new THREE.CanvasTexture(canvas);
}

// Helper function to compress and export GLTF
async function compressAndExportGLTF(gltf, fileName, textureSize) {
  gltf.scene.traverse((node) => {
    if (node.isMesh) {
      const material = node.material;
      if (material.map) {
        material.map = resizeTexture(material.map, textureSize);
      }
      if (material.normalMap) {
        material.normalMap = resizeTexture(material.normalMap, textureSize);
      }
      if (material.roughnessMap) {
        material.roughnessMap = resizeTexture(material.roughnessMap, textureSize);
      }
      if (material.metalnessMap) {
        material.metalnessMap = resizeTexture(material.metalnessMap, textureSize);
      }
    }
  });

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

export default function App() {
  const [model, setModel] = useState(null);
  const [gltf, setGltf] = useState(null);
  const [textureSize, setTextureSize] = useState(1024);
  const compressedFileName = "model_compressed.glb";
  const guiRef = useRef(null);

  useEffect(() => {
    const gui = new dat.GUI();
    guiRef.current = gui;
    gui.add({ textureSize }, 'textureSize', 256, 4096, 256).name('Texture Size').onChange(setTextureSize);

    return () => {
      gui.destroy();
    };
  }, [textureSize]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(URL.createObjectURL(file), (gltf) => {
      setModel(gltf.scene);
      setGltf(gltf);
    });
  };

  const handleExport = async () => {
    if (gltf) {
      try {
        const compressedBlob = await compressAndExportGLTF(gltf, compressedFileName, textureSize);
        console.log("Compressed Model Size (bytes): ", compressedBlob.size);
      } catch (error) {
        console.error("Error during compression and export:", error);
      }
    } else {
      console.log("No model loaded to export.");
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleExport}>Export Compressed Model</button>
      <Canvas
        camera={{
          position: [-20, 10, 20]      // Ensure the camera looks at the center of the scene
        }}
      >
        <ambientLight intensity={5} />
        {model && <primitive object={model} />}
        <OrbitControls target={[0, 0, 0]} />
        <Stats className="stats"/>
      </Canvas>
    </>
  );
}