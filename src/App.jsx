import { Canvas} from '@react-three/fiber'
import './App.css'
import CustomGizmoHelper from './CustomGizmoHelper.jsx';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper.jsx';
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import  {Stats} from '@react-three/drei'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useState,useEffect,useRef } from 'react';
import { saveAs } from 'file-saver';
import ColorPickerGrid from './ColorPicker.jsx';


// Helper function to fetch file size

export default function App() {
  
  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);

  const path = "./model5.glb"; // Ensure this path is correct and the file is present
  const gltf = useLoader(GLTFLoader, path, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });
 
  return (
    <>
        <ColorPickerGrid setBackgroundColor={setBackgroundColor} setGridColor={setGridColor} gridHelperRef={gridHelperRef} />
      <Canvas camera={{position: [0, 0, 10]} }>
        <ambientLight/>
      <CustomGizmoHelper/>
      <primitive object={gltf.scene}/>
     <PerspectiveCameraWithHelper position={[5, 4, 15]} far={10}/>
     <color attach="background" args={[backgroundColor]} />
        <gridHelper ref={gridHelperRef} args={[20, 20, gridColor, gridColor]} />
      <Stats/>
      </Canvas>
    </>
  );
}