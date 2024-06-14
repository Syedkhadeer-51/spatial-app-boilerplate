// import { Canvas } from '@react-three/fiber'
// import './App.css'
// import { OrbitControls } from '@react-three/drei'


// export default function App() {
//   return (
//     <>
//       <Canvas camera={{ position: [-8, 5, 8] }}>
//         <ambientLight intensity={0.1} />
//         <directionalLight color="red" position={[0, 0, 5]} />
//         <mesh scale={3}>
//           <boxGeometry />
//           <meshStandardMaterial />
//         </mesh>
//         <OrbitControls />
//       </Canvas>
//     </>
//   )
// }

//---------------------------------------


// import React from 'react';
// import { Canvas, useLoader } from '@react-three/fiber';
// import { OrbitControls, Stats } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import './App.css';

// function Model() {
//   // Load the GLB model
//   const gltf = useLoader(GLTFLoader, '/heavy__cs2_agent_model_t.glb'); // Ensure the path is correct

//   return <primitive object={gltf.scene} />;
// }

// export default function App() {
//   return (
//     <Canvas camera={{ position: [-8, 5, 8] }}>
//       <ambientLight intensity={0.1} />
//       <directionalLight color="red" position={[0, 0, 5]} />
//       <Model />
//       <OrbitControls />
//       <Stats /> {/* Add the stats panel */}
//     </Canvas>
//   );
// 


//------------------------------

// import React, { Suspense } from 'react';
// import { Canvas, useLoader } from '@react-three/fiber';
// import { OrbitControls, Stats } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import './App.css';

// function DracoModel() {
//   // Create a new instance of DRACOLoader
//   const dracoLoader = new DRACOLoader();
  
//   // Set the path to the Draco decoder files using a CDN
//   dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three/examples/js/libs/draco/');

//   // Create a new instance of GLTFLoader and set DRACOLoader
//   const gltfLoader = new GLTFLoader();
//   gltfLoader.setDRACOLoader(dracoLoader);

//   // Load the GLB model using useLoader hook
//   const gltf = useLoader(GLTFLoader, './compressed_model.glb'); // Replace with actual path

//   return <primitive object={gltf.scene} />;
// }

// export default function App() {
//   return (
//     <Canvas camera={{ position: [-8, 5, 8]}}>
//       <ambientLight intensity={0.1} />
//       <directionalLight color="red" position={[0, 0, 5]} />
//       <Suspense fallback={null}>
//         <DracoModel />
//       </Suspense>
//       <OrbitControls />
//       <Stats />
//     </Canvas>
//   );
// }


//------------------------

import React, { useRef } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import './App.css';

function DracoModel() {
  const dracoLoader = useRef(new DRACOLoader());

  // Set the path to the Draco decoder files using a CDN
  dracoLoader.current.setDecoderPath('https://cdn.jsdelivr.net/npm/three/examples/js/libs/draco/');

  const gltfLoader = useRef(new GLTFLoader());
  gltfLoader.current.setDRACOLoader(dracoLoader.current);

  // Load the GLB model
  const gltf = useLoader(GLTFLoader, './compressed_model.glb'); // Replace with actual path

  return <primitive object={gltf.scene} />;
}

function DownloadButton() {
  const handleDownload = () => {
    const canvas = document.querySelector('canvas'); // Assuming there's only one canvas
    const imageUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = imageUrl;
    link.download = 'canvas_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={handleDownload}>Download Image</button>;
}

export default function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [-8, 5, 8]}}>
       <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
        <DracoModel />
        <OrbitControls />
        <Stats />
        {/* DownloadButton is outside the Canvas */}
      </Canvas>
      <DownloadButton />
    </div>
  );
}

//----------------------------------



