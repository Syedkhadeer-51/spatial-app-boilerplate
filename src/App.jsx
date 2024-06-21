import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import { saveAs } from 'file-saver';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as THREE from 'three';
import Scene from './Scene';
import InfoPanel from './InfoPanel';
import ImportContainer from './ImportContainer';
import CloudContainer from './CloudContainer';
import './App.css';
import CloudExportContainer from './CloudExportContainer';
import { Fullscreen, Root, Text } from '@react-three/uikit';
import ExplosionConfetti from './components/Confetti';
import InfoPanel2D from './InfoPanel2D';

export default function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObjectState, setSelectedObjectState] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showInfoPanel2D, setShowInfoPanel2D] = useState(false);
  const sceneRef = useRef();
  const selectedObjectRef = useRef(null);
  const [highlightedMesh, setHighlightedMesh] = useState(null);
  const [isExploding, setIsExploding] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (selectedObject && selectedObject.material) {
      selectedObjectRef.current = selectedObject;
    }
  }, [selectedObject]);

  const handleObjectClick = (mesh) => {
    setSelectedObject(mesh);
    setSelectedObjectState(mesh.uuid);
    setShowInfoPanel(true);
    setShowInfoPanel2D(true);
  };

  const handleObjectHover = (mesh) => {
    if (mesh && mesh !== highlightedMesh) {
      if (highlightedMesh) {
        highlightedMesh.material.color.copy(highlightedMesh.originalColor);
      }
      mesh.originalColor = mesh.material.color.clone();
      const darkerColor = mesh.originalColor.clone().multiplyScalar(0.8);
      mesh.material.color.copy(darkerColor);
      setHighlightedMesh(mesh);
    } else if (!mesh && highlightedMesh) {
      highlightedMesh.material.color.copy(highlightedMesh.originalColor);
      setHighlightedMesh(null);
    }
  };

  const updateSelectedObject = () => {
    setSelectedObjectState((prev) => prev + 1);
  };

  const handleColorChange = (object, color) => {
    const newMaterial = object.material.clone();
    newMaterial.color.set(color);
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleMaterialChange = (object, newMaterialType) => {
    let newMaterial;
    switch (newMaterialType) {
      case 'MeshBasicMaterial':
        newMaterial = new THREE.MeshBasicMaterial({ color: object.material.color });
        break;
      case 'MeshLambertMaterial':
        newMaterial = new THREE.MeshLambertMaterial({ color: object.material.color });
        break;
      case 'MeshPhongMaterial':
        newMaterial = new THREE.MeshPhongMaterial({ color: object.material.color });
        break;
      case 'MeshStandardMaterial':
        newMaterial = new THREE.MeshStandardMaterial({ color: object.material.color });
        break;
      case 'MeshNormalMaterial':
        newMaterial = new THREE.MeshNormalMaterial({ color: object.material.color });
        break;
      case 'MeshPhysicalMaterial':
        newMaterial = new THREE.MeshPhysicalMaterial({ color: object.material.color });
        break;
      case 'MeshToonMaterial':
        newMaterial = new THREE.MeshToonMaterial({ color: object.material.color });
        break;
      case 'MeshMatcapMaterial':
        newMaterial = new THREE.MeshMatcapMaterial({ color: object.material.color });
        break;
      default:
        newMaterial = new THREE.MeshBasicMaterial({ color: object.material.color });
    }
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleWireframeToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.wireframe = !newMaterial.wireframe;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleTransparentToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.transparent = !newMaterial.transparent;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleOpacityChange = (object, value) => {
    const newMaterial = object.material.clone();
    newMaterial.opacity = value;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleDepthTestToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.depthTest = !newMaterial.depthTest;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleDepthWriteToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.depthWrite = !newMaterial.depthWrite;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleAlphaHashToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.alphaHash = !newMaterial.alphaHash;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleSideChange = (object, value) => {
    const newMaterial = object.material.clone();
    newMaterial.side = value;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleFlatShadingToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.flatShading = !newMaterial.flatShading;
    newMaterial.needsUpdate = true;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleVertexColorsToggle = (object) => {
    const newMaterial = object.material.clone();
    newMaterial.vertexColors = newMaterial.vertexColors === THREE.NoColors ? THREE.VertexColors : THREE.NoColors;
    newMaterial.needsUpdate = true;
    object.material = newMaterial;
    updateSelectedObject();
  };

  const handleGeometryChange = (object, newGeometryType) => {
    let newGeometry;
    switch (newGeometryType) {
      case 'ConeGeometry':
        newGeometry = new THREE.ConeGeometry(1, 1, 32);
        break;
      case 'BoxGeometry':
        newGeometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'SphereGeometry':
        newGeometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      default:
        newGeometry = new THREE.BoxGeometry(1, 1, 1);
    }
    object.geometry = newGeometry;
    updateSelectedObject();
  };

  const handleSizeChange = (object, size) => {
    object.scale.set(size, size, size);
    updateSelectedObject();
  };

  const handleCloseInfoPanel = () => {
    setShowInfoPanel(false);
    setSelectedObject(null);
  };
  const handleCloseInfoPanel2D = () => {
    setShowInfoPanel2D(false);
    
  };

  const handleExport = () => {
    const exporter = new GLTFExporter();

    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true,
      maxTextureSize: 1024 || Infinity,
    };

    exporter.parse(sceneRef.current, (result) => {
      if (result instanceof ArrayBuffer) {
        saveAs(new Blob([result], { type: 'application/octet-stream' }), 'scene.glb');
      } else {
        const output = JSON.stringify(result, null, 2);
        saveAs(new Blob([output], { type: 'text/plain' }), 'scene.gltf');
      }
    }, options);
  };

  const handleImport = (importedScene) => {
    sceneRef.current.clear();
    sceneRef.current.add(importedScene);
  };

  const showSuccessMessageAndConfetti = () => {
    setShowSuccessMessage(true);
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="app-container">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 75 }}
        onPointerMissed={() => handleObjectHover(null)}
        gl={{ localClippingEnabled: true }}
      >
        <ExplosionConfetti isExploding={isExploding} />
        {showSuccessMessage && (
          <Root>
          <Text position={[0, 5, 0]} fontSize={2} color="white">
            Model Saved Successfully
          </Text>
          </Root>
        )}
        <group position={[0, -3, 4]}>
          <Root sizeX={2} sizeY={7} sizeZ={7} flexDirection="column">
            <CloudExportContainer sceneRef={sceneRef} onSuccess={showSuccessMessageAndConfetti} />
          </Root>
        </group>
        <group position={[3, 1, 4]}>
          <Root sizeX={2.5} sizeY={10} sizeZ={7} flexDirection="column">
            {showInfoPanel && (
              <InfoPanel
                object={selectedObject}
                onColorChange={handleColorChange}
                onMaterialChange={handleMaterialChange}
                onWireframeToggle={handleWireframeToggle}
                onTransparentToggle={handleTransparentToggle}
                onOpacityChange={handleOpacityChange}
                onDepthTestToggle={handleDepthTestToggle}
                onDepthWriteToggle={handleDepthWriteToggle}
                onAlphaHashToggle={handleAlphaHashToggle}
                onSideChange={handleSideChange}
                onFlatShadingToggle={handleFlatShadingToggle}
                onVertexColorsToggle={handleVertexColorsToggle}
                onGeometryChange={handleGeometryChange}
                onSizeChange={handleSizeChange}
                onClose={handleCloseInfoPanel}
                onExport={handleExport}
              />
            )}
          </Root>
        </group>
        <Scene
          ref={sceneRef}
          onObjectClick={handleObjectClick}
          onObjectHover={handleObjectHover}
          highlightedMesh={highlightedMesh}
        />
        <OrbitControls />
        <Stats />
        <Environment preset="city" />
        <Environment background>
          <color attach="background" args={["#212e42"]} />
          <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
          <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
          <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
          <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
          <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
          <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
          <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        </Environment>
        <ambientLight />
        <directionalLight intensity={7.0} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
      
      {showInfoPanel2D && (
              <InfoPanel2D
                object={selectedObject}
                onColorChange={handleColorChange}
                onMaterialChange={handleMaterialChange}
                
                onTransparentToggle={handleTransparentToggle}
                onOpacityChange={handleOpacityChange}
                onDepthTestToggle={handleDepthTestToggle}
                onDepthWriteToggle={handleDepthWriteToggle}
                onAlphaHashToggle={handleAlphaHashToggle}
                
                onFlatShadingToggle={handleFlatShadingToggle}
                onVertexColorsToggle={handleVertexColorsToggle}
                onClose={handleCloseInfoPanel2D}
              />
      )}
      
      <div className="button-container">
        <ImportContainer onImport={handleImport} />
        <CloudContainer onImport={handleImport} />
      </div>
    </div>
  );
}
