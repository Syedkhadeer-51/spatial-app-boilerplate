import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export const Scene = ({ path, backgroundScene, viewport }) => {
  const { scene } = useLoader(GLTFLoader, path, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });

  useEffect(() => {
    if (!backgroundScene) {
      // Adjust models or any other elements within the scene as needed
    }
  }, [backgroundScene]);

  return (
    <>
      <group>
        {!backgroundScene && (
          <>
            <perspectiveCamera
              makeDefault
              position={[3, 3, 8]}
              near={0.5}
              fov={75}
              aspect={viewport.width / viewport.height}
            />
            <orbitControls />
          </>
        )}

        <primitive object={scene} />
      </group>
    </>
  );
};
