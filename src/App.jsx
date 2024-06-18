import { Canvas ,useThree} from '@react-three/fiber';
import './App.css';
import CustomGizmoHelper from './CustomGizmoHelper.jsx';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper.jsx';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Stats } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useState, useRef,useEffect } from 'react';
import ColorPickerGrid from './ColorPicker.jsx';
import OrthographicCameraWithHelper from './OrthographicCameraWithHelper.jsx';
import CameraNamesList from './CameraNamesList.jsx';
import TraverseForCamera from './TraverseforCamera.jsx';

export default function App() {
  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);
  const [cameraNames, setCameraNames] = useState({});
  const [activeCamera, setActiveCamera] = useState('defaults'); // State to track active camera


  const path = "./model6.glb"; // Ensure this path is correct and the file is present
  const gltf = useLoader(GLTFLoader, path, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <>
      <ColorPickerGrid setBackgroundColor={setBackgroundColor} setGridColor={setGridColor} gridHelperRef={gridHelperRef} />
      <CameraNamesList cameraNames={cameraNames} setCameraNames={setCameraNames} activeCamera={activeCamera} setActiveCamera={setActiveCamera}  position={'absolute'} />
      <Canvas camera={{ position: [0, 3, 10]}}>
        <ambientLight />
        <CustomGizmoHelper orbitConrols={activeCamera}/>
        <primitive object={gltf.scene} />
        <TraverseForCamera setCameraNames={setCameraNames} />
        <PerspectiveCameraWithHelper 
          name="PerspectiveCamera1" 
          visible={cameraNames} 
          active={activeCamera}
          position={[0, 1.3, 0]} 
          far={10} 
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
        />
        <color attach="background" args={[backgroundColor]} />
        <gridHelper ref={gridHelperRef} args={[20, 20, gridColor, gridColor]} />
        <Stats />
      </Canvas>
    </>
  );
}
