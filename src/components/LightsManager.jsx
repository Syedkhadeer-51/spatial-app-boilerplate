import { useState } from 'react';

const useLights = () => {
  const [lights, setLights] = useState([]);
  const [expandedLightId, setExpandedLightId] = useState(null);
  const [globalShadows, setGlobalShadows] = useState(true);
  const [globalExposure, setGlobalExposure] = useState(1);

  const addLight = (type) => {
    const newLight = {
      id: lights.length,
      type: type,
      color: '#ffffff',
      intensity: 1,
      position: [0, 5, 0],
      exposure: 1,
      shadows: true,
      shadowIntensity: 1,
      ...(type === 'spot' && { angle: Math.PI / 4, penumbra: 0.1, distance: 10 }),
      ...(type === 'point' && { distance: 10 })
    };
    setLights([...lights, newLight]);
  };

  const updateLight = (id, property, value) => {
    const updatedLights = lights.map(light =>
      light.id === id ? { ...light, [property]: value } : light
    );
    setLights(updatedLights);
  };

  const deleteLight = (id) => {
    setLights(lights.filter(light => light.id !== id));
  };

  const resetLights = () => {
    setLights([]);
  };

  const toggleGlobalShadows = () => {
    const newGlobalShadows = !globalShadows;
    setGlobalShadows(newGlobalShadows);
    const updatedLights = lights.map(light => ({
      ...light,
      shadows: newGlobalShadows,
    }));
    setLights(updatedLights);
  };

  const updateGlobalExposure = (value) => {
    setGlobalExposure(value);
    const updatedLights = lights.map(light => ({
      ...light,
      exposure: value,
    }));
    setLights(updatedLights);
  };

  return {
    lights,
    expandedLightId,
    globalShadows,
    globalExposure,
    addLight,
    updateLight,
    deleteLight,
    resetLights,
    toggleGlobalShadows,
    updateGlobalExposure,
    setExpandedLightId,
  };
};

export default useLights;
