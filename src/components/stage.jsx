import React from 'react';

const Stage = () => {
  return (
    <mesh position={[0, -0.245, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <cylinderGeometry args={[2.75, 2.75, 0.1, 60]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default Stage;
