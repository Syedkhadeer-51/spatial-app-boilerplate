import React, { useState } from 'react';
import { ref, uploadBytesResumable } from '@firebase/storage';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { storage } from './firebase.jsx'; // Adjust path as per your firebase configuration
import { Button } from './components/apfel/button';
import { Container, Text } from '@react-three/uikit';
import { Input } from './components/apfel/input'; // Assuming you have an Input component in your UI kit

const CloudExportContainer = ({ sceneRef, onSuccess }) => {
  const [fileName, setFileName] = useState('');

  const handleExportToCloud = async () => {
    if (!fileName) {
      alert('Please enter a file name');
      return;
    }

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
          const storageRef = ref(storage, `models/glb/${fileName}.glb`);
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
              setFileName(''); // Reset the input field
            }
          );

        } else {
          const output = JSON.stringify(result, null, 2);
          const file = new Blob([output], { type: 'text/plain' });
          const storageRef = ref(storage, `models/glb/${fileName}.gltf`);
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
              setFileName(''); // Reset the input field
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
      <Input 
        placeholder="Enter file name" 
        value={fileName} 
        onValueChange={setFileName}
      />
      <Button Variant="icon" onClick={handleExportToCloud} size="lg" backgroundColor={'grey'} backgroundOpacity={0.35}>
        <Text>Save File</Text>
      </Button>
    </Container>
  );
};

export default CloudExportContainer;
