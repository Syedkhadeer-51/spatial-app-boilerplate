import { PerspectiveCamera, Helper } from '@react-three/drei';
import './App.css'
import { CameraHelper } from 'three';
import { useRef, useEffect,useState } from 'react';

export default function PerspectiveCameraWithHelper({ visible,name,active,...perspectiveCameraProps }) {
  const[visibility,setVisibility]=useState(true);
  const[cameraActive,setCameraActive]=useState(false);
  useEffect(()=>{
    if(active===name)
    setTimeout(() => {
      setCameraActive(true);
    }, 5);
    else{
      setCameraActive(false);
    }
    },[active])
  useEffect(() => {
    if (visible[name] !== undefined) {
      setVisibility(visible[name]);
    }
  }, [visible, name]);  
  return (
      <PerspectiveCamera {...perspectiveCameraProps} name={name} makeDefault={cameraActive}>
      {visibility&&<Helper type={CameraHelper} />}
      </PerspectiveCamera>
      );
}