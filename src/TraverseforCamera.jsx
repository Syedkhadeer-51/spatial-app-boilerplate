import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
export default function TraverseForCamera({ setCameraNames }) {
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