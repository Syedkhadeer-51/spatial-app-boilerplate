/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import gentilis_regular from '/public/fonts/gentilis_regular.json';
import helvetiker_regular from '/public/fonts/helvetiker_regular.json';
import optimer_regular from '/public/fonts/optimer_regular.json';
import dancingScript_regular from '/public/fonts/dancingScript_regular.json';

const AnimatedText = ({
  text,
  fontSize,
  fontColor,
  selectedFont,
  transparency,
  scale,
  animationType,
  position,
  speedFactor
}) => {
  const textRef = useRef();
  const initialPosition = useRef({ ...position });

  useEffect(() => {
    initialPosition.current = { ...position };
    textRef.current.position.set(initialPosition.current.x, initialPosition.current.y, initialPosition.current.z);
  }, [position]);

  useEffect(() => {
    textRef.current.position.set(initialPosition.current.x, initialPosition.current.y, initialPosition.current.z);
  }, [animationType]);

  useEffect(() => {
    if (animationType === 'none') {
      textRef.current.position.set(initialPosition.current.x, initialPosition.current.y, initialPosition.current.z);
    }
  }, [animationType]);

  useFrame(() => {
    if (animationType === 'bounce') {
      textRef.current.position.y = initialPosition.current.y + Math.sin(Date.now() * 0.002 * speedFactor) * 0.5;
    } else if (animationType === 'spin') {
      textRef.current.rotation.y += 0.01 * speedFactor;
    } else if (animationType === 'none') {
      textRef.current.position.set(initialPosition.current.x, initialPosition.current.y, initialPosition.current.z);
      textRef.current.rotation.set(0, 0, 0);
    }
  });

  const fonts = {
    gentilis_regular,
    helvetiker_regular,
    optimer_regular,
    dancingScript_regular
  };

  return (
    <Text3D
      ref={textRef}
      font={fonts[selectedFont]}
      size={fontSize}
      scale={scale}
      height={0.3}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.01}
      bevelOffset={0}
      bevelSegments={5}
      position={[position.x, position.y, position.z]}
    >
      {text}
      <meshStandardMaterial color={fontColor} transparent opacity={transparency} />
    </Text3D>
  );
};

export default AnimatedText;