import { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Stats } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const useDracoGLTF = (url) => {
  const { scene } = useGLTF(url, true, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });
  return { scene };
};

const Model = forwardRef(({ url, scale, onLoaded }, ref) => {
  const { scene } = useDracoGLTF(url);
  useEffect(() => {
    if (scene) {
      console.log('Model loaded');
      onLoaded(scene);
    }
  }, [scene, onLoaded]);
  return <primitive object={scene} ref={ref} scale={scale} />;
});

export default function App() {
  const modelRef = useRef();
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelUrl = '/mikudayo.glb'; // Replace with the path of the model
  const setScale = [0.2, 0.2, 0.2]; // Set your desired scale here

  useEffect(() => {
    const fetchAndLogOriginalSize = async () => {
      // Fetch the original model to get its size
      const response = await fetch(modelUrl);
      const originalBlob = await response.blob();
      const originalSize = originalBlob.size;

      // Log the original file size
      console.log('Original File Size:', originalSize, 'bytes');
    };

    fetchAndLogOriginalSize();
  }, [modelUrl]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      console.log('Starting export process');
      const exporter = new GLTFExporter();
      exporter.parse(
        modelRef.current,
        (result) => {
          console.log('Export process completed');
          const output = JSON.stringify(result, null, 2);
          const compressedBlob = new Blob([output], { type: 'application/json' });
          const compressedSize = compressedBlob.size;

          // Log the compressed file size
          console.log('Compressed File Size:', compressedSize, 'bytes');
        },
        { binary: true }
      );
    }
  }, [modelLoaded]);

  const handleModelLoaded = () => {
    console.log('Model fully loaded');
    setModelLoaded(true);
  };

  return (
    <>
      <Canvas camera={{ position: [-8, 3, 8] }}>
        <ambientLight intensity={2.5} />
        <directionalLight color={"yellow"} position={[0, 0, 5]} />
        <Center>
          <Model url={modelUrl} ref={modelRef} scale={setScale} onLoaded={handleModelLoaded} />
        </Center>
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
}
