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

export default function App() {
  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);
  const [cameraNames, setCameraNames] = useState({});
  const [activeCamera, setActiveCamera] = useState('defaults'); // State to track active camera
  const [selectedCamera, SetSelectedCamera] = useState('defaults');
  const [modelPath, setModelPath] = useState(null);
  const [exports,setExport]=useState(false);
  const [toCloud,setToCloud] = useState(false);
  const [inputModelUrl, setInputModelUrl] = useState(''); // State for the input URL

  return (
    <><UiForFirebase modelPath={modelPath} setModelPath={setModelPath} setExport={setExport} setToCloud={setToCloud} inputModelUrl={inputModelUrl} setInputModelUrl={setInputModelUrl}/>
      <ColorPickerGrid setBackgroundColor={setBackgroundColor} setGridColor={setGridColor} gridHelperRef={gridHelperRef} />
      <CameraNamesList cameraNames={cameraNames} setCameraNames={setCameraNames} activeCamera={activeCamera} setActiveCamera={setActiveCamera} position={'absolute'} SetSelected={SetSelectedCamera} />
      <Canvas camera={{ position: [0, 3, 10] }}>
      <ambientLight />
      <CustomGizmoHelper orbitConrols={activeCamera}  />
      <Compression modelPath={modelPath} exports={exports} toCloud={toCloud} inputModelUrl={inputModelUrl} setToCloud={setToCloud}/> 
      <TraverseForCamera setCameraNames={setCameraNames} />
      <PerspectiveCameraWithHelper 
          name="PerspectiveCamera1" 
          visible={cameraNames} 
          active={activeCamera}
          position={[0, 1.3, 0]} 
          far={10} 
          gridColor={gridColor}
          selected={selectedCamera}
      />
      <OrthographicCameraWithHelper 
          name="OrthographicCamera1" 
          visible={cameraNames} 
          active={activeCamera}
          position={[0, 0, 5]} 
          far={16} 
          left={-5} 
          right={5} 
          top={5} 
          bottom={-5} 
          selected={selectedCamera}
        />
      <color attach="background" args={[backgroundColor]} />
      <gridHelper ref={gridHelperRef} args={[20, 20, gridColor, gridColor]} />
      <Stats />
      </Canvas>
    </>
  );
}
