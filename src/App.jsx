import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as dat from 'dat.gui';
import './App.css';

export default function App() {
  const [model, setModel] = useState(null);
  const [lightProperties, setLightProperties] = useState({
    type: 'ambientLight',
    color: '#ffffff',
    intensity: 1,
    position: { x: 10, y: 10, z: 10 },
  });
  const guiRef = useRef(null);

  useEffect(() => {
    const gui = new dat.GUI();
    const lightFolder = gui.addFolder('Light Properties');

    lightFolder.add(lightProperties, 'type', ['ambientLight', 'directionalLight']).name('Type').onChange((value) => {
      setLightProperties(prev => ({ ...prev, type: value }));
    });

    lightFolder.addColor(lightProperties, 'color').name('Color').onChange((value) => {
      setLightProperties(prev => ({ ...prev, color: value }));
    });

    lightFolder.add(lightProperties, 'intensity', 0, 10).name('Intensity').onChange((value) => {
      setLightProperties(prev => ({ ...prev, intensity: value }));
    });

    const positionFolder = lightFolder.addFolder('Position');
    positionFolder.add(lightProperties.position, 'x', -50, 50).name('X').onChange((value) => {
      setLightProperties(prev => ({ ...prev, position: { ...prev.position, x: value } }));
    });
    positionFolder.add(lightProperties.position, 'y', -50, 50).name('Y').onChange((value) => {
      setLightProperties(prev => ({ ...prev, position: { ...prev.position, y: value } }));
    });
    positionFolder.add(lightProperties.position, 'z', -50, 50).name('Z').onChange((value) => {
      setLightProperties(prev => ({ ...prev, position: { ...prev.position, z: value } }));
    });

    lightFolder.open();
    guiRef.current = gui;

    return () => {
      gui.destroy();
    };
  }, [lightProperties]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const loader = new GLTFLoader();
    loader.load(URL.createObjectURL(file), (gltf) => {
      setModel(gltf.scene);
      printMeshHierarchy(gltf.scene);
    });
  };

  const printMeshHierarchy = (object, depth = 0) => {
    console.log(`${' '.repeat(depth * 2)}${object.type}: ${object.name || 'Unnamed'}`);
    if (object.children) {
      object.children.forEach(child => printMeshHierarchy(child, depth + 1));
    }
  };

  const handleExport = () => {
    const exporter = new GLTFExporter();
    if (model) {
      exporter.parse(
        model,
        (result) => {
          const output = JSON.stringify(result, null, 2);
          const blob = new Blob([output], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'modified_model.gltf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        { binary: false }
      );
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleExport}>Export</button>
      <Canvas camera={{ position: [-8, 5, 8] }}>
        <Scene model={model} lightProperties={lightProperties} />
        <OrbitControls />
        <Stats showPanel={0} className="stats" />
      </Canvas>
    </>
  );
}

function Scene({ model, lightProperties }) {
  const { scene } = useThree();
  const [selectedMesh, setSelectedMesh] = useState(null);
  const guiRef = useRef(null);

  useEffect(() => {
    if (model) {
      scene.add(model);
    }
    return () => {
      if (model) {
        scene.remove(model);
      }
    };
  }, [model, scene]);

  useEffect(() => {
    if (selectedMesh && selectedMesh.isMesh) {
      setupMeshGUI(selectedMesh);
    }
  }, [selectedMesh]);

  const onClick = useCallback((event) => {
    event.stopPropagation();
    const { object } = event;
    
    // Deselect previous mesh (if any)
    if (selectedMesh) {
      selectedMesh.material.color.copy(selectedMesh.currentColor);
    }
    
    // Select new mesh
    setSelectedMesh(object);
    object.currentColor = object.material.color.clone(); // Store current color
    object.material.color.set(0x0000ff); // Set selected mesh color to blue (hex value)
    
    console.log(`Selected mesh: ${object.name || 'Unnamed'}`);
    
    // Update GUI to reflect selected mesh properties
    setupMeshGUI(object);
  }, [selectedMesh]);

  const setupMeshGUI = (mesh) => {
    if (guiRef.current) {
      guiRef.current.destroy();
    }
    
    guiRef.current = new dat.GUI();

    if (mesh.geometry) {
      const geometry = mesh.geometry;
      const vertexCount = geometry.attributes.position.count;
      const triangleCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3;
      const edgeCount = vertexCount;

      const meshFolder = guiRef.current.addFolder('Mesh Properties');
      const colorOptions = {
        Color: mesh.material.color.getStyle(),
      };

      meshFolder.addColor(colorOptions, 'Color').name('Color').onChange((value) => {
        mesh.material.color.set(value);
      });

      meshFolder.add(mesh.material, 'wireframe').name('Wireframe');
      meshFolder.add(mesh.material, 'transparent').name('Transparent');
      meshFolder.add(mesh.material, 'opacity', 0, 1).name('Opacity').onChange((value) => {
        mesh.material.transparent = value < 1;
        mesh.material.opacity = value;
      });

      const infoFolder = meshFolder.addFolder('Mesh Info');
      infoFolder.add({ Vertices: vertexCount }, 'Vertices').name('Vertices').listen();
      infoFolder.add({ Edges: edgeCount }, 'Edges').name('Edges').listen();
      infoFolder.add({ Triangles: triangleCount }, 'Triangles').name('Triangles').listen();

      meshFolder.open();
    }
  };

  return (
    <>
      {lightProperties.type === 'ambientLight' ? (
        <ambientLight intensity={lightProperties.intensity} color={lightProperties.color} />
      ) : (
        <directionalLight
          intensity={lightProperties.intensity}
          color={lightProperties.color}
          position={[lightProperties.position.x, lightProperties.position.y, lightProperties.position.z]}
        />
      )}
      {model && <primitive object={model} onClick={onClick} />}
    </>
  );
}
