import React, { useState, useEffect, useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { Clock } from 'three';

extend({ EffectComposer, RenderPass, OutlinePass });

const MeshSelection = ({ selectedObject }) => {
  const { scene, camera, gl, size } = useThree();
  const [composer] = useState(() => new EffectComposer(gl));
  const [outlinePass] = useState(() => new OutlinePass(size, scene, camera));
  const [clickedObject, setClickedObject] = useState(null);
  const hoveredObjectRef = useRef(null);
  const clock = new Clock();

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(outlinePass);
  }, [composer, scene, camera]);

  useEffect(() => {
    outlinePass.visibleEdgeColor.set(selectedObject ? '#ffff00' : '#ff0000');
    outlinePass.edgeGlow = 2;
    outlinePass.edgeThickness = 3;
    outlinePass.selectedObjects = selectedObject ? [selectedObject] : [];
  }, [outlinePass, selectedObject]);

  useFrame(() => {
    composer.render();
  }, 1);

  useFrame(({ raycaster, mouse }) => {
    if (clock.getElapsedTime() > 0.5) {
      clock.start();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const selected = intersects[0].object;
        if (selected !== hoveredObjectRef.current) {
          hoveredObjectRef.current = selected;
          outlinePass.selectedObjects = clickedObject === selected ? [] : [selected];
        }
      } else if (hoveredObjectRef.current) {
        hoveredObjectRef.current = null;
        outlinePass.selectedObjects = clickedObject ? [clickedObject] : [];
      }
    }
  });

  useEffect(() => {
    const handleClick = (event) => {
      if (hoveredObjectRef.current) {
        setClickedObject(hoveredObjectRef.current);
        outlinePass.visibleEdgeColor.set('#ffff00');
        console.log(hoveredObjectRef.current.name);
        outlinePass.selectedObjects = [hoveredObjectRef.current];

        const content = `Selected mesh: ${hoveredObjectRef.current.name}`;

        const accessBar = document.getElementById('accessbar');
        if (accessBar) {
          accessBar.textContent = content;
        }
      } else {
        setClickedObject(null);
        outlinePass.selectedObjects = [];

        const accessBar = document.getElementById('accessbar');
        if (accessBar) {
          accessBar.textContent = '';
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default MeshSelection;
