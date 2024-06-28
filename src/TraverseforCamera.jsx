import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { cameraNames } from "./atoms";
import { useAtom } from "jotai";
export default function TraverseForCamera() {
    const [CameraNames,setCameraNames] = useAtom(cameraNames);
    const { scene } = useThree();
  
    useEffect(() => {
      const cameras = {};
      scene.traverse((object) => {
        if (object.isCamera) {
          cameras[object.name]=true;
        }
      });
      setCameraNames(cameras);
    }, [scene, setCameraNames]);
   return null;
    
  }