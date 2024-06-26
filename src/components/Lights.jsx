import React, { useRef, useEffect } from 'react';
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper } from 'three';

const Lights = ({ lights, expandedLightId, globalExposure }) => {
  const lightRefs = useRef({});

  useEffect(() => {
    lights.forEach((light) => {
      if (!lightRefs.current[light.id]) {
        lightRefs.current[light.id] = React.createRef();
      }
    });
  }, [lights]);

  return (
    <>
      {lights.map((light) => {
        const ref = lightRefs.current[light.id];

        switch (light.type) {
          case 'directional':
            return (
              <directionalLight
                key={light.id}
                ref={ref}
                color={light.color}
                intensity={light.intensity * globalExposure}
                position={light.position}
                castShadow={light.shadows}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={500}
                shadow-normalBias={1 - light.shadowIntensity}
              >
                {expandedLightId === light.id && ref.current && (
                  <primitive object={new DirectionalLightHelper(ref.current, 5)} />
                )}
              </directionalLight>
            );
          case 'point':
            return (
              <pointLight
                key={light.id}
                ref={ref}
                color={light.color}
                intensity={light.intensity * globalExposure}
                position={light.position}
                distance={light.distance}
                castShadow={light.shadows}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={500}
                shadow-normalBias={1 - light.shadowIntensity}
              >
                {expandedLightId === light.id && ref.current && (
                  <primitive object={new PointLightHelper(ref.current, 5)} />
                )}
              </pointLight>
            );
          case 'spot':
            return (
              <spotLight
                key={light.id}
                ref={ref}
                color={light.color}
                intensity={light.intensity * globalExposure}
                position={light.position}
                angle={light.angle}
                penumbra={light.penumbra}
                distance={light.distance}
                castShadow={light.shadows}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={500}
                shadow-normalBias={1 - light.shadowIntensity}
              >
                {expandedLightId === light.id && ref.current && (
                  <primitive object={new SpotLightHelper(ref.current)} />
                )}
              </spotLight>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default Lights;
