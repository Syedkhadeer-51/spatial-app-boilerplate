import React from 'react';
import { useGLTF } from '@react-three/drei';

function Scene({ sceneRef }) {
  const path = "/sample/astronaut.glb";
  const { scene: gltfScene } = useGLTF(path, true, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <primitive
      ref={sceneRef}
      object={gltfScene}
    />
  );
}

export default Scene;
