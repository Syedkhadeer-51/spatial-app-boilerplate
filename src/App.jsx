import { Canvas } from '@react-three/fiber';
import './App.css';
import { Stats, OrbitControls } from '@react-three/drei';
import { useState, useRef, useCallback } from 'react';
import MinifyAndExport from './Compression.jsx';

export default function App() {
    const [modelPath, setModelPath] = useState(null);
    const exportHandlerRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setModelPath(url);
            console.log("Original File Size: " + file.size);
        }
    };

    const setExportHandler = useCallback((handler) => {
        exportHandlerRef.current = handler;
    }, []);

    const handleExportClick = () => {
        if (exportHandlerRef.current) {
            exportHandlerRef.current();
        }
    };

    return (
        <>
            <input type="file" accept=".glb, .gltf" onChange={handleFileUpload} style={{ position:'absolute', top:'100px', zIndex:'1', color:"#ffffff"}} className="custom-file-upload"   />
            <button onClick={handleExportClick} style={{position:'absolute', top:'150px', zIndex:'1'}}>Export Compressed Model</button>
            <Canvas camera={{ position: [0, 5, 10] }}>
                <ambientLight />
                <MinifyAndExport modelPath={modelPath} onExport={setExportHandler}  />
                <OrbitControls />
                <Stats />
            </Canvas>
        </>
    );
}
