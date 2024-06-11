/* eslint-disable react/display-name */
import { useEffect, forwardRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Compressor from './Compressor';

const Model = forwardRef(({ url, scale }, ref) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [model, setModel] = useState(null);
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    if (gltf) {
      console.log('Model loaded');
      setModel(gltf.scene);
      setModelLoaded(true);

      const fetchAndLogOriginalSize = async () => {
        const response = await fetch(url);
        const originalBlob = await response.blob();
        const originalSize = originalBlob.size;
        setOriginalSize(originalSize);

        // Log the original file size
        console.log('Original File Size:', originalSize, 'bytes');
      };

      fetchAndLogOriginalSize();
    }
  }, [gltf, url]);

  return (
    <>
      <primitive object={gltf.scene} ref={ref} scale={scale} />
      {modelLoaded && (
        <Compressor model={model} originalSize={originalSize} />
      )}
    </>
  );
});

export default Model;