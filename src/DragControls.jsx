// DragControls.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const DragControls = ({ selectedMesh }) => {
  const [dragging, setDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [axis, setAxis] = useState('x'); // Initialize with the desired axis (e.g., 'x', 'y', or 'z')

  const handleMouseDown = (event) => {
    setDragging(true);
    setInitialPosition(selectedMesh.position.clone());
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (event) => {
    if (dragging && selectedMesh) {
      const movementFactor = 0.01; // Adjust this value as needed
      const delta = event.movementX * movementFactor;
  
      // Determine the new position based on the chosen axis
      switch (axis) {
        case 'x':
          selectedMesh.position.x = initialPosition.x + delta;
          break;
        case 'y':
          selectedMesh.position.y = initialPosition.y + delta;
          break;
        case 'z':
          selectedMesh.position.z = initialPosition.z + delta;
          break;
        default:
          // Handle other cases if necessary
          break;
      }
    }
  };
  

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return null; // You can customize this component further based on your requirements
};

export default DragControls;
