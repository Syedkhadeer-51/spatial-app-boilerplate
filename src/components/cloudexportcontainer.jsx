import React from 'react';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { saveAs } from 'file-saver';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { storage } from './firebase'; 

const CloudExportContainer = ({ sceneRef }) => {
  const handleExportToCloud = async () => {
    const exporter = new GLTFExporter();

    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true,
      maxTextureSize: 1024 || Infinity,
    };

    exporter.parse(sceneRef.current, async (result) => {
      try {
        if (result instanceof ArrayBuffer) {
          const file = new Blob([result], { type: 'application/octet-stream' });
          const storageRef = ref(storage, `models/glb/${Date.now()}_scene.glb`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed',
            (snapshot) => {
              // Progress monitoring if needed
            },
            (error) => {
              console.error('Error uploading GLB file:', error);
            },
            () => {
              console.log('GLB file uploaded successfully');
              // Optionally do something after upload completes
            }
          );

          
        } else {
          console.log('Result is not an ArrayBuffer, exporting as JSON:', result);
          const output = JSON.stringify(result, null, 2);
          const file = new Blob([output], { type: 'text/plain' });
          const storageRef = ref(storage, `models/glb/${Date.now()}_scene.gltf`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed',
            (snapshot) => {
              // Progress monitoring if needed
            },
            (error) => {
              console.error('Error uploading JSON file:', error);
            },
            () => {
              console.log('JSON file uploaded successfully');
              // Optionally do something after upload completes
            }
          );

          
        }
      } catch (error) {
        console.error('Error exporting or uploading file:', error);
      }
    }, options);
  };

  return (
    <div className="cloud-export-container">
      
      <button onClick={handleExportToCloud}>Export GLB to Cloud</button>
    </div>
  );
};

export default CloudExportContainer;