import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as dat from 'dat.gui';
import { Raycaster, Vector2, AnimationMixer } from 'three';
import './App.css';

export default function App() {
  const [model, setModel] = useState(null);
  const [animations, setAnimations] = useState(null);
  const [lightProperties, setLightProperties] = useState({
    type: 'ambientLight',
    color: '#ffffff',
    intensity: 1,
    position: { x: 10, y: 10, z: 10 },
  });
  const [sceneProperties, setSceneProperties] = useState({
    wireframe: false,
    autoRotate: false,
    backgroundColor: '#aaaaaa',
    showGrid: false,
    gridSize: 50,
    gridDivisions: 50,
  });
  const guiRef = useRef(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const lightFolder = gui.addFolder('Light Properties');
    lightFolder.add(lightProperties, 'type', ['ambientLight', 'directionalLight']).name('Type').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, type: value }));
    });
    lightFolder.addColor(lightProperties, 'color').name('Color').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, color: value }));
    });
    lightFolder.add(lightProperties, 'intensity', 0, 10).name('Intensity').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, intensity: value }));
    });

    const positionFolder = lightFolder.addFolder('Position');
    positionFolder.add(lightProperties.position, 'x', -50, 50).name('X').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, position: { ...prev.position, x: value } }));
    });
    positionFolder.add(lightProperties.position, 'y', -50, 50).name('Y').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, position: { ...prev, y: value } }));
    });
    positionFolder.add(lightProperties.position, 'z', -50, 50).name('Z').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, position: { ...prev, z: value } }));
    });

    const sceneFolder = gui.addFolder('Scene Properties');
    sceneFolder.add(sceneProperties, 'wireframe').name('Wireframe').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, wireframe: value }));
    });
    sceneFolder.add(sceneProperties, 'autoRotate').name('Auto Rotate').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, autoRotate: value }));
    });
    sceneFolder.addColor(sceneProperties, 'backgroundColor').name('Background Color').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, backgroundColor: value }));
    });
    sceneFolder.add(sceneProperties, 'showGrid').name('Show Grid').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, showGrid: value }));
    });
    sceneFolder.add(sceneProperties, 'gridSize', 1, 100).name('Grid Size').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, gridSize: value }));
    });
    sceneFolder.add(sceneProperties, 'gridDivisions', 1, 100).name('Grid Divisions').onChange((value) => {
      setSceneProperties((prev) => ({ ...prev, gridDivisions: value }));
    });

    lightFolder.close();
    sceneFolder.close();

    guiRef.current = gui;

    return () => {
      gui.destroy();
    };
  }, [lightProperties, sceneProperties]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const loader = new GLTFLoader();
    loader.load(URL.createObjectURL(file), (gltf) => {
      setModel(gltf.scene);
      setAnimations(gltf.animations);
      printMeshHierarchy(gltf.scene);
    });
  };

  const printMeshHierarchy = (object, depth = 0) => {
    console.log(`${' '.repeat(depth * 2)}${object.type}: ${object.name || 'Unnamed'}`);
    if (object.children) {
      object.children.forEach((child) => printMeshHierarchy(child, depth + 1));
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
      <Canvas camera={{ position: [-8, 5, 8] }} style={{ background: sceneProperties.backgroundColor }}>
        <Scene model={model} animations={animations} lightProperties={lightProperties} sceneProperties={sceneProperties} />
        <OrbitControls autoRotate={sceneProperties.autoRotate} />
        <Stats showPanel={0} className="stats" />
      </Canvas>
    </>
  );
}

function HoverHighlight({ setHoveredObject, setSelectedObject }) {
  const { gl, scene, camera } = useThree();
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useRef(new Vector2());
  const canvasRef = useRef(gl.domElement);
  const previousHoveredObject = useRef(null);
  const originalColor = useRef(null);

  const onMouseMove = useCallback((event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const onClick = useCallback(() => {
    if (previousHoveredObject.current) {
      setSelectedObject(previousHoveredObject.current);
      console.log('Clicked Mesh:', previousHoveredObject.current.name);
    }
  }, [setSelectedObject]);

  useEffect(() => {
    canvasRef.current.addEventListener('mousemove', onMouseMove);
    canvasRef.current.addEventListener('click', onClick);
    return () => {
      canvasRef.current.removeEventListener('mousemove', onMouseMove);
      canvasRef.current.removeEventListener('click', onClick);
    };
  }, [onMouseMove, onClick]);

  useFrame(() => {
    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      setHoveredObject(object);

      if (previousHoveredObject.current && previousHoveredObject.current !== object) {
        previousHoveredObject.current.material.emissive.setHex(originalColor.current);
      }

      if (object.material && object.material.emissive) {
        if (previousHoveredObject.current !== object) {
          originalColor.current = object.material.emissive.getHex();
          previousHoveredObject.current = object;
        }
        if (object !== setSelectedObject) {
          object.material.emissive.setHex(0xaaaaaa);
        }
      }
    } else {
      if (previousHoveredObject.current) {
        previousHoveredObject.current.material.emissive.setHex(originalColor.current);
        previousHoveredObject.current = null;
        originalColor.current = null;
      }
      setHoveredObject(null);
    }
  });

  return null;
}

function Scene({ model, animations, lightProperties, sceneProperties }) {
  const { scene } = useThree();
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [hoveredMesh, setHoveredMesh] = useState(null);
  const guiRef = useRef(null);
  const mixer = useRef(null);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (model) {
      scene.add(model);
      if (animations && animations.length > 0) {
        mixer.current = new AnimationMixer(model);
        const action = mixer.current.clipAction(animations[0]);
        action.play();
        setActiveAction(action);
      }
    }
    return () => {
      if (model) {
        scene.remove(model);
      }
      if (mixer.current) {
        mixer.current.stopAllAction();
        mixer.current = null;
        setActiveAction(null);
      }
    };
  }, [model, animations, scene]);

  useEffect(() => {
    if (selectedMesh && selectedMesh.isMesh) {
      setupMeshGUI(selectedMesh);
    }
  }, [selectedMesh]);

  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.wireframe = sceneProperties.wireframe;
        }
      });
    }
  }, [model, sceneProperties.wireframe]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

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
      <HoverHighlight setHoveredObject={setHoveredMesh} setSelectedObject={setSelectedMesh} />
      {lightProperties.type === 'ambientLight' ? (
        <ambientLight intensity={lightProperties.intensity} color={lightProperties.color} />
      ) : (
        <directionalLight
          intensity={lightProperties.intensity}
          color={lightProperties.color}
          position={[lightProperties.position.x, lightProperties.position.y, lightProperties.position.z]}
        />
      )}
      {sceneProperties.showGrid && (
        <gridHelper args={[sceneProperties.gridSize, sceneProperties.gridDivisions]} />
      )}
    </>
  );
}
