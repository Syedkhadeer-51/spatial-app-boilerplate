// Lights.jsx
import React from 'react';
import { DirectionalLight, PointLight, SpotLight, DirectionalLightHelper, PointLightHelper, SpotLightHelper } from 'three';
import { useFrame } from '@react-three/fiber';

const Lights = ({ lights, expandedLightId, globalExposure }) => {
  return (
    <>
      {lights.map((light) => {
        switch (light.type) {
          case 'directional':
            return (
              <directionalLight
                key={light.id}
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
                {expandedLightId === light.id && (
                  <primitive object={new DirectionalLightHelper()} />
                )}
              </directionalLight>
            );
          case 'point':
            return (
              <pointLight
                key={light.id}
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
                {expandedLightId === light.id && (
                  <primitive object={new PointLightHelper()} />
                )}
              </pointLight>
            );
          case 'spot':
            return (
              <spotLight
                key={light.id}
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
                {expandedLightId === light.id && (
                  <primitive object={new SpotLightHelper()} />
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
