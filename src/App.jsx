import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import SceneInit from './lib/SceneInit';
import { GUI } from 'dat.gui';

function App() {
  const textMeshRef = useRef(null);
  const sceneRef = useRef(null);
  const fontRef = useRef(null);
  const materialRef = useRef(null); // To store material with transparency

  useEffect(() => {
    const initThreeJs = () => {
      const test = new SceneInit('myThreeJsCanvas');
      test.initialize();
      test.animate();
      sceneRef.current = test.scene;

      const gui = new GUI();
      const textControls = {
        text: 'TwinTitans',
        size: 20,
        height: 3,
        positionX: -75,
        positionY: -11,
        color: '#5f9ea0',
        opacity: 1,
        scale: 1,
        font: 'droid', // Default font
        exportFormat: 'stl', // Default export format
      };

      const fonts = {
        droid: 'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
        helvetiker: 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
        optimer: 'node_modules/three/examples/fonts/optimer_bold.typeface.json',
        gentilis: 'node_modules/three/examples/fonts/gentilis_regular.typeface.json',
        gentilis_bold: 'node_modules/three/examples/fonts/gentilis_bold.typeface.json',
      };

      const fontLoader = new FontLoader();

      fontLoader.load(fonts[textControls.font], (loadedFont) => {
        fontRef.current = loadedFont;
        materialRef.current = new THREE.MeshPhongMaterial({
          color: new THREE.Color(textControls.color),
          transparent: true,
          opacity: textControls.opacity,
        });
        createTextMesh(textControls);
      });

      gui.add(textControls, 'text').onChange((value) => updateTextGeometry(value));
      gui.add(textControls, 'size', 1, 100).onChange(() => updateTextGeometry(textControls.text));
      gui.add(textControls, 'height', 1, 20).onChange(() => updateTextGeometry(textControls.text));
      gui.add(textControls, 'positionX', -100, 100).onChange((value) => textMeshRef.current.position.x = value);
      gui.add(textControls, 'positionY', -100, 100).onChange((value) => textMeshRef.current.position.y = value);
      gui.addColor(textControls, 'color').onChange((value) => {
        textControls.color = value;
        materialRef.current.color.set(value);
        materialRef.current.needsUpdate = true; // Ensure material update
      });
      gui.add(textControls, 'opacity', 0, 1).onChange((value) => {
        textControls.opacity = value;
        materialRef.current.opacity = value;
        materialRef.current.needsUpdate = true; // Ensure material update
      });
      gui.add(textControls, 'scale', 0.1, 3).onChange((value) => {
        textControls.scale = value;
        textMeshRef.current.scale.set(value, value, 1);
      });
      gui.add(textControls, 'font', Object.keys(fonts)).onChange((value) => {
        loadFont(fonts[value]);
      });
      gui.add(textControls, 'exportFormat', ['stl', 'gltf', 'glb', 'obj']).onChange((value) => {
        textControls.exportFormat = value;
      }).name('Export Format');

      gui.add({ exportModel: () => exportModel(textControls.exportFormat) }, 'exportModel').name('Export');

      const loadFont = (fontPath) => {
        fontLoader.load(fontPath, (loadedFont) => {
          fontRef.current = loadedFont;
          updateTextGeometry(textControls.text);
        });
      };

      const createTextMesh = (controls) => {
        const textGeometry = new TextGeometry(controls.text, {
          size: controls.size,
          height: controls.height,
          font: fontRef.current,
        });
        const textMesh = new THREE.Mesh(textGeometry, materialRef.current);
        textMesh.position.set(controls.positionX, controls.positionY, 0);
        textMesh.scale.set(controls.scale, controls.scale, 1);
        sceneRef.current.add(textMesh);
        textMeshRef.current = textMesh;
      };

      const updateTextGeometry = (text) => {
        if (!textMeshRef.current || !fontRef.current) return;
        const newGeometry = new TextGeometry(text, {
          size: textControls.size,
          height: textControls.height,
          font: fontRef.current,
        });
        textMeshRef.current.geometry.dispose();
        textMeshRef.current.geometry = newGeometry;
      };

      const exportModel = (format) => {
        if (!textMeshRef.current) return;

        let exporter;
        let data;
        let mimeType;
        let fileName;

        switch (format) {
          case 'stl':
            exporter = new STLExporter();
            data = exporter.parse(textMeshRef.current);
            mimeType = 'application/octet-stream';
            fileName = 'text_geometry.stl';
            break;
          case 'gltf':
          case 'glb':
            exporter = new GLTFExporter();
            exporter.parse(textMeshRef.current, (result) => {
              const isBinary = format === 'glb';
              if (isBinary) {
                data = result;
                mimeType = 'application/octet-stream';
                fileName = 'text_geometry.glb';
              } else {
                data = JSON.stringify(result);
                mimeType = 'application/json';
                fileName = 'text_geometry.gltf';
              }
              saveData(data, mimeType, fileName);
            }, { binary: format === 'glb' });
            return; // Skip saving data here, as it's done in the callback
          case 'obj':
            exporter = new OBJExporter();
            data = exporter.parse(textMeshRef.current);
            mimeType = 'application/octet-stream';
            fileName = 'text_geometry.obj';
            break;
          default:
            return;
        }

        saveData(data, mimeType, fileName);
      };

      const saveData = (data, mimeType, fileName) => {
        const blob = new Blob([data], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      };

      return () => {
        gui.destroy();
      };
    };

    initThreeJs();

  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
