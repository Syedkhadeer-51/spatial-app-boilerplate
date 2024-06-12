import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';

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

function Scene({ modelPath, onModelLoaded }) {
    const gltf = useLoader(GLTFLoader, modelPath, loader => {
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

export default function Compression({ modelPath, onExport }) {
    const gltfRef = useRef();

    const handleModelLoaded = (gltf) => {
        gltfRef.current = gltf;
    };

    const handleExportClick = async () => {
        if (gltfRef.current) {
            try {
                const compressedBlob = await compressAndExportGLTF(gltfRef.current, "model_compressed.glb");
                console.log("Compressed Model Size (bytes): ", compressedBlob.size);
            } catch (error) {
                console.error("Error during compression and export:", error);
            }
        }
    };

    useEffect(() => {
        if (onExport) {
            onExport(handleExportClick);
        }
    }, [onExport]);

    return (
        <>
            {modelPath && <Scene modelPath={modelPath} onModelLoaded={handleModelLoaded} />}
        </>
    );
}
