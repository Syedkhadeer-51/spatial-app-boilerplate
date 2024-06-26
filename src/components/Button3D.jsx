import React, { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { debounce } from 'lodash';

const Button3D = ({ position, onClick, children }) => {
  const ref = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handlePointerMove = useCallback(
    debounce((event) => {
      if (dragging) {
        const vector = new THREE.Vector3(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        ).unproject(camera);
        vector.sub(camera.position).normalize();
        const distance = -camera.position.z / vector.z;
        const pos = camera.position.clone().add(vector.multiplyScalar(distance));
        ref.current.position.copy(pos);
      }
    }, 10),
    [dragging, camera]
  );

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerMove={handlePointerMove}
      onClick={onClick}
    >
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      <Html distanceFactor={10}>
        <div style={{ color: 'white', fontSize: '0.1em', textAlign: 'center' }}>{children}</div>
      </Html>
    </mesh>
  );
};

export default Button3D;
