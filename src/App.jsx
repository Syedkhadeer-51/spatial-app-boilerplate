import React, { Suspense, useRef, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const useDracoGLTF = (url) => {
  const { scene } = useGLTF(url, true, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });
  return { scene };
};

const Model = forwardRef(({ url }, ref) => {
  const { scene } = useDracoGLTF(url);
  return <primitive object={scene} ref={ref} />;
});

export default function App() {
  const modelRef = useRef();

  const handleExport = () => {
    if (modelRef.current) {
      const exporter = new GLTFExporter();
      exporter.parse(
        modelRef.current,
        (result) => {
          const blob = new Blob([JSON.stringify(result)], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'compressed-model.glb';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        {
          binary: true,
          truncate: true, // Reduce precision to minimize size
          embedImages: true, // Embed images to minimize external references
          onlyVisible: true, // Export only visible objects
          forceIndices: true, // Forces the use of indices, which can reduce size
          forcePowerOfTwoTextures: true, // Forces textures to be power of two for better compression
          dracoOptions: {
            compressionLevel: 10, // Set the highest level of compression
            quantizePositionBits: 14, // Adjust these settings for better compression
            quantizeNormalBits: 10,
            quantizeTexcoordBits: 12,
            quantizeColorBits: 8,
            quantizeGenericBits: 12,
          },
        }
      );
    }
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model url="Models/Barn.glb" ref={modelRef} />
        </Suspense>
        <OrbitControls />
        <Stats />
      </Canvas>
      <button onClick={handleExport} style={{ position: 'absolute', top: '100px', left: '100px' }}>
        Export Model
      </button>
    </>
  );
}
