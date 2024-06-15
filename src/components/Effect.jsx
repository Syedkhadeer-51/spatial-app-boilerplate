import { useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom, LUT } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { LUTCubeLoader } from 'postprocessing'

export function Effects() {
  const texture = useLoader(LUTCubeLoader, '/F-6800-STD.cube')
  const { enabled, bloomIntensity } = useControls({
    enabled: true,
    bloomIntensity: { value: 1.75, min: 0, max: 5 }
  })
  return (
    enabled && (
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={bloomIntensity} />
        <LUT lut={texture} />
      </EffectComposer>
    )
  )
}
