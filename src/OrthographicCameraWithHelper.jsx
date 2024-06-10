import { OrthographicCamera, Helper } from '@react-three/drei';
import { CameraHelper } from 'three';
export default function PerspectiveCameraWithHelper({ ...perspectiveCameraProps }) {
    return (
      <OrthographicCamera {...perspectiveCameraProps} >
      <Helper type={CameraHelper}  />
      </OrthographicCamera>
      );
}