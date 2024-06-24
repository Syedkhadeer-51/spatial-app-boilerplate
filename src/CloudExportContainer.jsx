import React from 'react';
import { ref, uploadBytesResumable } from '@firebase/storage';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { storage } from './firebase.jsx'; // Adjust path as per your firebase configuration
import { Button } from './components/apfel/button';
import { Container, Text } from '@react-three/uikit';

const CloudExportContainer = ({ sceneRef, onSuccess }) => {
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
              onSuccess(); // Call the onSuccess callback after successful upload
            }
          );

        } else {
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
              onSuccess(); // Call the onSuccess callback after successful upload
            }
          );
        }
      } catch (error) {
        console.error('Error exporting or uploading file:', error);
      }
    }, options);
  };

  return (
    <Container flexDirection="column" md={{ flexDirection: 'row' }} gap={32}>
      <Button Variant="icon" onClick={handleExportToCloud} size="lg" backgroundColor={'grey'} backgroundOpacity={0.35}>
        <Text>Save File</Text>
      </Button>
    </Container>
  );
};

export default CloudExportContainer;
