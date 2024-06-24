import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ModelViewer({ modelUrl, scale, onModelLoaded }) {
    const [error, setError] = useState(null);
    const [gltf, setGltf] = useState(null);

    useEffect(() => {
        if (modelUrl) {
            const loader = new GLTFLoader();
            loader.load(
                modelUrl,
                (gltf) => {
                    setGltf(gltf);
                    if (onModelLoaded) {
                        onModelLoaded(gltf);
                    }
                },
                undefined,
                (err) => {
                    setError(err.message);
                }
            );
        }
    }, [modelUrl, onModelLoaded]);

    if (error) {
        return <div>Error loading model: {error}</div>;
    }

    if (!gltf) {
        return null;
    }

    return <primitive object={gltf.scene} scale={scale} />;
}

export default ModelViewer;
