import { PerspectiveCamera, Helper } from '@react-three/drei';
import { CameraHelper } from 'three';
export default function PerspectiveCameraWithHelper({ ...perspectiveCameraProps }) {
    return (
      <PerspectiveCamera {...perspectiveCameraProps} >
      <Helper type={CameraHelper}  />
    </PerspectiveCamera>
      );
}