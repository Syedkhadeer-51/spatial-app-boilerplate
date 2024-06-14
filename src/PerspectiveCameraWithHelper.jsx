import { PerspectiveCamera, Helper } from '@react-three/drei';
import './App.css'
import { CameraHelper } from 'three';
import { useRef, useEffect,useState } from 'react';

export default function PerspectiveCameraWithHelper({ visible,name,...perspectiveCameraProps }) {
  const[visibility,setVisibility]=useState(true);
  useEffect(() => {
    if (visible[name] !== undefined) {
      setVisibility(visible[name]);
    }
  }, [visible, name]);  
  return (
      <PerspectiveCamera {...perspectiveCameraProps} name={name} >
      {visibility&&<Helper type={CameraHelper} />}
      </PerspectiveCamera>
      );
}