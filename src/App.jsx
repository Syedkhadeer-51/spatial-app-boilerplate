import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import './App.css';
import Draggable from 'react-draggable';

// For CSS
import playImage from './assets/cssIcons/playButton.png'; // Path to your play image
import pauseImage from './assets/cssIcons/pauseButton.png'; // Path to your pause image
import loopActiveImage from './assets/cssIcons/loopActive.png';
import loopInactiveImage from './assets/cssIcons/loopInactive.png';

function Model({ setExportTrigger, importFile, animationControl, loop, finalPosition, finalScale, finalRotation, duration, selectedAnimations, playKeyframeAnimation }) {
    const groupRef = useRef();
    const { scene } = useThree();
    const [mixer] = useState(() => new THREE.AnimationMixer());
    const clock = new THREE.Clock();
    const [actions, setActions] = useState({});
    const [modelLoaded, setModelLoaded] = useState(false);
    const [pausedAt, setPausedAt] = useState(0);

    const resetToInitialFrame = () => {
        if (groupRef.current) {
            const model = groupRef.current.getObjectByName('myModel');
            if (model) {
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                model.quaternion.set(0, 0, 0, 1);
            }
        }
    };

    useEffect(() => {
        if (groupRef.current && importFile) {
            // Clear any existing models
            while (groupRef.current.children.length) {
                groupRef.current.remove(groupRef.current.children[0]);
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                const loader = new GLTFLoader();
                loader.parse(contents, '', function (gltf) {
                    const model = gltf.scene;
                    model.name = 'myModel';
                    groupRef.current.add(model);

                    // Set initial state
                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);
                    model.quaternion.set(0, 0, 0, 1);

                    // Access existing animations
                    const existingAnimations = gltf.animations || [];
                    const newActions = {};

                    // Create action for each existing animation
                    existingAnimations.forEach(animation => {
                        const action = mixer.clipAction(animation, model);
                        action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                        action.clampWhenFinished = !loop;
                        newActions[animation.name] = action;
                    });

                    // Define keyframes for custom animation
                    const positionKF = new THREE.VectorKeyframeTrack(
                        'myModel.position',
                        [0, duration], // times
                        [0, 0, 0, ...finalPosition] // values
                    );

                    const scaleKF = new THREE.VectorKeyframeTrack(
                        'myModel.scale',
                        [0, duration], // times
                        [1, 1, 1, ...finalScale] // values
                    );

                    const rotationKF = new THREE.QuaternionKeyframeTrack(
                        'myModel.quaternion',
                        [0, duration], // times
                        [
                            0, 0, 0, 1,
                            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...finalRotation.map(r => r * (Math.PI / 180)))).toArray()
                        ] // values
                    );

                    // Create custom animation clip
                    const customClip = new THREE.AnimationClip('CustomAnimation', duration, [positionKF, scaleKF, rotationKF]);
                    const customAction = mixer.clipAction(customClip, model);
                    customAction.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                    customAction.clampWhenFinished = !loop;
                    newActions['CustomAnimation'] = customAction;

                    setActions(newActions);
                    setModelLoaded(true);

                    // Set the export trigger function
                    setExportTrigger(() => () => handleExport(scene, gltf, selectedAnimations, existingAnimations, customClip));
                });
            };
            reader.readAsArrayBuffer(importFile);
        }
    }, [importFile, mixer, scene, setExportTrigger, loop, finalPosition, finalScale, finalRotation, duration, selectedAnimations]);

    useFrame(() => {
        const delta = clock.getDelta();
        if (animationControl === 'play') {
            mixer.update(delta);
        } else if (animationControl === 'pause') {
            mixer.update(0);
        }
    });

    useEffect(() => {
        if (modelLoaded) {
            if (animationControl === 'play') {
                Object.keys(actions).forEach(name => {
                    if (selectedAnimations.includes(name) || (name === 'CustomAnimation' && playKeyframeAnimation)) {
                        actions[name].paused = false; // Unpause the action
                        actions[name].play();
                    }
                });
                mixer.timeScale = 1;
            } else if (animationControl === 'pause') {
                setPausedAt(mixer.time); // Save the paused time
                mixer.timeScale = 0;
                Object.keys(actions).forEach(name => {
                    actions[name].paused = true; // Pause the action
                });
            }
        }
    }, [animationControl, actions, selectedAnimations, modelLoaded, mixer, playKeyframeAnimation]);

    const handleExport = (scene, gltf, selectedAnimations, existingAnimations, customClip) => {
        resetToInitialFrame();

        const mergedTracks = {};

        // Collect and merge the keyframe tracks from the selected animations
        selectedAnimations.forEach((animationName) => {
            const animation = existingAnimations.find((anim) => anim.name === animationName);
            if (animation) {
                animation.tracks.forEach((track) => {
                    if (!mergedTracks[track.name]) {
                        mergedTracks[track.name] = track.clone();
                    } else {
                        const existingTrack = mergedTracks[track.name];
                        const values = new Float32Array(existingTrack.values.length + track.values.length);
                        values.set(existingTrack.values);
                        values.set(track.values, existingTrack.values.length);

                        const times = new Float32Array(existingTrack.times.length + track.times.length);
                        times.set(existingTrack.times);
                        times.set(track.times.map(time => time + existingTrack.times[existingTrack.times.length - 1]), existingTrack.times.length);

                        existingTrack.values = values;
                        existingTrack.times = times;
                    }
                });
            }
        });

        // Include the custom keyframe animation if selected
        if (playKeyframeAnimation) {
            customClip.tracks.forEach((track) => {
                if (!mergedTracks[track.name]) {
                    mergedTracks[track.name] = track.clone();
                } else {
                    const existingTrack = mergedTracks[track.name];
                    const values = new Float32Array(existingTrack.values.length + track.values.length);
                    values.set(existingTrack.values);
                    values.set(track.values, existingTrack.values.length);

                    const times = new Float32Array(existingTrack.times.length + track.times.length);
                    times.set(existingTrack.times);
                    times.set(track.times.map(time => time + existingTrack.times[existingTrack.times.length - 1]), existingTrack.times.length);

                    existingTrack.values = values;
                    existingTrack.times = times;
                }
            });
        }

        const mergedClip = new THREE.AnimationClip('MergedAnimation', -1, Object.values(mergedTracks));

        const gltfExporter = new GLTFExporter();
        const options = {
            binary: true,
            animations: [mergedClip], // Include only the merged animation
        };
        gltfExporter.parse(scene, function (result) {
            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, 'scene.glb');
            } else {
                const output = JSON.stringify(result, null, 2);
                console.log(output);
                saveString(output, 'scene.gltf');
            }
        }, function (error) {
            console.error('An error occurred during the export:', error);
        }, options);

        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        function save(blob, filename) {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
        function saveString(text, filename) {
            save(new Blob([text], { type: 'text/plain' }), filename);
        }

        function saveArrayBuffer(buffer, filename) {
            save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
        }
    };

    return (
        <group ref={groupRef} />
    );
}

