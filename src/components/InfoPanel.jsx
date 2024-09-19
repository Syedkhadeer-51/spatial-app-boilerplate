import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

function InfoPanel({
  object,
  onClose,
  onColorChange,
  onMaterialChange,
  onWireframeToggle,
  onTransparentToggle,
  onOpacityChange,
  onDepthTestToggle,
  onDepthWriteToggle,
  onAlphaHashToggle,
  onSideChange,
  onFlatShadingToggle,
  onVertexColorsToggle,
  onGeometryChange,
  onSizeChange,
  onExport,
}) {
  const [color, setColor] = useState('#ffffff');
  const [material, setMaterial] = useState('MeshBasicMaterial');
  const [geometry, setGeometry] = useState('BoxGeometry');
  const [size, setSize] = useState(1);
  const [side, setSide] = useState(THREE.FrontSide);
  const [opacity, setOpacity] = useState(1);
  const [isTransparent, setIsTransparent] = useState(false);
  const [isToggledWireframe, setIsToggledWireframe] = useState(false);
  const [isToggledDepthTest, setIsToggledDepthTest] = useState(false);
  const [isToggledDepthWrite, setIsToggledDepthWrite] = useState(false);
  const [isToggledAlphaHash, setIsToggledAlphaHash] = useState(false);
  const [isToggledFlatShading, setIsToggledFlatShading] = useState(false);
  const [isToggledVertexColors, setIsToggledVertexColors] = useState(false);
  const viewerRef = useRef();

  useEffect(() => {
    if (object) {
      setColor(`#${object.material.color.getHexString()}`);
      setMaterial(object.material.type);
      setGeometry(object.geometry.type);
      setSize(object.scale.x);
      setSide(object.material.side);
      setOpacity(object.material.opacity);
      setIsTransparent(object.material.transparent);

      // Set up 3D Viewer
      const viewerElement = viewerRef.current;
      const width = viewerElement.clientWidth;
      const height = viewerElement.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      viewerElement.appendChild(renderer.domElement);

      const clonedObject = object.clone();
      clonedObject.position.set(0, 0, 0);
      clonedObject.rotation.set(0, 0, 0);
      clonedObject.scale.set(1, 1, 1);

      scene.add(clonedObject);

      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      camera.position.z = 2;

      const animate = function () {
        requestAnimationFrame(animate);
        clonedObject.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        // Clean up the viewer when the component unmounts
        while (viewerElement.firstChild) {
          viewerElement.removeChild(viewerElement.firstChild);
        }
      };
    }
  }, [object]);

  if (!object) return null;

  const handleOpacityChange = (value) => {
    setOpacity(value);
    onOpacityChange(object, value);
  };

  return (
    <div className="info-panel">
      <div className="header">
        <h2>Info Panel</h2>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div ref={viewerRef} className="viewer" style={{ width: '100%', height: '200px', backgroundColor: '#333' }} />
      <p><strong>Name:</strong> {object.name ? object.name : 'Unnamed'}</p>
      <div className="control-group">
        <label>Color:</label>
        <input type="color" value={color} onChange={(e) => {
          setColor(e.target.value);
          onColorChange(object, e.target.value);
        }} />
      </div>
      <div className="control-group">
        <label>Material:</label>
        <select value={material} onChange={(e) => {
          setMaterial(e.target.value);
          onMaterialChange(object, e.target.value);
        }}>
          <option value="MeshBasicMaterial">Basic</option>
          <option value="MeshLambertMaterial">Lambert</option>
          <option value="MeshPhongMaterial">Phong</option>
          <option value="MeshStandardMaterial">Standard</option>
          <option value="MeshNormalMaterial">Normal</option>
          <option value="MeshPhysicalMaterial">Physical</option>
          <option value="MeshToonMaterial">Toon</option>
          <option value="MeshMatcapMaterial">Matcap</option>
        </select>
      </div>
      <div className="control-group">
        <label>Wireframe:</label>
        <button
          className={`toggle-button ${isToggledWireframe ? 'on' : 'off'}`}
          onClick={() => {
            onWireframeToggle(object);
            setIsToggledWireframe(!isToggledWireframe);
          }}
        >
          {isToggledWireframe ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Transparent:</label>
        <button
          className={`toggle-button ${isTransparent ? 'on' : 'off'}`}
          onClick={() => {
            onTransparentToggle(object);
            setIsTransparent(!isTransparent);
          }}
        >
          {isTransparent ? 'On' : 'Off'}
        </button>
      </div>
      {isTransparent && (
        <div className="control-group">
          <label>Opacity:</label>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="opacity-slider"
            />
            <output className="opacity-output">{`${(opacity * 100).toFixed(0)}%`}</output>
          </div>
        </div>
      )}
      <div className="control-group">
        <label>Depth Test:</label>
        <button
          className={`toggle-button ${isToggledDepthTest ? 'on' : 'off'}`}
          onClick={() => {
            onDepthTestToggle(object);
            setIsToggledDepthTest(!isToggledDepthTest);
          }}
        >
          {isToggledDepthTest ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Depth Write:</label>
        <button
          className={`toggle-button ${isToggledDepthWrite ? 'on' : 'off'}`}
          onClick={() => {
            onDepthWriteToggle(object);
            setIsToggledDepthWrite(!isToggledDepthWrite);
          }}
        >
          {isToggledDepthWrite ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Alpha Hash:</label>
        <button
          className={`toggle-button ${isToggledAlphaHash ? 'on' : 'off'}`}
          onClick={() => {
            onAlphaHashToggle(object);
            setIsToggledAlphaHash(!isToggledAlphaHash);
          }}
        >
          {isToggledAlphaHash ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Side:</label>
        <select value={side} onChange={(e) => {
          setSide(e.target.value);
          onSideChange(object, e.target.value);
        }}>
          <option value={THREE.FrontSide}>Front</option>
          <option value={THREE.BackSide}>Back</option>
          <option value={THREE.DoubleSide}>Double</option>
        </select>
      </div>
      <div className="control-group">
        <label>Flat Shading:</label>
        <button
          className={`toggle-button ${isToggledFlatShading ? 'on' : 'off'}`}
          onClick={() => {
            onFlatShadingToggle(object);
            setIsToggledFlatShading(!isToggledFlatShading);
          }}
        >
          {isToggledFlatShading ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Vertex Colors:</label>
        <button
          className={`toggle-button ${isToggledVertexColors ? 'on' : 'off'}`}
          onClick={() => {
            onVertexColorsToggle(object);
            setIsToggledVertexColors(!isToggledVertexColors);
          }}
        >
          {isToggledVertexColors ? 'On' : 'Off'}
        </button>
      </div>
      <div className="control-group">
        <label>Geometry:</label>
        <select value={geometry} onChange={(e) => {
          setGeometry(e.target.value);
          onGeometryChange(object, e.target.value);
        }}>
          <option value="BoxGeometry">Box</option>
          <option value="SphereGeometry">Sphere</option>
          <option value="CylinderGeometry">Cylinder</option>
          <option value="ConeGeometry">Cone</option>
          <option value="TorusGeometry">Torus</option>
        </select>
      </div>
      <div className="control-group">
        <label>Size:</label>
        <input type="number" value={size} onChange={(e) => {
          setSize(e.target.value);
          onSizeChange(object, e.target.value);
        }} />
      </div>
    </div>
  );
}

export default InfoPanel;
