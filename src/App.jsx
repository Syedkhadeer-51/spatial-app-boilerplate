import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

function Model({ file, setMeshHierarchy, selectedMesh, searchQuery }) {
  const { scene } = useGLTF(file);

  useEffect(() => {
    const buildHierarchy = (object) => {
      return {
        name: object.name || 'Unnamed',
        object: object,
        children: object.children
          .filter((child) => child.isMesh || child.isObject3D)
          .map((child) => buildHierarchy(child)),
      };
    };

    const hierarchy = buildHierarchy(scene);
    setMeshHierarchy(hierarchy);
  }, [scene, setMeshHierarchy]);

  useEffect(() => {
    const applyEmissive = (object) => {
      if (object.isMesh) {
        if (object === selectedMesh || (selectedMesh && selectedMesh.children.includes(object))) {
          object.material.emissive = new THREE.Color(0xff0000); // Highlight selected mesh and its children
        } else if (searchQuery && object.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          object.material.emissive = new THREE.Color(0x00ff00); // Highlight search query matches
        } else {
          object.material.emissive = new THREE.Color(0x000000); // Reset others
        }
      }
      object.children.forEach((child) => applyEmissive(child));
    };

    if (scene) {
      applyEmissive(scene);
    }
  }, [selectedMesh, searchQuery, scene]);

  return <primitive object={scene} />;
}

function App() {
  const [meshHierarchy, setMeshHierarchy] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openNodes, setOpenNodes] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFile(url);
    }
  };

  const toggleNode = (name) => {
    setOpenNodes((prevOpenNodes) => ({
      ...prevOpenNodes,
      [name]: !prevOpenNodes[name],
    }));
  };

  const renderMeshHierarchy = (node) => {
    const isOpen = openNodes[node.name] || false;
    const isMatch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <li key={node.name} className={`meshButtons ${isMatch ? 'highlight' : ''}`}>
        <div className="button-container">
          <button onClick={() => setSelectedMesh(node.object)} >
            {node.name}
          </button>
          {node.children.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.name);
              }}
              className="toggle-icon"
            >
              {isOpen ? '-' : '+'}
            </span>
          )}
        </div>
        {isOpen && node.children.length > 0 && (
          <ul>
            {node.children.map((child) => renderMeshHierarchy(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className='App'>
      <div className="panel">
        <h2 style={{ color: "white" }}>Meshes</h2>
        <input
          type="text"
          placeholder="Search mesh..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul>{meshHierarchy && renderMeshHierarchy(meshHierarchy)}</ul>
        <input type="file" accept=".glb, .gltf" onChange={handleFileChange} />
      </div>
      {file && (
        <Canvas className="canvas">
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Model
            file={file}
            setMeshHierarchy={setMeshHierarchy}
            selectedMesh={selectedMesh}
            searchQuery={searchQuery}
          />
          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>
      )}
    </div>
  );
}

export default App;
