import React from 'react';
import { ChromePicker } from 'react-color';
import './lights.css'
const LightControls = ({
  onClose,
  lights,
  updateLight,
  setExpandedLightId,
  expandedLightId,
  addLight,
  deleteLight,
  resetLights,
  toggleGlobalShadows,
  globalShadows,
  globalExposure,
  updateGlobalExposure,
}) => {
  const handlePositionChange = (id, axis, value) => {
    const newValue = parseFloat(value);
    const light = lights.find(light => light.id === id);
    const newPosition = [...light.position];
    newPosition[axis] = newValue;
    updateLight(id, 'position', newPosition);
  };

  const toggleExpand = (id) => {
    setExpandedLightId(expandedLightId === id ? null : id);
  };

  return (
      <div className="light-controls-container">
        <div className="header">
          <h2>Lights Panel</h2>
        </div>
        <div className="controls-header">
          <button onClick={() => addLight('directional')}>Add Directional Light</button>
          <button onClick={() => addLight('point')}>Add Point Light</button>
          <button onClick={() => addLight('spot')}>Add Spot Light</button>
          <button onClick={resetLights}>Reset Lights</button>
          <button onClick={toggleGlobalShadows}>
            {globalShadows ? 'Disable Shadows' : 'Enable Shadows'}
          </button>
        </div>
        <div className="control-group">
        <label>
            Global Exposure
          <div className='slider-container'>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={globalExposure}
              onChange={(e) => updateGlobalExposure(parseFloat(e.target.value))}
              aria-label="Global Exposure"
              className='Exposure-slider'
            />
            <output className="slider-output">{`${(globalExposure*10).toFixed(0)}%`}</output>
          </div>
        </label>
        </div>
        {lights.map((light) => (
          <div key={light.id} className="light-control">
            <div className="drag-handle" onClick={() => toggleExpand(light.id)}>
              <h3>{light.type.charAt(0).toUpperCase() + light.type.slice(1)} Light</h3>
              <button className="delete-button" onClick={() => deleteLight(light.id)}>X</button>
            </div>
            {expandedLightId === light.id && (
              <div className="controls">
                <ChromePicker
                  color={light.color}
                  onChange={(color) => updateLight(light.id, 'color', color.hex)}
                />
                <label>
                  Intensity
                  <div className='slider-container'>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={light.intensity}
                    onChange={(e) => updateLight(light.id, 'intensity', parseFloat(e.target.value))}
                    aria-label="Intensity"
                  />
                  <output className="slider-output">{`${(light.intensity*10).toFixed(0)}%`}</output>
                  </div>
                </label>
                <label>
                  Position X
                  <input
                    type="number"
                    value={light.position[0]}
                    onChange={(e) => handlePositionChange(light.id, 0, e.target.value)}
                    aria-label="Position X"
                  />
                </label>
                <label>
                  Position Y
                  <input
                    type="number"
                    value={light.position[1]}
                    onChange={(e) => handlePositionChange(light.id, 1, e.target.value)}
                    aria-label="Position Y"
                  />
                </label>
                <label>
                  Position Z
                  <input
                    type="number"
                    value={light.position[2]}
                    onChange={(e) => handlePositionChange(light.id, 2, e.target.value)}
                    aria-label="Position Z"
                  />
                </label>
                <label>
                  Shadow Intensity
                  <div className='slider-container'>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={light.shadowIntensity}
                    onChange={(e) => updateLight(light.id, 'shadowIntensity', parseFloat(e.target.value))}
                    aria-label="Shadow Intensity"
                  />
                  <output className="slider-output">{`${(light.shadowIntensity*50).toFixed(0)}%`}</output>
                  </div>
                </label>
                {light.type === 'spot' && (
                  <>
                    <label>
                      Angle
                      <div className='slider-container'>
                      <input
                        type="range"
                        min="0"
                        max={Math.PI}
                        step="0.1"
                        value={light.angle}
                        onChange={(e) => updateLight(light.id, 'angle', parseFloat(e.target.value))}
                        aria-label="Angle"
                      />
                      <output className="slider-output">{`${(light.angle*(1000/31)).toFixed(0)}%`}</output>
                      </div>
                    </label>
                    <label>
                      Penumbra
                      <div className='slider-container'>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={light.penumbra}
                        onChange={(e) => updateLight(light.id, 'penumbra', parseFloat(e.target.value))}
                        aria-label="Penumbra"
                      />
                      <output className="slider-output">{`${(light.penumbra*100).toFixed(0)}%`}</output>
                      </div>
                    </label>
                    <label>
                      Distance
                      <div className='slider-container'>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={light.distance}
                        onChange={(e) => updateLight(light.id, 'distance', parseFloat(e.target.value))}
                        aria-label="Distance"
                      />
                      <output className="slider-output">{`${(light.distance).toFixed(0)}%`}</output>
                      </div>
                    </label>
                  </>
                )}
                {light.type === 'point' && (
                  <label>
                    Distance
                    <div className='slider-container'>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={light.distance}
                      onChange={(e) => updateLight(light.id, 'distance', parseFloat(e.target.value))}
                      aria-label="Distance"
                    />
                    <output className="slider-output">{`${(light.distance).toFixed(0)}%`}</output>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default LightControls;
