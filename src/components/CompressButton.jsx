import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function CompressButton({ file, onCompress, setMessage, setError }) {
  const handleCompress = () => {
    if (!file) {
      setError('No file uploaded');
      return;
    }

    setMessage('Compressing...');

    const loader = new GLTFLoader();
    loader.load(
      file,
      (gltf) => {
        const scene = gltf.scene;
        const geometries = [];

        scene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            geometries.push(child.geometry);
          }
        });

        if (geometries.length === 0) {
          setError('No geometries found in the model');
          return;
        }

        // Merge geometries using BufferGeometryUtils.mergeBufferGeometries
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);

        const mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
        const newScene = new THREE.Scene();
        newScene.add(mergedMesh);

        const exporter = new GLTFExporter();
        exporter.parse(
          newScene,
          (result) => {
            const output = JSON.stringify(result);
            const blob = new Blob([output], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            onCompress(url);
            setMessage('Compression successful!');
          },
          { binary: true }
        );
      },
      undefined,
      (error) => {
        setError('Error loading the model: ' + error.message);
      }
    );
  };

  return <button onClick={handleCompress}>Compress</button>;
}

export default CompressButton;
