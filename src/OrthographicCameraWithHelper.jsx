import { OrthographicCamera, Helper } from '@react-three/drei';
import './App.css'
import { CameraHelper } from 'three';
import { useEffect,useState } from 'react';
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
      <OrthographicCamera {...perspectiveCameraProps} name={name} makeDefault={cameraActive} >
      {visibility&&<Helper type={CameraHelper} args={[1,'royalblue']} />}
      </OrthographicCamera>
      );
}

