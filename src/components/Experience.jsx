import {
  CameraControls,
  Grid,
  Environment,
  MeshDistortMaterial,
  RenderTexture,
  useCursor,
  OrbitControls
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { homeAtom, slideAtom } from "./Overlay";
import { Scene } from "./Scene";
import { dispAtom } from "./Overlay";
import { a, useSpring } from "@react-spring/three";
//import Background from "three/examples/jsm/renderers/common/Background.js";

// Array of three scenes with three different models
export const scenes = [
  {
    path: "/models/mcqueen.glb",
    mainColor: "#FFAE9E",
    name: "Lightning McQueen",
    description: "Focus. Speed. I am Speed. One winner, forty two losers. I eat losers for breakfast.",
  },
  {
    path: "/models/cruz.glb",
    mainColor: "#FCEE95",
    name: "Cruz Ramirez",
    description: "I am so excited that I get to train you. These young guys are great and all, but I like a challenge.",
  },
  {
    path: "/models/storm.glb",
    mainColor: "#9BC7F6",
    name: "Jackson Storm",
    description: "You have no idea what a pleasure it is for me to finally beat you.",
  },
];

const CameraHandler = ({ slideDistance, sphere }) => {
  const viewport = useThree((state) => state.viewport);
  const [slide, setSlide] = useAtom(slideAtom); // Slide value gives the slide number
  const lastSlide = useRef(0);
  const [home, setHome] = useAtom(homeAtom);
  const CameraControlsRef = useRef();

  // Controls for camera's distance from the scene
  const { dollyDistance } = useControls({
    dollyDistance: {
      value: 10,
      min: 0,
      max: 50,
    },
  });

  const moveToSlide = async () => {
    // Zoom out
    await CameraControlsRef.current.setLookAt(
      lastSlide.current * (viewport.width + slideDistance),
      3,
      dollyDistance,
      lastSlide.current * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    // Move camera on x-axis
    await CameraControlsRef.current.setLookAt(
      (slide + 1) * (viewport.width + slideDistance),
      1,
      dollyDistance,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    // Go in front of next slide on y axis
    await CameraControlsRef.current.setLookAt(
      slide * (viewport.width + slideDistance),
      0,
      5,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  const panOut = async () => {
    await CameraControlsRef.current.setLookAt(
      (viewport.width * (scenes.length - 1) + slideDistance * (scenes.length - 1)) / 2, // Look at center of the three scenes
      viewport.height / 2, // Y position is also centered 
      30, // Pan out on the z axis
      (viewport.width * (scenes.length - 1) + slideDistance * (scenes.length - 1)) / 2, // We're still looking at the center of three slides 
      0,
      0,
      true
    );
  };

  const panIn = async () => {
    // await CameraControlsRef.current.setLookAt(
    //   slide * (viewport.width + slideDistance),
    //   0,
    //   30,
    //   slide * (viewport.width + slideDistance),
    //   0,
    //   0,
    //   true
    // );
    await CameraControlsRef.current.setLookAt(
      slide * (viewport.width + slideDistance),
      0,
      5,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  const sphereSlidePan = async () => {
    await CameraControlsRef.current.setLookAt(
      (viewport.width * (scenes.length - 1) + slideDistance * (scenes.length - 1)) / 2,
      0,
      30,
      sphere * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    await CameraControlsRef.current.setLookAt(
      sphere * (viewport.width + slideDistance),
      0,
      5,
      sphere * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  // Camera animations on mount and when viewport or home state changes
  useEffect(() => {
    const resetTimeout = setTimeout(() => {
      
      if (home) {
        panOut();
      } else {
        panIn();
      }
    }, 2000);
    return () => clearTimeout(resetTimeout);
  }, [slide, home]);

  useEffect(() => {
    if (home) return;
    // When we open the application we don't want to animate 
    // So we check if we're at home or on same slide 
    // If it's a different slide we call moveToSlide and assign lastSlide.current to slide
    if (lastSlide.current === slide) {
      return;
    }
    if(true){
      moveToSlide(); }
    lastSlide.current = slide;
  }, [slide, home]);

  useEffect(() => {
    if (sphere !== null) {
      //setHome(false);
      //setSlide(sphere);
      sphereSlidePan();
    }
  }, [sphere]);

  return (
    <CameraControls
      ref={CameraControlsRef}
      touches={{
        one: 0,
        two: 0,
        three: 0,
      }}
      mouseButtons={{
        left: 0,
        middle: 0,
        right: 0,
      }}
    />
  );
};

export const Experience = () => {
  const [sphere, setSphere] = useState(null);
  const viewport = useThree((state) => state.viewport);
  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });

  const [, setSlide] = useAtom(slideAtom);
  const [, setHome] = useAtom(homeAtom);
  const [, setHomeDisp] = useAtom(dispAtom);

  const handleSphereClick = (index) => {
    setSphere(index);
    setHome(false);
    setHomeDisp(true);
    setSlide(index);
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment preset={"city"} />
      <OrbitControls/>
      <group>
        {scenes.map((scene, index) => (
          <Sphere
            key={index}
            index={index}
            viewport={viewport}
            slideDistance={slideDistance}
            scene={scene}
            handleSphereClick={handleSphereClick}
          />
        ))}
      </group>
      <CameraHandler slideDistance={slideDistance} sphere={sphere} />
      <Grid
        position-y={-viewport.height / 2}
        sectionSize={1}
        sectionColor={"red"}
        sectionThickness={1}
        cellSize={0.5}
        cellColor={"#000000"}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
      />

      {/* map through all scenes to render a component for each of them */}
      {scenes.map((scene, index) => (
        <mesh
          key={index}
          position={[index * (viewport.width + slideDistance), 0, 0]}
        >
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial toneMapped={false}>
            <RenderTexture attach="map">
              <Scene {...scene} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};

const Sphere = ({ index, viewport, slideDistance, scene, handleSphereClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer');

  // Define spring animation for scale
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 20 },
  });

  return (
    <a.mesh
      position-x={index * (viewport.width + slideDistance)}
      position-y={viewport.height / 2 + 1.5}
      scale={scale} // Apply animated scale
      onClick={() => handleSphereClick(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.7, 64, 64]} />
      <MeshDistortMaterial color={scene.mainColor} speed={3} />
    </a.mesh>
  );
};
