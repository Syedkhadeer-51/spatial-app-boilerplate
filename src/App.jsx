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
import Dropdown from './dropdown.jsx';
import { ExportToCloud } from './exportToCloud.jsx';
import LocalImport from './localImport.jsx';


export default function App() {
  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);
  const [cameraNames, setCameraNames] = useState({});
  const [activeCamera, setActiveCamera] = useState('defaults'); // State to track active camera
  const [selectedCamera, SetSelectedCamera] = useState('defaults');
  const [modelPath, setModelPath] = useState(null);
  const [exports,setExport]=useState(false);
  const [modelUrls, setModelUrls] = useState([]);
  const [toCloud,setToCloud] = useState(false);
  const [inputModelUrl, setInputModelUrl] = useState(''); // State for the input URL

    
  

  return (
    <><div style={{position:'absolute', zIndex:'1',left:'100px',top:'7px'}}>
      <LocalImport setModelPath={setModelPath} setExport={setExport} setToCloud={setToCloud}/>
      <Dropdown modelUrls={modelUrls} setExport={setExport} setModelPath={setModelPath} setModelUrls={setModelUrls} setToCloud={setToCloud}/>
      <button onClick={()=>{setExport(true)}} style={{margin:'0px 20px'}} className='hover-button'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="download" className='icon'><g><g><rect width="16" height="2" x="4" y="18" rx="1" ry="1"></rect><rect width="4" height="2" x="3" y="17" rx="1" ry="1" transform="rotate(-90 5 18)"></rect><rect width="4" height="2" x="17" y="17" rx="1" ry="1" transform="rotate(-90 19 18)"></rect><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"></path><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"></path></g></g></svg>
      </button>
      <button onClick={()=>{setToCloud(true)}}>
      <img src="./firebase.png" alt="" style={{width:'20px'}}/>
      <span >Export to firebase</span>
      </button>
      <ExportToCloud modelUrls={modelUrls} inputModelUrl={inputModelUrl} setInputModelUrl={setInputModelUrl}/>
      </div>
      <ColorPickerGrid setBackgroundColor={setBackgroundColor} setGridColor={setGridColor} gridHelperRef={gridHelperRef} />
      <CameraNamesList cameraNames={cameraNames} setCameraNames={setCameraNames} activeCamera={activeCamera} setActiveCamera={setActiveCamera} position={'absolute'} SetSelected={SetSelectedCamera} />
      <Canvas camera={{ position: [0, 3, 10] }}>
      <ambientLight />
      <CustomGizmoHelper orbitConrols={activeCamera}  />
      <Compression modelPath={modelPath} exports={exports} toCloud={toCloud} inputModelUrl={inputModelUrl}/> 
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
