import { useState } from 'react';
import { useAtom } from 'jotai';
import { clonedObjectAtom } from './Experience'; // Import the clonedObjectAtom
import * as THREE from 'three';

const useObjectControls = (setSelectedObject, setShowInfoPanel) => {
  const [, setClonedObject] = useAtom(clonedObjectAtom); // Use the atom to manage cloned object state
  const [highlightedMesh, setHighlightedMesh] = useState(null);

  const handleObjectClick = (mesh) => {
    if (mesh) {
      // Clone the mesh
      const clonedMesh = mesh.clone(true);
      
      // Optionally, you can remove the cloned object's position/rotation/scale if you want it to be reset
      clonedMesh.position.set(0, 0, 0);
      clonedMesh.rotation.set(0, 0, 0);
      clonedMesh.scale.set(1, 1, 1);
      
      // Pass the cloned object to the InfoPanel
      setClonedObject(clonedMesh);

      // Set the selected object and show the InfoPanel
      setSelectedObject(mesh);
      setShowInfoPanel(true);
    }
  };

  const handleObjectHover = (mesh) => {
    if (mesh && mesh.material && mesh.material.color) {
      if (mesh !== highlightedMesh) {
        if (highlightedMesh && highlightedMesh.material && highlightedMesh.material.color) {
          highlightedMesh.material.color.copy(highlightedMesh.originalColor);
        }
        mesh.originalColor = mesh.material.color.clone();
        const darkerColor = mesh.originalColor.clone().multiplyScalar(0.8);
        mesh.material.color.copy(darkerColor);
        setHighlightedMesh(mesh);
      }
    } else if (!mesh && highlightedMesh && highlightedMesh.material && highlightedMesh.material.color) {
      highlightedMesh.material.color.copy(highlightedMesh.originalColor);
      setHighlightedMesh(null);
    }
  };

  return { handleObjectClick, handleObjectHover, highlightedMesh };
};

export default useObjectControls;
