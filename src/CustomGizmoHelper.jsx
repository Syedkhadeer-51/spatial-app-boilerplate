import { GizmoViewport, OrbitControls} from '@react-three/drei'
import { GizmoHelper } from '@react-three/drei'
import { useEffect, useState } from 'react'
export default function CustomGizmoHelper({orbitConrols})
{
    const[active,setActive]=useState(true);
    useEffect(() => {
        setActive(orbitConrols);
      }, [orbitConrols]);
    return(
        <>
        {active && <OrbitControls makeDefault enabled={active}/>}
         <GizmoHelper alignment="top-right">
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
         </GizmoHelper>
         </>
    )
}