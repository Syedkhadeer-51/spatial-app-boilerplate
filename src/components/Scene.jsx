import {
    AccumulativeShadows,
    Environment,
    Lightformer,
    OrbitControls,
    PerspectiveCamera,
    RandomizedLight,
    Sphere,
    useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { DEG2RAD } from "three/src/math/MathUtils";

export const Scene = ({ mainColor, path, ...props }) => {
    const { nodes, materials, scene } = useGLTF(path); //load 3d scene

    const [podiumScale, setPodiumScale] = useState(1);
    const [podiumPositionY, setPodiumPositionY] = useState(0);

    // Set initial podium scale
    useEffect(() => {
        const initialScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));
        const initialPositionY = -0.15 * initialScale; // Adjust podium's Y position based on scale
        setPodiumScale(initialScale);
        setPodiumPositionY(initialPositionY);
    }, []);

    useEffect(() => {
        // Go through each object to cast shadows
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Adjust podium position and scale based on viewport size
        const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));
        const podiumPositionY = -0.15 * ratioScale; // Adjust podium's Y position based on scale
        setPodiumScale(ratioScale);
        setPodiumPositionY(podiumPositionY);
    }, [scene]);

    return (
        <>
            <color attach="background" args={["#ffffff"]} />
            <group {...props} dispose={null}>
                {/* create a new camera for each scene and have orbit controls for each scene */}
                <PerspectiveCamera makeDefault position={[3, 3, 8]} near={0.5} />
                <OrbitControls
                    autoRotate
                    enablePan={false}
                    maxPolarAngle={DEG2RAD * 75}
                    minDistance={6}
                    maxDistance={10}
                    autoRotateSpeed={0.6}
                />

                <primitive object={scene} scale={podiumScale} />
                {/*Podium */}
                <mesh position={[0, podiumPositionY, 0]} receiveShadow>
                    <cylinderGeometry args={[2.5, 2.6, 0.14, 64]} />
                    <meshStandardMaterial color={"#555555"} metalness={0.8} roughness={0.4} />
                </mesh>

                <pointLight
                    position={[0, 5, 0]}
                    intensity={1.5}
                    distance={10}
                    decay={2}
                    castShadow
                />

                <ambientLight intensity={0.5} />
                <AccumulativeShadows
                    frames={100}
                    alphaTest={0.6}
                    scale={30}
                    position={[0, -0.008, 0]}
                    opacity={0.8}
                >
                    <RandomizedLight
                        amount={4}
                        radius={9}
                        intensity={10}
                        ambient={0.25}
                        position={[10, 5, 15]}
                    />
                </AccumulativeShadows>
                <Environment blur={0.8} background>
                    {/* sphere is the background */}
                    <Sphere scale={15}>
                        <meshBasicMaterial color={mainColor} side={THREE.BackSide} />
                    </Sphere>

                    <Lightformer
                        position={[0, 5, -2]}
                        form="ring"
                        intensity={1.5}
                        color="#AE7BE4"
                        scale={[10, 5]}
                        target={[0, 0, 0]}
                    />
                    <Lightformer
                        position={[0, 5, -2]}
                        form="rect"
                        intensity={2}
                        color="#F0CDCD"
                        scale={[10, 5]}
                        target={[0, 0, 0]}
                    />
                </Environment>
            </group>
        </>
    );
};

useGLTF.preload("/models/mcqueen.glb");
useGLTF.preload("/models/cruz.glb");
useGLTF.preload("/models/storm.glb");
