import React, { useState, useRef, useEffect } from 'react';
import { Scene } from './components/Scene';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { useAtom } from 'jotai';
import { Environment, Lightformer, MeshReflectorMaterial, Text, Plane } from '@react-three/drei';

import { XR, createXRStore, VRButton, ARButton } from '@react-three/xr';

import useLights from './components/LightsManager';
import Lights from './components/Lights';
import LightControls from './components/LightControls';
import { Experience, slideAtom, scenes, presetAtom, presets } from './components/Experience';
import { Overlay } from './components/Overlay';
import InfoPanel from './components/InfoPanel';
import useObjectControls from './components/ObjectControls';
import useSceneControls from './components/SceneControls';
import { MenuPanel, TexturesMaterialsAtom, LightsAtom } from './components/MenuPanel';

const store = createXRStore()

function Content3D({ position }) {
  const [hoveredPreset, setHoveredPreset] = useState(null); // Separate state for preset hover
  const [hoveredModel, setHoveredModel] = useState(null); // Separate state for model hover
  const [slide, setSlide] = useAtom(slideAtom);
  const [preset, setPreset] = useAtom(presetAtom);
  const [planeSize, setPlaneSize] = useState({ width: 8, height: 4});

  useEffect(() => {
    const buttonCount = scenes.length;
    const buttonWidth = 1;
    const buttonHeight = 0.5;
    const margin = 0.2;

    const totalWidth = buttonWidth * buttonCount + margin * (buttonCount - 1);
    const totalHeight = buttonHeight + margin;

    setPlaneSize({
      width: Math.max(totalWidth, 8),
      height: Math.max(totalHeight, 4)
    });
  }, [scenes.length]);

  const handleClick = (index) => {
    setSlide(index);
  };

  const handlePresetChange = (index) => {
    setPreset(index);
  };

  const buttonWidth = 1;
  const margin = 0.2;
  const totalButtonWidth = buttonWidth * scenes.length + margin * (scenes.length - 1);
  const startX = -totalButtonWidth / 2 + buttonWidth / 2;

  return (
    <group position={position}>
      {/* Preset Selection UI */}
      <Text
        fontSize={0.2}
        position={[0, 2, 0]}
        color="#f5f0f0"
        maxWidth={4}
        textAlign="center"
      >
        Select Preset
      </Text>
      {presets.map((preset, index) => (
        <group key={index} position={[startX + index * (buttonWidth + margin), 1.5, 0]}>
          <Plane
            args={[1, 0.5]}
            onPointerOver={() => setHoveredPreset(index)}
            onPointerOut={() => setHoveredPreset(null)}
            onClick={() => handlePresetChange(index)}
            
          >
            <meshBasicMaterial
              color={hoveredPreset === index ? '#ff0000' : '#ffffff'}
              transparent
              opacity={0.7}
              roughness={0.2}
              metalness={0.2}
            />
          </Plane>
          <Text
            fontSize={0.2}
            position={[0, 0, 0.01]}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {preset.name}
          </Text>
        </group>
      ))}

      {/* Model Switching UI */}
      <Plane args={[planeSize.width, planeSize.height]} position={[0, 0, -0.05]} rotation={[2, 0, 0]}>
        <meshBasicMaterial 
          color="#1a1a1a"
          opacity={0.5}
          transparent
          roughness={0.2}
          metalness={0.2}
          depthWrite={false} />
      </Plane>

      <Text
        fontSize={0.2}
        position={[0, 0, 0]}
        color="#f5f0f0"
        maxWidth={4}
        textAlign="center"
      >
        SELECT MODELS
      </Text>
      <Text
        fontSize={0.5}
        position={[0, 1, 0]}
        color="#f5f0f0"
        maxWidth={4}
        textAlign="center"
      >
        {scenes[slide].name}
      </Text>

      {scenes.map((scene, index) => (
        <group key={index} position={[startX + index * (buttonWidth + margin), -0.5, 0]}>
          <Plane
            args={[1, 0.5]}
            onPointerOver={() => setHoveredModel(index)}
            onPointerOut={() => setHoveredModel(null)}
            onClick={() => handleClick(index)}
          >
            <meshBasicMaterial
              color={hoveredModel === index ? '#ff0000' : '#ffffff'}
              transparent
              opacity={0.7}
              roughness={0.2}
              metalness={0.2}
            />
          </Plane>
          <Text
            fontSize={0.2}
            position={[0, 0, 0.01]}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {index + 1}
          </Text>
        </group>
      ))}
    </group>
  );
}

