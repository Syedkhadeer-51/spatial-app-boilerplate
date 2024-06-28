import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import { GUI } from 'dat.gui';
import SceneInit from './assets/SceneInit';

function App() {
  const textMeshRef = useRef(null);
  const sceneRef = useRef(null);
  const fontRef = useRef(null);
  const materialRef = useRef(null);
  const [language, setLanguage] = useState('english');
  const [gui, setGui] = useState(null);

  useEffect(() => {
    const initThreeJs = async () => {
      const test = new SceneInit('myThreeJsCanvas');
      test.initialize();
      test.animate();
      sceneRef.current = test.scene;

      const textControls = {
        text: language === 'kannada' ? 'ನಮಸ್ಕಾರ' : language === 'hindi' ? 'नमस्ते' : 'TwinTitans',
        size: 20,
        height: 3,
        positionX: -75,
        positionY: -11,
        color: '#5f9ea0',
        opacity: 1,
        scale: 1,
        font: language === 'kannada' ? 'noto_serif_kannada' : language === 'hindi' ? 'tiro_devanagari_hindi' : 'droid',
        exportFormat: 'stl',
        language: language,
      };

      const fonts = {
        droid: '/fonts/droid_serif_regular.typeface.json',
        noto_serif_kannada: '/fonts/Noto_Serif_Kannada_Regular.json',
        tiro_devanagari_hindi: '/fonts/Tiro Devanagari Hindi_Regular.json',
        akshar_hindi_unicode: '/fonts/Akshar_hindi_Unicode_Regular.json',
        Arial: '/fonts/Arial_Regular.json',
        ComicSansMS: '/fonts/Comic Sans MS_Regular.json',
        Gentilis: '/fonts/gentilis_bold.typeface.json',
        Helvetiker: '/fonts/helvetiker_regular.typeface.json',
        JetBrains: '/fonts/JetBrains Mono_Regular.json',
        Lobster: '/fonts/Lobster_regular.json',
        Moderna: '/fonts/MgOpen Moderna_BoldOblique.json',
        Optimer: '/fonts/optimer_regular.typeface.json',
        Oswald: '/fonts/Oswald_Regular.json',
        AnekKannadaMedium: '/fonts/Anek Kannada Medium_Regular.json',
        Benne: '/fonts/Benne_Regular.json',
        Hubballi: '/fonts/Hubballi_Regular.json',
        AkayaKanadaka: '/fonts/Akaya_Kanadaka_Regular.json',
        Aparajita_Regular: '/fonts/Aparajita_Regular.json',
        Asar_Regular: '/fonts/Asar_Regular.json',
        Biryani_Regular: '/fonts/Biryani_Regular.json'
      };

      const fontLoader = new FontLoader();

      const loadFont = (fontPath) => {
        return new Promise((resolve, reject) => {
          fontLoader.load(fontPath, resolve, undefined, reject);
        });
      };

      const createTextMesh = async (controls) => {
        const font = await loadFont(fonts[controls.font]);
        fontRef.current = font;

        if (textMeshRef.current) {
          sceneRef.current.remove(textMeshRef.current);
        }

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

      materialRef.current = new THREE.MeshPhongMaterial({
        color: new THREE.Color(textControls.color),
        transparent: true,
        opacity: textControls.opacity,
      });

      createTextMesh(textControls);

      if (gui) {
        gui.destroy();
      }
      const newGui = new GUI();

      newGui.add(textControls, 'text').onChange((value) => createTextMesh({ ...textControls, text: value }));
      newGui.add(textControls, 'size', 1, 100).onChange(() => createTextMesh(textControls));
      newGui.add(textControls, 'height', 1, 20).onChange(() => createTextMesh(textControls));
      newGui.add(textControls, 'positionX', -100, 100).onChange((value) => {
        if (textMeshRef.current) textMeshRef.current.position.x = value;
      });
      newGui.add(textControls, 'positionY', -100, 100).onChange((value) => {
        if (textMeshRef.current) textMeshRef.current.position.y = value;
      });
      newGui.addColor(textControls, 'color').onChange((value) => {
        materialRef.current.color.set(value);
        if (textMeshRef.current) textMeshRef.current.material.color.set(value);
      });
      newGui.add(textControls, 'opacity', 0, 1).onChange((value) => {
        materialRef.current.opacity = value;
        if (textMeshRef.current) textMeshRef.current.material.opacity = value;
      });
      newGui.add(textControls, 'scale', 0.1, 3).onChange((value) => {
        if (textMeshRef.current) textMeshRef.current.scale.set(value, value, 1);
      });

      newGui.add(textControls, 'exportFormat', ['stl', 'gltf', 'glb', 'obj']).name('Export Format');
      newGui.add({ exportModel: () => exportModel(textControls.exportFormat) }, 'exportModel').name('Export');

      newGui.add(textControls, 'language', ['english', 'kannada', 'hindi']).name('Language').onChange((value) => {
        setLanguage(value);
        textControls.language = value;
        updateFontOptions(textControls);
        createTextMesh({ ...textControls, text: value === 'kannada' ? 'ನಮಸ್ಕಾರ' : value === 'hindi' ? 'नमस्ते' : 'TwinTitans' });
      });

      const updateFontOptions = (controls) => {
        if (language === 'kannada') {
          controls.font = 'noto_serif_kannada';
        } else if (language === 'hindi') {
          controls.font = 'tiro_devanagari_hindi';
        } else {
          controls.font = 'droid';
        }
        const fontOptions = language === 'kannada'
          ? ['noto_serif_kannada', 'AnekKannadaMedium', 'Benne', 'Hubballi', 'AkayaKanadaka']
          : language === 'hindi'
          ? ['tiro_devanagari_hindi', 'akshar_hindi_unicode', 'Biryani_Regular', 'Asar_Regular', 'Aparajita_Regular']
          : ['droid', 'Arial', 'ComicSansMS', 'Gentilis', 'Helvetiker', 'JetBrains', 'Lobster', 'Moderna', 'Optimer', 'Oswald'];
        
        const fontControl = newGui.add(controls, 'font', fontOptions).name('Font');
        fontControl.onChange((value) => createTextMesh({ ...controls, font: value }));
      };

      updateFontOptions(textControls);
      setGui(newGui);

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
            return;
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
        if (newGui) newGui.destroy();
      };
    };

    initThreeJs();
  }, [language]);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
