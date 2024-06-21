import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const importModel = (file, onImport) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const contents = e.target.result;
    const loader = new GLTFLoader();
  
    loader.parse(contents, '', (gltf) => {
      let newName = prompt('Please enter a name for the model:');
      if (!newName || newName.trim() === '') {
        newName = gltf.scene.name || 'Unnamed Scene'; // Use the original name or a default one
      }
      gltf.scene.name = newName;
      onImport(gltf.scene);
      gltf.scene.dispatchEvent({ type: 'change' });
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });
  };
  
  reader.readAsArrayBuffer(file);
};
