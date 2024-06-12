import React from "react";
import { useAtom } from "jotai";
import { Canvas } from "@react-three/fiber"; // Import Canvas
import { Scene } from "./Scene";
import { slideAtom } from "./Overlay";

const modelPaths = [
  "/models/mcqueen.glb",
  "/models/cruz.glb",
  "/models/storm.glb",
];

export const Experience = () => {
  const [slide] = useAtom(slideAtom);

  return (
    <Canvas> {/* Wrap your components in a Canvas component */}
      <Scene backgroundScene /> {/* Render the background scene */}
      <Scene path={modelPaths[slide]} /> {/* Render the current model */}
    </Canvas>
  );
};
