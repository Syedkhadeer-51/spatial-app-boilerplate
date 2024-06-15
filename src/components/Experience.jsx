import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { Scene } from "./Scene";
import { slideAtom } from "./Overlay";

// Array of three scenes with three different models
export const scenes = [
  {
    path: "/models/gt3rs.glb",
    name: "911 GT3RS",
  },
  {
    path: "/models/918.glb",
    name: "918 spyder",
  },
  {
    path: "/models/carrera.glb",
    name: "Carrera",
  },
  
];

export const Experience = () => {
  const [slide] = useAtom(slideAtom);
  const viewport = useThree((state) => state.viewport);
  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment preset={"city"} />
        <Scene {...scenes[slide]}/>
    </>
  );
};
