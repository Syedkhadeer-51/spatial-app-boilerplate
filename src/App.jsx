import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls, Text3D } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from 'three';

// animated text component
function AnimatedText({ text, fontSize, fontColor, selectedFont, transparency, scale, animationType }) {
    const textRef = useRef();
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        if (textRef.current) {
            textRef.current.position.set(0, 0, 0);
            textRef.current.rotation.set(0, 0, 0);
            clock.current.start();
        }
    }, [animationType]); // dependency array -> useEffect relies on animationType

    useFrame(() => {
        const elapsedTime = clock.current.getElapsedTime();
        const speedFactor = 3; // speed manipulation factor for animation

        if (animationType === "bounce") {
            textRef.current.position.y = Math.abs(Math.sin(elapsedTime * speedFactor)) * 2;
        } else if (animationType === "spin") {
            textRef.current.rotation.y = elapsedTime * speedFactor;
        }
    });

    return (
        <Text3D
            ref={textRef}
            font={`./fonts/${selectedFont}.json`}
            size={fontSize}
            height={0.5}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.0002}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={0.5}
            scale={scale}
        >
            {text}
            <meshPhongMaterial color={fontColor} transparent opacity={transparency} />
        </Text3D>
    );
}

export default function App() {
    const [text, setText] = useState("hello"); // initial text
    const [fontSize, setFontSize] = useState(1); // initial size
    const [fontColor, setFontColor] = useState("#6495ED"); // initial color
    const [selectedFont, setSelectedFont] = useState("gentilis_regular"); // initial font
    const [transparency, setTransparency] = useState(1); // initial transparency
    const [scale, setScale] = useState([1, 1, 1]); // initial scale
    const [animationType, setAnimationType] = useState("none"); // initial animation

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    const handleFontColorChange = (event) => {
        setFontColor(event.target.value);
    };

    const handleFontSelection = (event) => {
        setSelectedFont(event.target.value);
    };

    const handleTransparencyChange = (event) => {
        setTransparency(event.target.value);
    };

    const handleScaleChange = (event) => {
        setScale([event.target.value, event.target.value, event.target.value]);
    };

    const handleAnimationChange = (event) => {
        setAnimationType(event.target.value);
    };

    const handleExport = () => {
        const scene = new THREE.Scene();

        const loader = new FontLoader();
        loader.load(`./fonts/${selectedFont}.json`, (font) => {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: fontSize,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.0002,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 0.5,
            });

            const textMaterial = new THREE.MeshPhongMaterial({
                color: fontColor,
                transparent: true,
                opacity: transparency,
            });

            // creating a mesh as GLTFexporter doesn't accept jsx, instead accepts .gtlf or .glb -> mesh is a three.js object
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.scale.set(...scale);

            scene.add(textMesh);

            const exporter = new GLTFExporter();
            exporter.parse(
                scene,
                (result) => {
                    const output = JSON.stringify(result, null, 2);
                    const blob = new Blob([output], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = '3d-text.glb';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                { binary: true }
            );
        });
    };

    return (
        <>
            <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, 10] }}>
                <OrbitControls makeDefault />
                <ambientLight />
                <Center>
                    <AnimatedText
                        text={text}
                        fontSize={fontSize}
                        fontColor={fontColor}
                        selectedFont={selectedFont}
                        transparency={transparency}
                        scale={scale}
                        animationType={animationType}
                    />
                </Center>
            </Canvas>
            <div className="controls">
                <div>
                    <label>Text: </label>
                    <input type="text" value={text} onChange={handleTextChange} placeholder="Enter text" />
                </div>
                <div>
                    <label>Font Size: </label>
                    <input type="number" min={0} max={2} step={0.2} value={fontSize} onChange={handleFontSizeChange} />
                </div>
                <div>
                    <label>Font Color: </label>
                    <input type="color" value={fontColor} onChange={handleFontColorChange} />
                </div>
                <div>
                    <label>Text Transparency: </label>
                    <input type="range" min={0} max={1} step={0.1} value={transparency} onChange={handleTransparencyChange} />
                </div>
                <div>
                    <label>Text Scaling: </label>
                    <input type="number" min={0} max={1} step={0.1} value={scale[0]} onChange={handleScaleChange} placeholder="Scale" />
                </div>
                <div>
                    <label>Font: </label>
                    <select value={selectedFont} onChange={handleFontSelection}>
                        <option value="gentilis_regular">Gentilis Regular</option>
                        <option value="helvetiker_regular">Helvetiker Regular</option>
                        <option value="optimer_regular">Optimer Regular</option>
                        <option value="dancingScript_regular">Dancing Script Regular</option>
                    </select>
                </div>
                <div>
                    <label>Animation: </label>
                    <select value={animationType} onChange={handleAnimationChange}>
                        <option value="none">None</option>
                        <option value="bounce">Bounce</option>
                        <option value="spin">Spin</option>
                    </select>
                </div>
                <div>
                    <button onClick={handleExport}>Export 3D Text</button>
                </div>
            </div>
        </>
    );
}
