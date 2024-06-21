import React from 'react';
import MeshSelection from "./meshselection";
import Hierarchy from "./Hierarchy";
import Model from "./Model";

export default function Scene({ importedScene, searchTerm, setSelectedItem }) {
  return (
    <>
      <MeshSelection />
      <Hierarchy searchTerm={searchTerm} setSelectedItem={setSelectedItem} />
      <Model importedScene={importedScene} />
    </>
  );
}
