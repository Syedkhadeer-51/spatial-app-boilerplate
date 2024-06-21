import React from 'react';

export default function Model({ importedScene }) {
  if (!importedScene) {
    return null;
  }
  
  return (
    <>
      <primitive object={importedScene} scale={0.4} />
    </>
  );
}