function App() {
  const {
    lights,
    globalExposure,
    addLight,
    updateLight,
    deleteLight,
    resetLights,
    toggleGlobalShadows,
    globalShadows,
    updateGlobalExposure,
    expandedLightId,
    setExpandedLightId,
  } = useLights();

  const [slide, setSlide] = useAtom(slideAtom);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [clonedObject, setClonedObject] = useState(null); // New state for the cloned object
  const sceneRef = useRef();
  const canvasRef = useRef();
  const [TexturesMaterials, setTexturesMaterials] = useAtom(TexturesMaterialsAtom);
  const [Light, setLights] = useAtom(LightsAtom);

  const store = createXRStore();

  const { handleObjectClick, handleObjectHover, highlightedMesh } = useObjectControls(setSelectedObject, setShowInfoPanel);

  const {
    handleColorChange,
    handleMaterialChange,
    handleWireframeToggle,
    handleTransparentToggle,
    handleOpacityChange,
    handleDepthTestToggle,
    handleDepthWriteToggle,
    handleAlphaHashToggle,
    handleSideChange,
    handleFlatShadingToggle,
    handleVertexColorsToggle,
    handleGeometryChange,
    handleSizeChange,
  } = useSceneControls(() => {});

  const handleClosePanel = () => {
    setShowInfoPanel(false);
    setSelectedObject(null);
  };

  const conditionalObjectHover = (mesh) => {
    if (TexturesMaterials) {
      handleObjectHover(mesh);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.gl) {
      const vrButton = VRButton.createButton(canvas.gl);
      document.body.appendChild(vrButton);

      return () => {
        document.body.removeChild(vrButton);
      };
    }
  }, [canvasRef]);

  const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));

  return (
    <>
      <Leva hidden />
      <Overlay sceneRef={sceneRef} store={store} />
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ logarithmicDepthBuffer: true, antialias: false }}
        dpr={[1, 1.5]}
        style={{ backgroundColor: '#15151a' }}
      >
        <XR store={store}>
          <Experience />
          <Scene
            ref={sceneRef}
            onObjectClick={handleObjectClick}
            onObjectHover={conditionalObjectHover}
            highlightedMesh={highlightedMesh}
            clonedObject={clonedObject} // Pass clonedObject to Scene
            {...scenes[slide]}
          />
          <Content3D position={[0, 1, -5]} />
          <Lights lights={lights} globalExposure={globalExposure} />
        </XR>
      </Canvas>

      <div className='ARVR'>
                <button onClick={() => store.enterAR()}>Enter AR</button>
                <button onClick={() => store.enterVR()}>Enter VR</button>
                </div>

      <MenuPanel />
      {selectedObject && TexturesMaterials && (
        <InfoPanel
          object={selectedObject}
          onClose={handleClosePanel}
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
        />
      )}
      {!TexturesMaterials}
      {Light && (
        <LightControls
          lights={lights}
          updateLight={updateLight}
          setExpandedLightId={setExpandedLightId}
          expandedLightId={expandedLightId}
          addLight={addLight}
          deleteLight={deleteLight}
          resetLights={resetLights}
          toggleGlobalShadows={toggleGlobalShadows}
          globalShadows={globalShadows}
          globalExposure={globalExposure}
          updateGlobalExposure={updateGlobalExposure}
        />
      )}
      {!Lights}
    </>
  );
}

export default App;
