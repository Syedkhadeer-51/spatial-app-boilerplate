import { saveAs } from 'file-saver';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export const exportModel = (scene, options) => {
  const exporter = new GLTFExporter();
  try {
    exporter.parse(
      scene,
      (result) => {
        const output = options.binary ? result : JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: options.binary ? 'application/octet-stream' : 'application/json' });
        saveAs(blob, 'scene.glb');
      },
      (error) => {
        console.error('An error occurred during parsing', error);
      },
      options
    );
  } catch (error) {
    console.error('An unexpected error occurred during export:', error);
  }
};
