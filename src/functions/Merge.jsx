import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as THREE from 'three';

export const mergeMeshes = (geometries, scene) => {
  const mergedGeometry = mergeGeometries(geometries);
  const mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
  scene.clear();
  scene.add(mergedMesh);
};
