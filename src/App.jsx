import { Canvas } from '@react-three/fiber';
import './App.css';
import { Stats, OrbitControls } from '@react-three/drei';
import { useState, useRef, useCallback } from 'react';
import Compression from './Compression.jsx';

export default function App() {
    const [modelPath, setModelPath] = useState(null);
    const exportHandlerRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setModelPath(url);
            console.log("Original File: " + file.size);
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
            <input type="file" accept=".glb, .gltf" onChange={handleFileUpload} style={{ position:'absolute', top:'100px', zIndex:'1'}} className="custom-file-upload"   />
            <button onClick={handleExportClick} style={{position:'absolute', top:'150px', zIndex:'1'}}>Export Compressed Model</button>
            <Canvas camera={{ position: [0, 3, 10] }}>
                <ambientLight />
                <Compression modelPath={modelPath} onExport={setExportHandler}  />
                <OrbitControls />
                <Stats />
            </Canvas>
        </>
    );
}
