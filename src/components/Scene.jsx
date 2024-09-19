import {
    Environment,
    Lightformer,
    OrbitControls,
    PerspectiveCamera,
    ContactShadows,
    MeshReflectorMaterial,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader, useThree } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import React, { forwardRef, useEffect } from "react";
import * as THREE from 'three';

export const Scene = forwardRef(({ onObjectClick, onObjectHover, clonedObject, path, ...props }, ref) => {
    const { gl, scene: threeScene } = useThree();
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    const { scene } = useLoader(GLTFLoader, path, (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        loader.setDRACOLoader(dracoLoader);
    });

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (name === "sci fi") {
                    child.scale.set(0.5, 0.5, 0.5); // Adjust to the desired scale
                }
            }
        });
    }, [scene]);

    useEffect(() => {
        if (ref) {
            ref.current = scene; // Assign scene to ref.current
        }
    }, [ref, scene]);

    const handlePointerUp = (e) => {
        e.stopPropagation();
        if (onObjectClick) {
            onObjectClick(e.object);
        }
    };

    const handlePointerOver = (e) => {
        e.stopPropagation();
        if (onObjectHover) {
            onObjectHover(e.object);
        }
    };

    const handlePointerOut = () => {
        if (onObjectHover) {
            onObjectHover(null);
        }
    };

    const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));

    return (
        <>
            <group {...props} dispose={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 12]} near={0.5} />
                <primitive
                    object={scene}
                    scale={1.5 * ratioScale}
                    rotation={[0, Math.PI / 1.5, 0]}
                    onPointerUp={handlePointerUp}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                />

                {/* Render the cloned object if it exists */}
                {clonedObject && (
                    <primitive
                        object={clonedObject}
                        scale={1.5 * ratioScale}
                        rotation={[0, Math.PI / 1.5, 0]}
                        position={[0, 0, 0]} // Adjust position if needed
                    />
                )}

                <hemisphereLight intensity={0.5} />

                <mesh scale={3 * ratioScale} position={[3 * ratioScale, -0.1, -0.8]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
                    <ringGeometry args={[0.9, 1, 4, 1]} />
                    <meshStandardMaterial color="white" roughness={0.75} />
                </mesh>
                <mesh scale={4 * ratioScale} position={[-3 * ratioScale, -0.1, -0.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
                    <ringGeometry args={[0.9, 1, 3, 1]} />
                    <meshStandardMaterial color="white" roughness={0.75} />
                </mesh>

                

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} scale={[100, 100, 1]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <MeshReflectorMaterial
                        blur={[400, 100]}
                        resolution={1024}
                        mixBlur={1}
                        mixStrength={60}
                        depthScale={1}
                        minDepthThreshold={0.85}
                        maxDepthThreshold={1}
                        color="#333333"
                        roughness={0.7}
                        metalness={0.5}
                    />
                </mesh>
                {/* <Effects /> */}
                <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={50} />
            </group>
        </>
    );
});
