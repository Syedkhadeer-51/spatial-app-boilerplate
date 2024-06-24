import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { Html } from '@react-three/drei';
import { uploadFile } from './upload';
import { modelPath } from './atoms';
import { exports } from './atoms';
import { toCloud } from './atoms';
import { useAtom } from 'jotai';
import { inputModelUrl } from './atoms';

// Helper function to compress and export GLTF
async function compressAndExportGLTF(gltf, fileName) {
    const exporter = new GLTFExporter();
    const options = {
        binary: true,
        dracoOptions: {
            compressionLevel: 10
        }
    };

    return new Promise((resolve, reject) => {
        exporter.parse(gltf.scene, (result) => {
            const blob = new Blob([result], { type: 'application/octet-stream' });
            saveAs(blob, fileName);

            resolve(blob);
        }, (error) => {
            console.error('An error happened during GLTF export', error);
            reject(error);
        }, options);
    });
}

export default function Compression() {
    const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [gltf, setGltf] = useState(null);
  const [ModelPath,setModelPath] = useAtom(modelPath);
  const [Exports,setExports] = useAtom(exports)
  const [ToCloud,setToCloud] = useAtom(toCloud);
  const [InputModelUrl,setInputModelUrl] = useAtom(inputModelUrl);
    useEffect(() => {
        if (ModelPath) {
          setIsLoadingModel(true);
          const loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
          loader.setDRACOLoader(dracoLoader);
          loader.load(ModelPath, 
            (gltf) => {
              setGltf(gltf);
              setIsLoadingModel(false);
            },
            undefined,
            (error) => {
              console.error('An error occurred while loading the model:', error);
              setIsLoadingModel(false);
            }
          );
        }
      }, [ModelPath]);
      useEffect(()=>{
        if(ToCloud)
            {
        uploadFile(gltf,InputModelUrl);
        setToCloud(false);

            }
      },[ToCloud])
    useEffect(()=>{
        console.log(Exports);
        if(Exports){
        try {
        const compressedBlob = compressAndExportGLTF(gltf, InputModelUrl+'.glb');
        console.log("Compressed Model Size (bytes): ", compressedBlob.size);
        // For debugging: Log the GLTF object and options
        console.log("GLTF object:", gltf);
        console.log("Exporter options:", {
            binary: true,
            dracoOptions: {
                compressionLevel: 10
            }
        });
        setExports(false);
    } catch (error) {
        console.error("Error during compression and export:", error);
    }}},[Exports]);

    return       isLoadingModel ? <Html><div>Loading...</div></Html> : gltf && <primitive object={gltf.scene} />;
}

