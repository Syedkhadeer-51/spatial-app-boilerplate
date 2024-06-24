//final
import * as THREE from 'three';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

// Load font asynchronously
const loadFont = async (fontPath) => {
  const fontLoader = new FontLoader();
  return new Promise((resolve, reject) => {
    fontLoader.load(fontPath, resolve, undefined, reject);
  });
};

// Create text geometry
const createTextGeometry = (text, loadedFont, size) => {
  return new TextGeometry(text, {
    font: loadedFont,
    size,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
};

// Export scene to GLTF format and handle Blob creation
const exportToGLTF = (scene, callback) => {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (result) => {
      const output = JSON.stringify(result, null, 2);
      const blob = new Blob([output], { type: 'application/json' });
      callback(blob);
    },
    { binary: true }
  );
};

export const handleExportText = async ({
  text,
  font,
  size,
  color,
  transparency,
  scale,
  position,
  exportToLocal = false,
  exportToFirebase = false,
  setUploadProgress = null,
  onComplete = null,
}) => {
  try {
    const loadedFont = await loadFont(`/public/fonts/${font}.json`);

    const material = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: transparency,
    });

    const textGeometry = createTextGeometry(text, loadedFont, size);

    const textMesh = new THREE.Mesh(textGeometry, material);
    textMesh.position.set(position.x, position.y, position.z);
    textMesh.scale.set(scale[0], scale[1], scale[2]);

    const scene = new THREE.Scene();
    scene.add(textMesh);

    exportToGLTF(scene, (blob) => {
      if (exportToLocal) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '3d-text.glb';
        a.click();
        URL.revokeObjectURL(url);
      }

      if (exportToFirebase) {
        const storageRef = ref(storage, `texts/${Date.now()}-3d-text.glb`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed',
          (snapshot) => {
            if (setUploadProgress) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }
          },
          (error) => {
            console.error('Upload failed', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('Text data uploaded to Firebase:', downloadURL);
              if (onComplete) onComplete(downloadURL);
            });
          }
        );
      }

      if (onComplete && !exportToFirebase) onComplete();
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
