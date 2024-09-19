import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useControls } from "leva";
import { Scene } from "./Scene";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Array of three scenes with three different models
export const scenes = [
  {
    path: "public/models/free__lamborghini_terzo_millennio.glb",
    name: "Stradale",
  },
  {
    path: "public/models/356.glb",
    name: "sci fi",
  },
  {
    path: "public/models/nissan_gt-r_r35_gt_v2.glb",
    name: "GTR",
  },
  
];

export const scenesAtom = atom(scenes);
export const slideAtom = atom(0);
export const clonedObjectAtom = atom(null);

// Define presets for Environment
export const presets = [
  {
    name: "Sunset",
    environment: "sunset",
    skybox: "/models/sunsetSkybox.glb", // Adjust the path as needed
  },
  {
    name: "Night",
    environment: "night",
    skybox: "/models/nightSkybox.glb", // Adjust the path as needed
  },
  {
    name: "Studio",
    environment: "studio",
    skybox: "/models/studioSkybox.glb", // Adjust the path as needed
  },
];

export const presetAtom = atom(0); // Atom to manage selected preset

export const Experience = () => {
  const [slide] = useAtom(slideAtom);
  const [, setClonedObject] = useAtom(clonedObjectAtom);
  const [preset] = useAtom(presetAtom);
  const { scene } = useThree();

  // Load the skybox
  const loader = new GLTFLoader();
  loader.load(presets[preset].skybox, (gltf) => {
    const skybox = gltf.scene;
    scene.background = skybox;
  });

  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });

  const handleSetClonedObject = (clonedObject) => {
    setClonedObject(clonedObject);
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment preset={presets[preset].environment} />
      <Scene {...scenes[slide]} setClonedObject={handleSetClonedObject} />
      <OrbitControls />
    </>
  );
};