export default function App() {
    const [exportTrigger, setExportTrigger] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [animationControl, setAnimationControl] = useState('pause');
    const [loop, setLoop] = useState(false);
    const [finalPosition, setFinalPosition] = useState([0, 0, 0]);
    const [finalScale, setFinalScale] = useState([1, 1, 1]);
    const [finalRotation, setFinalRotation] = useState([0, 0, 0]);
    const [duration, setDuration] = useState(5); // Initial duration
    const [availableAnimations, setAvailableAnimations] = useState([]);
    const [selectedAnimations, setSelectedAnimations] = useState([]);
    const [playKeyframeAnimation, setPlayKeyframeAnimation] = useState(false);

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImportFile(file);
        }
    };

    const togglePlayPause = () => {
        setAnimationControl(prev => (prev === 'play' ? 'pause' : 'play'));
    };

    const handlePositionChange = (e, index) => {
        const newPos = [...finalPosition];
        newPos[index] = parseFloat(e.target.value);
        setFinalPosition(newPos);
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

    const handleDurationChange = (e) => {
        setDuration(parseFloat(e.target.value));
    };

    const handleAnimationSelect = (animationName) => {
        setSelectedAnimations(prev => {
            if (prev.includes(animationName)) {
                return prev.filter(name => name !== animationName);
            } else {
                return [...prev, animationName];
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
                    setAvailableAnimations(animations);
                    setSelectedAnimations(animations);
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
                />
                <OrbitControls />
            </Canvas>

            <Draggable>
                <div className="input-container">
                    <div className="keyframeTitleStuff">Keyframes Controllers</div>
                    <div className="position-input">
                        <div className="title">
                            <span>FINAL POSITION</span>
                            <div className="image-container">
                                <img src="https://static.thenounproject.com/png/3201862-200.png" alt="Position Icon" width="12"
                                     height="12"/>
                            </div>
                        </div>
                        <div className="inputs">
                            <label>
                                X:
                                <input
                                    type="number"
                                    placeholder="X"
                                    value={finalPosition[0]}
                                    onChange={(e) => handlePositionChange(e, 0)}
                                />
                            </label>
                            <label>
                                Y:
                                <input
                                    type="number"
                                    placeholder="Y"
                                    value={finalPosition[1]}
                                    onChange={(e) => handlePositionChange(e, 1)}
                                />
                            </label>
                            <label>
                                Z:
                                <input
                                    type="number"
                                    placeholder="Z"
                                    value={finalPosition[2]}
                                    onChange={(e) => handlePositionChange(e, 2)}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="scale-input">
                        <div className="title">
                            <span>FINAL SCALE</span>
                            <div className="image-container">
                                <img src="https://static.thenounproject.com/png/2583409-200.png" alt="Scale Stuff" width="12"
                                     height="12"/>
                            </div>
                        </div>
                        <div className="inputs">
                            <label>
                                X:
                                <input
                                    type="number"
                                    placeholder="X"
                                    value={finalScale[0]}
                                    onChange={(e) => handleScaleChange(e, 0)}
                                />
                            </label>
                            <label>
                                Y:
                                <input
                                    type="number"
                                    placeholder="Y"
                                    value={finalScale[1]}
                                    onChange={(e) => handleScaleChange(e, 1)}
                                />
                            </label>
                            <label>
                                Z:
                                <input
                                    type="number"
                                    placeholder="Z"
                                    value={finalScale[2]}
                                    onChange={(e) => handleScaleChange(e, 2)}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="rotation-input">
                        <div className="title">
                            <span>FINAL ROTATION</span>
                            <div className="image-container">
                                <img src="https://cdn.icon-icons.com/icons2/1875/PNG/512/rotateaxisxy_120494.png" alt="Rotation Shit" width="12"
                                     height="12"/>
                            </div>
                        </div>
                        <div className="inputs">
                            <label>
                                X:
                                <input
                                    type="number"
                                    placeholder="X"
                                    value={finalRotation[0]}
                                    onChange={(e) => handleRotationChange(e, 0)}
                                />
                            </label>
                            <label>
                                Y:
                                <input
                                    type="number"
                                    placeholder="Y"
                                    value={finalRotation[1]}
                                    onChange={(e) => handleRotationChange(e, 1)}
                                />
                            </label>
                            <label>
                                Z:
                                <input
                                    type="number"
                                    placeholder="Z"
                                    value={finalRotation[2]}
                                    onChange={(e) => handleRotationChange(e, 2)}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="duration-input">
                        <div className="title">
                            <span>DURATION</span>
                        </div>
                        <div className="inputs">
                            <input
                                type="number"
                                placeholder="Duration"
                                value={duration}
                                onChange={handleDurationChange}
                            />
                        </div>

                    </div>
                    <div className="buttonFunctionalities">
                        <div className="importExportButtons">
                            <input type="file" accept=".glb,.gltf" onChange={handleImport} style={{display: 'none'}}
                                   id="importFileInput"/>
                            <button onClick={() => document.getElementById('importFileInput').click()}
                                    className="importButton">Import
                            </button>
                            <button className="exportButton" onClick={() => {
                                if (exportTrigger) exportTrigger();
                            }}>Export
                            </button>
                        </div>
                        <div className="playLoopButtons">
                            <button onClick={togglePlayPause} className="playButton">
                                <img src={animationControl === 'play' ? pauseImage : playImage}
                                     alt={animationControl === 'play' ? 'Pause' : 'Play'}
                                     style={{height: '12px'}}/>
                            </button>
                            <button onClick={() => setLoop(!loop)} className="loopButton">
                                <img src={loop ? loopActiveImage : loopInactiveImage}
                                     alt={loop ? 'Loop: On' : 'Loop: Off'}
                                     style={{width: '18px', height: '18px'}}/>
                            </button>
                        </div>
                    </div>

                    <div className="animation-selector">
                        <div className="title">
                            <span>AVAILABLE ANIMATIONS</span>
                            <div className="image-container">
                                <img src="https://www.svgrepo.com/show/371686/animation.svg" alt="Animation Icon" width="12"
                                     height="12"/>
                            </div>
                        </div>
                        <div className="animation-list">
                            <label className="animationsCollection">
                                <input
                                    type="checkbox"
                                    checked={playKeyframeAnimation}
                                    onChange={() => setPlayKeyframeAnimation(!playKeyframeAnimation)}
                                />
                                <span></span> Keyframe Animation
                            </label>
                            {availableAnimations.map(animation => (
                                <label key={animation} className="animationsCollection">
                                    <input
                                        type="checkbox"
                                        checked={selectedAnimations.includes(animation)}
                                        onChange={() => handleAnimationSelect(animation)}
                                    />
                                    <span></span> {animation}
                                </label>
                            ))}
                        </div>
                    </div>


                </div>
            </Draggable>

        </>
    );
}
