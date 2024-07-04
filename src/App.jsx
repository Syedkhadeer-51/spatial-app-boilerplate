import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Raycaster, Vector2, AnimationMixer, TextureLoader, Color } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import * as dat from 'dat.gui';
import './App.css';

export default function App() {
  const [model, setModel] = useState(null);
  const [animations, setAnimations] = useState(null);
  const [lightProperties, setLightProperties] = useState({
    type: 'ambientLight',
    color: '#ffffff',
    intensity: 8,
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
  const folderStates = useRef({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const loader = new GLTFLoader();
    loader.load(URL.createObjectURL(file), (gltf) => {
      setModel(gltf.scene);
      setAnimations(gltf.animations);
    });
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

  useEffect(() => {
    const gui = new dat.GUI();
    guiRef.current = gui;

    const lightFolder = gui.addFolder('Light Properties');
    lightFolder.add(lightProperties, 'type', ['ambientLight', 'directionalLight', 'pointLight']).name('Type').onChange((value) => {
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
      setLightProperties((prev) => ({ ...prev, position: { ...prev.position, y: value } }));
    });
    positionFolder.add(lightProperties.position, 'z', -50, 50).name('Z').onChange((value) => {
      setLightProperties((prev) => ({ ...prev, position: { ...prev.position, z: value } }));
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

    const fileControlsFolder = gui.addFolder('File Controls');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileUpload);
    document.body.appendChild(fileInput);

    fileControlsFolder.add({ chooseFile: () => fileInput.click() }, 'chooseFile').name('Choose File');
    // fileControlsFolder.add({ export: handleExport }, 'export').name('Export');

    const meshFolder = gui.addFolder('Mesh Hierarchy');

    const printMeshHierarchy = (object, folder) => {
      const subFolder = folder.addFolder(object.name || 'Unnamed');
      if (object.children) {
        object.children.forEach((child) => printMeshHierarchy(child, subFolder));
      }
    };

    if (model) {
      printMeshHierarchy(model, meshFolder);
    }

    guiRef.current = gui;

    return () => {
      gui.destroy();
      document.body.removeChild(fileInput);
    };
  }, [lightProperties, sceneProperties, model]);

  useEffect(() => {
    const gui = guiRef.current;
    for (const folderName in gui.__folders) {
      const folder = gui.__folders[folderName];
      if (folderStates.current[folderName]) {
        folder.open();
      } else {
        folder.close();
      }
      folder.domElement.addEventListener('click', () => {
        folderStates.current[folderName] = !folder.closed;
      });
    }

    const lightFolder = gui.__folders['Light Properties'];
    lightFolder.__controllers.forEach(controller => controller.updateDisplay());
    lightFolder.__folders['Position'].__controllers.forEach(controller => controller.updateDisplay());

    const sceneFolder = gui.__folders['Scene Properties'];
    sceneFolder.__controllers.forEach(controller => controller.updateDisplay());

    const meshFolder = gui.__folders['Mesh Hierarchy'];
    meshFolder.__controllers.forEach(controller => controller.updateDisplay());

    const fileControlsFolder = gui.__folders['File Controls'];
    fileControlsFolder.__controllers.forEach(controller => controller.updateDisplay());
  }, [lightProperties, sceneProperties, model]);

  return (
    <>
      <Canvas camera={{ position: [-8, 5, 8] }} style={{ background: sceneProperties.backgroundColor }}>
        <Scene model={model} animations={animations} lightProperties={lightProperties} sceneProperties={sceneProperties} />
        <OrbitControls autoRotate={sceneProperties.autoRotate} />
        <Stats showPanel={0} className="stats" />
      </Canvas>
    </>
  );
}

function HoverHighlight({ setHoveredObject, setSelectedObject, lightType, setLightPosition }) {
  const { gl, scene, camera } = useThree();
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useRef(new Vector2());
  const canvasRef = useRef(gl.domElement);

  const onMouseMove = useCallback((event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (lightType === 'directionalLight') {
      setLightPosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        z: 1,
      });
    }
  }, [lightType, setLightPosition]);

  const onClick = useCallback(() => {
    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      setSelectedObject(object);
      console.log('Clicked Mesh:', object.name);
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

  return null;
}

function Scene({ model, animations, lightProperties, sceneProperties }) {
  const { scene, gl, camera, size } = useThree();
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [hoveredMesh, setHoveredMesh] = useState(null);
  const [lightPosition, setLightPosition] = useState(lightProperties.position);
  const guiRef = useRef(null);
  const mixer = useRef(null);
  const [activeAction, setActiveAction] = useState(null);
  const folderStates = useRef({});
  const composer = useRef();
  const outlinePass = useRef();

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));

    outlinePass.current = new OutlinePass(new Vector2(size.width, size.height), scene, camera);
    composer.current.addPass(outlinePass.current);

    outlinePass.current.edgeStrength = 10;
    outlinePass.current.edgeThickness = 1;
    outlinePass.current.edgeGlow = 0.5;
    outlinePass.current.visibleEdgeColor.set('#ffa500');
    outlinePass.current.hiddenEdgeColor.set('#190a05');

    gl.setAnimationLoop(() => {
      composer.current.render();
    });

    return () => {
      gl.setAnimationLoop(null);
    };
  }, [gl, scene, camera, size]);

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
      outlinePass.current.selectedObjects = [selectedMesh];
    } else {
      outlinePass.current.selectedObjects = [];
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

  const setupMeshGUI = (mesh) => {
    if (guiRef.current) {
      folderStates.current = {};
      guiRef.current.__folders['Mesh Properties']?.close();
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
      const selectedMeshText = {
        Name: mesh.name || 'Unnamed',
      };
      meshFolder.add(selectedMeshText, 'Name').name('Selected Mesh');
      meshFolder.addColor(colorOptions, 'Color').name('Color').onChange((value) => {
        mesh.material.color.set(value);
      });

      meshFolder.add(mesh.material, 'wireframe').name('Wireframe');

      // Add texture upload button
      const textureUpload = {
        upload: () => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
              const textureLoader = new TextureLoader();
              textureLoader.load(event.target.result, (texture) => {
                mesh.material.map = texture;
                mesh.material.needsUpdate = true;
              });
            };
            reader.readAsDataURL(file);
          };
          fileInput.click();
        },
      };
      meshFolder.add(textureUpload, 'upload').name('Upload Texture');

      const infoFolder = meshFolder.addFolder('Mesh Info');
      infoFolder.add({ Vertices: vertexCount }, 'Vertices').name('Vertices').listen();
      infoFolder.add({ Edges: edgeCount }, 'Edges').name('Edges').listen();
      infoFolder.add({ Triangles: triangleCount }, 'Triangles').name('Triangles').listen();

      meshFolder.open();
    }
  };

  useEffect(() => {
    const gui = guiRef.current;
    if (gui) {
      for (const folderName in gui.__folders) {
        const folder = gui.__folders[folderName];
        if (folderStates.current[folderName]) {
          folder.open();
        } else {
          folder.close();
        }
        folder.domElement.addEventListener('click', () => {
          folderStates.current[folderName] = folder.closed ? false : true;
        });
      }
    }
  });

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return (
    <>
      <HoverHighlight setHoveredObject={setHoveredMesh} setSelectedObject={setSelectedMesh} lightType={lightProperties.type} setLightPosition={setLightPosition} />
      {lightProperties.type === 'ambientLight' && <ambientLight intensity={lightProperties.intensity} color={lightProperties.color} />}
      {lightProperties.type === 'directionalLight' && (
        <directionalLight
          intensity={lightProperties.intensity}
          color={lightProperties.color}
          position={[lightPosition.x, lightPosition.y, lightPosition.z]}
        />
      )}
      {lightProperties.type === 'pointLight' && (
        <pointLight
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
