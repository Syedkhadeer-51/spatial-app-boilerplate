import React from 'react';

// All of these are statebased implementations discused before that return pure JSX components. So I do not think, commenting here is necessary



const AnimationControls = ({
                               finalPosition,
                               finalScale,
                               finalRotation,
                               duration,
                               handlePositionChange,
                               handleScaleChange,
                               handleRotationChange,
                               handleDurationChange,
                               handleImport,
                               exportTrigger,
                               togglePlayPause,
                               animationControl,
                               playImage,
                               pauseImage,
                               loop,
                               setLoop,
                               loopActiveImage,
                               loopInactiveImage,
                               availableAnimations,
                               selectedAnimations,
                               handleAnimationSelect,
                               playKeyframeAnimation,
                               setPlayKeyframeAnimation
                           }) => {
    return (
        <div className="input-container">
            <div className="keyframeTitleStuff">Keyframes Controllers</div>
            <div className="position-input">
                <div className="title">
                    <span>FINAL POSITION</span>
                    <div className="image-container">
                        <img src="https://static.thenounproject.com/png/3201862-200.png" alt="Position Icon" width="12" height="12" />
                    </div>
                </div>
                <div className="inputs">
                    {['X', 'Y', 'Z'].map((axis, index) => (
                        <label key={axis}>
                            {axis}:
                            <input
                                type="number"
                                placeholder={axis}
                                value={finalPosition[index]}
                                onChange={(e) => handlePositionChange(e, index)}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="scale-input">
                <div className="title">
                    <span>FINAL SCALE</span>
                    <div className="image-container">
                        <img src="https://static.thenounproject.com/png/2583409-200.png" alt="Scale Stuff" width="12" height="12" />
                    </div>
                </div>
                <div className="inputs">
                    {['X', 'Y', 'Z'].map((axis, index) => (
                        <label key={axis}>
                            {axis}:
                            <input
                                type="number"
                                placeholder={axis}
                                value={finalScale[index]}
                                onChange={(e) => handleScaleChange(e, index)}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="rotation-input">
                <div className="title">
                    <span>FINAL ROTATION</span>
                    <div className="image-container">
                        <img src="https://cdn.icon-icons.com/icons2/1875/PNG/512/rotateaxisxy_120494.png" alt="Rotation Shit" width="12" height="12" />
                    </div>
                </div>
                <div className="inputs">
                    {['X', 'Y', 'Z'].map((axis, index) => (
                        <label key={axis}>
                            {axis}:
                            <input
                                type="number"
                                placeholder={axis}
                                value={finalRotation[index]}
                                onChange={(e) => handleRotationChange(e, index)}
                            />
                        </label>
                    ))}
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
                    <input type="file" accept=".glb,.gltf" onChange={handleImport} style={{ display: 'none' }} id="importFileInput" />
                    <button onClick={() => document.getElementById('importFileInput').click()} className="importButton">Import</button>
                    <button className="exportButton" onClick={() => { if (exportTrigger) exportTrigger(); }}>Export</button>
                </div>
                <div className="playLoopButtons">
                    <button onClick={togglePlayPause} className="playButton">
                        <img src={animationControl === 'play' ? pauseImage : playImage} alt={animationControl === 'play' ? 'Pause' : 'Play'} style={{ height: '12px' }} />
                    </button>
                    <button onClick={() => setLoop(!loop)} className="loopButton">
                        <img src={loop ? loopActiveImage : loopInactiveImage} alt={loop ? 'Loop: On' : 'Loop: Off'} style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>
            </div>

            <div className="animation-selector">
                <div className="title">
                    <span>AVAILABLE ANIMATIONS</span>
                    <div className="image-container">
                        <img src="https://www.svgrepo.com/show/371686/animation.svg" alt="Animation Icon" width="12" height="12" />
                    </div>
                </div>
                <div className="animation-list">
                    <label className="animationsCollection">
                        <input
                            type="checkbox"
                            checked={playKeyframeAnimation}
                            onChange={() => setPlayKeyframeAnimation(!playKeyframeAnimation)}
                        />
                        <span></span>Keyframe Animation
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
    );
};

export default AnimationControls;
