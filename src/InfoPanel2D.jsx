
 
import React,{useEffect, useRef, useState} from 'react';

function InfoPanel2D({
  object,
  onColorChange,
  onMaterialChange,
  onTransparentToggle,
  onOpacityChange,
  onDepthTestToggle,
  onDepthWriteToggle,
  onAlphaHashToggle,
  onFlatShadingToggle,
  onClose
}) 
{
  const colorPickerRef = useRef(null);
  const colorPickerInstanceRef = useRef(null);
  const [colorInfo, setColorInfo] = useState({
    hex: '',
  });

  useEffect(() => {
    // Load iro.js
    if (!window.iro) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@jaames/iro/dist/iro.min.js";
      script.async = true;
      script.onload = initColorPicker;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      initColorPicker();
    }
  }, []);

  const initColorPicker = () => {
    if (colorPickerInstanceRef.current || !colorPickerRef.current) return;

    colorPickerInstanceRef.current = new window.iro.ColorPicker(colorPickerRef.current, {
      width: 180,
      color: object.material.color.getHexString(),
      borderWidth: 5,
      borderColor: "#f5f5f5",
    });

    colorPickerInstanceRef.current.on(["color:init", "color:change"], handleColorChange);
  };

  const handleColorChange = (color) => {
    setColorInfo({
      hex: color.hexString,
      rgb: color.rgbString,
      hsl: color.hslString
    });
    onColorChange(object, color.hexString);
  };

  const handleHexInputChange = (e) => {
    const newColor = e.target.value;
    if (colorPickerInstanceRef.current) {
      colorPickerInstanceRef.current.color.hexString = newColor;
    }
    onColorChange(object, newColor);
  };
   

  if (!object) return null;

  const { material } = object;
  const materialTypes = [
    'MeshBasicMaterial',
    'MeshLambertMaterial',
    'MeshPhongMaterial',
    'MeshStandardMaterial',
    'MeshNormalMaterial',
    'MeshPhysicalMaterial',
    'MeshToonMaterial',
    'MeshMatcapMaterial'
  ];


  return(
    <div className="info-panel">
      <div className="info-close">
        <button className="close-button" onClick={onClose}>
            &times;
        </button>
      </div>
      <div className="info-header">
        <h2>Info Panel</h2>
      </div>

      {material && (
        <div>
          <label>Color</label>
          <div ref={colorPickerRef} className="ms-colorpicker"></div>
          <input 
           type="text"
           id="hexInput"
           value={colorInfo.hex}
           onChange={handleHexInputChange} 
           />
          <div id="colorSwatch" style={{backgroundColor: colorInfo.hex }}></div>
          
        </div>
      )}

      <div>
        <label>Material</label>
        <select value={material.type} onChange={(e) => onMaterialChange(object, e.target.value)}>
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            checked={material.transparent}
            onChange={() => onTransparentToggle(object)}
          />
          Transparent
        </label>
      </div>
      {material.transparent && (
        <div>
          <label>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={material.opacity}
            onChange={(e) => onOpacityChange(object, parseFloat(e.target.value))}
          />
        </div>
      )}
      <div>
        <label>
          <input
            type="checkbox"
            checked={material.depthTest}
            onChange={() => onDepthTestToggle(object)}
          />
          Depth Test
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={material.depthWrite}
            onChange={() => onDepthWriteToggle(object)}
          />
          Depth Write
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={material.alphaHash}
            onChange={() => onAlphaHashToggle(object)}
          />
          Alpha Hash
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={material.flatShading}
            onChange={() => onFlatShadingToggle(object)}
          />
          Flat Shading
        </label>
      </div>
    </div>
  );
}

export default InfoPanel2D;