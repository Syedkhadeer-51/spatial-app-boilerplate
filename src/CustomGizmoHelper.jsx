import { GizmoViewport, OrbitControls} from '@react-three/drei'
import { GizmoHelper } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { activeCamera } from './atoms';
import { useAtom } from 'jotai';
export default function CustomGizmoHelper()
{
  const [active,setActive]=useState(true);
  const [ActiveCamera,setActiveCamera] = useAtom(activeCamera);

    useEffect(() => {
      if(ActiveCamera==='defaults')
        {
      setTimeout(() => {
        setActive(true);
      }, 5);}
      else{
        setActive(false);
      }
    }, [ActiveCamera]);
    return(
        <>
        {active && <OrbitControls makeDefault enabled={active}/>}
         <GizmoHelper alignment="top-right">
         {active && <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />}
         </GizmoHelper>
         </>
    )
}