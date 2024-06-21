import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import Draggable from 'react-draggable';

const LightControls = ({ lights, updateLight, setExpandedLight, addLight, deleteLight, resetLights, toggleGlobalShadows, globalShadows, globalExposure, updateGlobalExposure, setLights }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    const newExpanded = expanded === id ? null : id;
    setExpanded(newExpanded);
    setExpandedLight(newExpanded);
  };

  const handlePositionChange = (id, axis, value) => {
    const newValue = parseFloat(value);
    const light = lights.find(light => light.id === id);
    const newPosition = [...light.position];
    newPosition[axis] = newValue;
    updateLight(id, 'position', newPosition);
  };

  const exportLights = () => {
    const dataStr = JSON.stringify(lights, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'lights.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importLights = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedLights = JSON.parse(e.target.result);
      setLights(importedLights);
    };
    reader.readAsText(file);
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="light-controls-container">
        <div className="controls-header">
          <button onClick={() => addLight('directional')}>Add Directional Light</button>
          <button onClick={() => addLight('point')}>Add Point Light</button>
          <button onClick={() => addLight('spot')}>Add Spot Light</button>
          <button onClick={resetLights}>Reset Lights</button>
          <button onClick={toggleGlobalShadows}>
            {globalShadows ? 'Disable Shadows' : 'Enable Shadows'}
          </button>
          <label>
            Global Exposure
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={globalExposure}
              onChange={(e) => updateGlobalExposure(parseFloat(e.target.value))}
              aria-label="Global Exposure"
            />
          </label>
          <button onClick={exportLights}>Export Lights</button>
          <input type="file" accept=".json" onChange={importLights} />
        </div>
        {lights.map((light) => (
          <div key={light.id} className="light-control">
            <div className="drag-handle" onClick={() => toggleExpand(light.id)}>
              <h3>{light.type.charAt(0).toUpperCase() + light.type.slice(1)} Light</h3>
              <button className="delete-button" onClick={() => deleteLight(light.id)}>Delete</button>
            </div>
            {expanded === light.id && (
              <div className="controls">
                <ChromePicker
                  color={light.color}
                  onChange={(color) => updateLight(light.id, 'color', color.hex)}
                />
                <label>
                  Intensity
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={light.intensity}
                    onChange={(e) => updateLight(light.id, 'intensity', parseFloat(e.target.value))}
                    aria-label="Intensity"
                  />
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
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={light.shadowIntensity}
                    onChange={(e) => updateLight(light.id, 'shadowIntensity', parseFloat(e.target.value))}
                    aria-label="Shadow Intensity"
                  />
                </label>
                {light.type === 'spot' && (
                  <>
                    <label>
                      Angle
                      <input
                        type="range"
                        min="0"
                        max={Math.PI}
                        step="0.1"
                        value={light.angle}
                        onChange={(e) => updateLight(light.id, 'angle', parseFloat(e.target.value))}
                        aria-label="Angle"
                      />
                    </label>
                    <label>
                      Penumbra
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={light.penumbra}
                        onChange={(e) => updateLight(light.id, 'penumbra', parseFloat(e.target.value))}
                        aria-label="Penumbra"
                      />
                    </label>
                    <label>
                      Distance
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={light.distance}
                        onChange={(e) => updateLight(light.id, 'distance', parseFloat(e.target.value))}
                        aria-label="Distance"
                      />
                    </label>
                  </>
                )}
                {light.type === 'point' && (
                  <label>
                    Distance
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={light.distance}
                      onChange={(e) => updateLight(light.id, 'distance', parseFloat(e.target.value))}
                      aria-label="Distance"
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Draggable>
  );
};

export default LightControls;
