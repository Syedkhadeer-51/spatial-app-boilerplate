import { Canvas} from '@react-three/fiber'
import './App.css'
import  {Stats} from '@react-three/drei'
import { useState,useRef } from 'react';
import Compression from './Compression.jsx';
import { OrbitControls } from '@react-three/drei';
export default function App() {

  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);

  
 
  return (
    <>
      <Canvas camera={{position: [0, 3, 10]} }>
        <ambientLight/>
        <Compression/>
        <OrbitControls/>
      <Stats/>
      </Canvas>
    </>
  );
}