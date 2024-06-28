import { Canvas } from '@react-three/fiber';
import './App.css';
import CustomGizmoHelper from './CustomGizmoHelper.jsx';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper.jsx';
import { Stats } from '@react-three/drei';
import { useState, useRef } from 'react';
import ColorPickerGrid from './ColorPicker.jsx';
import OrthographicCameraWithHelper from './OrthographicCameraWithHelper.jsx';
import CameraNamesList from './CameraNamesList.jsx';
import TraverseForCamera from './TraverseforCamera.jsx';
import Compression from './Compression.jsx';
import UiForFirebase from './uiForFirebase.jsx';
import BackgroundColorWithGrid from './BackgroundColorWithGrid.jsx';

export default function App() {


  return (
    <>
    <UiForFirebase/>
      <ColorPickerGrid />
      <CameraNamesList position={'absolute'} />
      <Canvas camera={{ position: [0, 3, 10] }}>
      <ambientLight />
      <CustomGizmoHelper />
      <Compression /> 
      <TraverseForCamera />
      <PerspectiveCameraWithHelper name="PerspectiveCamera1" position={[0, 1.3, 0]} far={10} />
      <OrthographicCameraWithHelper name="OrthographicCamera1" position={[0, 0, 5]} far={16} left={-5} right={5} top={5} bottom={-5} />
      <BackgroundColorWithGrid />
      <Stats />
      </Canvas>
    </>
  );
}
