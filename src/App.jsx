// import React, { Suspense, useEffect, useRef, forwardRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


// const useDracoGLTF = (url) => {
//   const { scene } = useGLTF(url, true, (loader) => {
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
//     loader.setDRACOLoader(dracoLoader);
//   });
//   return { scene };
// };

// const Model = forwardRef(({ url }, ref) => {
//   const { scene } = useDracoGLTF(url);
//   return <primitive object={scene} ref={ref} />;
// });

// export default function App() {
//   const modelRef = useRef();

//   const handleExport = () => {
//     if (modelRef.current) {
//       const exporter = new GLTFExporter();
//       exporter.parse(
//         modelRef.current,
//         (result) => {
//           const output = JSON.stringify(result, null, 2);
//           const blob = new Blob([output], { type: 'application/json' });
//           const url = URL.createObjectURL(blob);
//           const link = document.createElement('a');
//           link.href = url;
//           link.download = 'compressed-model.glb';
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         },
//         { binary: true }
//       );
//     }
//   };

//   return (
//     <>
//       <Canvas>
//         <ambientLight intensity={1.5} />
//         <pointLight position={[10, 10, 10]} />
//         <Suspense fallback={null}>
//           <Model url="src/assets/Shed.glb" ref={modelRef} />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//       <button onClick={handleExport} style={{ position: 'absolute', top: '10px', left: '10px' }}>
//         Export Model
//       </button>
//     </>
//   );
// }

import React, { Suspense, useRef, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const useDracoGLTF = (url) => {
  const { scene } = useGLTF(url, true, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
  });
  return { scene };
};

const Model = forwardRef(({ url }, ref) => {
  const { scene } = useDracoGLTF(url);
  return <primitive object={scene} ref={ref} />;
});

export default function App() {
  const modelRef = useRef();

  const handleExport = () => {
    if (modelRef.current) {
      const exporter = new GLTFExporter();
      exporter.parse(
        modelRef.current,
        (result) => {
          const output = JSON.stringify(result, null, 2);
          const blob = new Blob([output], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'compressed-model.glb';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        { binary: true }
      );
    }
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model url="Models/(placeHolder)MakeSureFileIsBiggerThan80MB.glb" ref={modelRef} />
        </Suspense>
        <OrbitControls />
        <Stats />
      </Canvas>
      <button onClick={handleExport} style={{ position: 'absolute', top: '100px', left: '100px' }}>
        Export Model
      </button>
    </>
  );
}
