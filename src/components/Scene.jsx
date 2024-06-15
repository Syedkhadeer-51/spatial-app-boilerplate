import {
    Environment,
    Lightformer,
    OrbitControls,
    PerspectiveCamera,
    ContactShadows,
    MeshReflectorMaterial,
    Reflector,
    useGLTF,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import React, { useEffect } from "react";
import {Effects} from "./Effect"

export const Scene = ({path, ...props }) => {
    const { scene } = useLoader(GLTFLoader,path, (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
        loader.setDRACOLoader(dracoLoader)
      }) //load 3d scene


    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

    }, [scene]);
    const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));

    return (
        <>
            <group {...props} dispose={null}>
                <PerspectiveCamera makeDefault position={[0,0,12]} near={0.5} />
                <primitive object={scene} scale={1.5*ratioScale} rotation={[0,Math.PI/1.5,0]}/>
                
                <hemisphereLight intensity={0.5} />
                <ContactShadows resolution={1024} frames={1} position={[0,0, 0]} scale={15} blur={0.7} opacity={1} far={25} />

                
                <mesh scale={3*ratioScale} position={[3*ratioScale, -0.1, -0.8]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
                    <ringGeometry args={[0.9, 1, 4, 1]} />
                    <meshStandardMaterial color="white" roughness={0.75}/>
                </mesh>
                <mesh scale={4*ratioScale} position={[-3*ratioScale, -0.1, -0.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
                    <ringGeometry args={[0.9, 1, 3, 1]} />
                    <meshStandardMaterial color="white" roughness={0.75} />
                </mesh>
                

                <Environment background>
                    
                    <color attach="background" args={["#15151a"]} />

                    <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
                    <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
                    {/* Key */}
                    {/* <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 7, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} /> */}
                    
                </Environment>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} scale={[100, 100, 1]}>
                    <planeGeometry args={[100, 100]} />
                    <MeshReflectorMaterial 
                        blur={[400, 100]}
                        resolution={1024}
                        mixBlur={1}
                        mixStrength={60}
                        depthScale={1}
                        minDepthThreshold={0.85}
                        maxDepthThreshold={1}
                        color="#101010"
                        roughness={0.7}
                        metalness={0.5}
                    />
                </mesh>
                <Effects />
                <OrbitControls enablePan={false} enableZoom={true} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={10}/>
                
            </group>
        </>
    );
};
