import { GizmoViewport, OrbitControls} from '@react-three/drei'
import { GizmoHelper } from '@react-three/drei'
export default function CustomGizmoHelper()
{
    return(
        <>
        <OrbitControls makeDefault />
         <GizmoHelper alignment="top-right">
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
         </GizmoHelper>
         </>
    )
}