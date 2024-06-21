import { PerspectiveCamera, useHelper } from '@react-three/drei';
import { CameraHelper } from 'three';
import './App.css';
import { useRef, useEffect, useState } from 'react';

class CustomColor {
  constructor(colorString) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString);
    if (match) {
      this.r = parseInt(match[1], 16)/255;
      this.g = parseInt(match[2], 16)/255;
      this.b = parseInt(match[3], 16)/255;
    } else {
      throw new Error("Invalid color string");
    }
  }
}


export default function PerspectiveCameraWithHelper({ visible, name, active,gridColor,selected, ...perspectiveCameraProps }) {
  const [visibility, setVisibility] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const cameraRef = useRef();
  
  const helper = useHelper(visibility&&cameraRef, CameraHelper);

  useEffect(() => {
    
    if (helper && helper.current instanceof CameraHelper) {
      const colorFrustum = new CustomColor(selected==name ? '#ffff00' : '#ff0000');
      const colorCone = new CustomColor('#ff0000');
      const colorUp = new CustomColor('#00aaff');
      const colorTarget = new CustomColor('#ffffff');
      const colorCross = new CustomColor('#333333');
      helper.current.setColors(colorFrustum, colorCone, colorUp, colorTarget, colorCross);
    }
  }, [helper,gridColor,visibility,selected]); 

  useEffect(() => {
    if (active === name) {
      setTimeout(() => {
        setCameraActive(true);
      }, 5);
    } else {
      setCameraActive(false);
    }
  }, [active, name]);

  useEffect(() => {
    if (visible[name] !== undefined) {
      setVisibility(visible[name]);
    }
  }, [visible, name]);

  return (
    <PerspectiveCamera {...perspectiveCameraProps} name={name}  ref={cameraRef} makeDefault={cameraActive}>
    </PerspectiveCamera>
  );
}