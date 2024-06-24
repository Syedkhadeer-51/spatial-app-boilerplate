// final
import React from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';

const CompressExportButton = ({ modelRef, modelLoaded, originalSize }) => {
    const handleExport = async () => {
        if (modelLoaded && modelRef.current) {
            const exporter = new GLTFExporter();

            try {
                const blob = await shrinkAndExportGLTF(modelRef.current, "compressed_model.glb");
                // const compressedSize = blob.size;
            } catch (error) {
                console.error("Error during compression and export:", error);
            }
        } else {
            console.log('Model is not loaded yet');
        }
    };

    return (
        <button onClick={handleExport} style={{ marginTop: '20px', border: '1px solid black' }}>
            Export Model to Local
        </button>
    );
};

async function shrinkAndExportGLTF(gltf, fileName) {
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
            console.error('An error occurred during GLTF export', error);
            reject(error);
        }, options);
    });
}

export default CompressExportButton;
