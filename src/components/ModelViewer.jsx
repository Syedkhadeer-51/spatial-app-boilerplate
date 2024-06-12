/* eslint-disable react/display-name */
import { useRef, useEffect, forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = forwardRef(({ url, scale, onLoaded }, ref) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    if (gltf) {
      onLoaded(gltf.scene);
    }
  }, [gltf, onLoaded]);

  return <primitive object={gltf.scene} ref={ref} scale={scale} />;
});

export default function ModelViewer({ modelUrl, scale, onModelLoaded }) {
  const modelRef = useRef();

  return (
    <Model url={modelUrl} ref={modelRef} scale={scale} onLoaded={onModelLoaded} />
  );
}

