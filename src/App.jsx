import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Draggable from 'react-draggable';
import Model from './Model';
import AnimationControls from './AnimationControls';
import './App.css';
import playImage from './assets/cssIcons/playButton.png';
import pauseImage from './assets/cssIcons/pauseButton.png';
import loopActiveImage from './assets/cssIcons/loopActive.png';
import loopInactiveImage from './assets/cssIcons/loopInactive.png';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default function App() {
    const [exportTrigger, setExportTrigger] = useState(null);
    const [importFile, setImportFile] = useState(null);
    // The above are self-explanatory

    const [animationControl, setAnimationControl] = useState('pause');
    // Setting the default state of animationControl, to Pause. Loading model, itself takes the Pause State

    const [loop, setLoop] = useState(false);
    // Loop state is set to False

    const [finalPosition, setFinalPosition] = useState([0, 0, 0]);
    const [finalScale, setFinalScale] = useState([1, 1, 1]);
    const [finalRotation, setFinalRotation] = useState([0, 0, 0]);
    // Initialisation of the final keyfrane state values

    const [duration, setDuration] = useState(5);
    // Initialisation of duration keyframe values

    const [availableAnimations, setAvailableAnimations] = useState([]);
    const [selectedAnimations, setSelectedAnimations] = useState([]);
    // Available and Set Available animations as well as selectedAnimations

    const [playKeyframeAnimation, setPlayKeyframeAnimation] = useState(false);
    // Keyframe animations selection is handled accordingly over here

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImportFile(file);
        }
    };
    // Importing the object, and if taken multiple files, select the first selected file, and accordingly associate the file with the setImportFile

    const togglePlayPause = () => {
        setAnimationControl(prev => (prev === 'play' ? 'pause' : 'play'));
    };
    // Animation Play Button Toggler

    const handlePositionChange = (e, index) => {
        // e Refers to the Field change event, and index refers to the index of the change value. Specifically optimises to that specific field

        const newPos = [...finalPosition];
        // Creating a copy of my final position array

        newPos[index] = parseFloat(e.target.value);
        // Parse as Float value (the input fields)

        setFinalPosition(newPos);
        // Set the Float Values
    };

    const handleScaleChange = (e, index) => {
        const newScale = [...finalScale];
        newScale[index] = parseFloat(e.target.value);
        setFinalScale(newScale);
    };

    const handleRotationChange = (e, index) => {
        const newRot = [...finalRotation];
        newRot[index] = parseFloat(e.target.value);
        setFinalRotation(newRot);
    };
    // All work the same way as handlePositionChange

    const handleDurationChange = (e) => {
        setDuration(parseFloat(e.target.value));
    };
    // Works the same way

    const handleAnimationSelect = (animationName) => {
        // Name of animation that is toggled in the collection

        setSelectedAnimations(prev => {
            // prev holds the previous state of array
            if (prev.includes(animationName)) {
                // Tests the collection of animations that are included. If my toggled animation present previously in the list, I need to remove it. Handled over here

                return prev.filter(name => name !== animationName);
                // The filter, will take up the condition. If matched, these are included, else not
            } else {
                return [...prev, animationName];
                // It means it was not present and I ma adding it to the collection
            }
        });
    };

    useEffect(() => {
        if (importFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                const loader = new GLTFLoader();
                loader.parse(contents, '', function (gltf) {
                    const animations = gltf.animations.map(animation => animation.name);
                    // Over each iteration, return back and make an array of animation.name

                    setAvailableAnimations(animations);
                    setSelectedAnimations(animations);
                    // All are selected by default
                });
            };
            reader.readAsArrayBuffer(importFile);
        }
    }, [importFile]);

    return (
        <>
            <Canvas camera={{ position: [-8, 5, 8] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 10, 5]} intensity={1} />
                <Model
                    setExportTrigger={setExportTrigger}
                    importFile={importFile}
                    animationControl={animationControl}
                    loop={loop}
                    finalPosition={finalPosition}
                    finalScale={finalScale}
                    finalRotation={finalRotation}
                    duration={duration}
                    selectedAnimations={selectedAnimations}
                    playKeyframeAnimation={playKeyframeAnimation}
                    setAvailableAnimations={setAvailableAnimations}
                />
                <OrbitControls />
            </Canvas>

            <Draggable>
                <AnimationControls
                    finalPosition={finalPosition}
                    finalScale={finalScale}
                    finalRotation={finalRotation}
                    duration={duration}
                    handlePositionChange={handlePositionChange}
                    handleScaleChange={handleScaleChange}
                    handleRotationChange={handleRotationChange}
                    handleDurationChange={handleDurationChange}
                    handleImport={handleImport}
                    exportTrigger={exportTrigger}
                    togglePlayPause={togglePlayPause}
                    animationControl={animationControl}
                    playImage={playImage}
                    pauseImage={pauseImage}
                    loop={loop}
                    setLoop={setLoop}
                    loopActiveImage={loopActiveImage}
                    loopInactiveImage={loopInactiveImage}
                    availableAnimations={availableAnimations}
                    selectedAnimations={selectedAnimations}
                    handleAnimationSelect={handleAnimationSelect}
                    playKeyframeAnimation={playKeyframeAnimation}
                    setPlayKeyframeAnimation={setPlayKeyframeAnimation}
                />
            </Draggable>
        </>
    );
};
