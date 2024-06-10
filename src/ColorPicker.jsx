import { useState } from 'react';
import { SketchPicker } from 'react-color';

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return { r, g, b };
};

const rgbToHex = (r, g, b) => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

const getComplementaryColor = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  return rgbToHex(compR, compG, compB);
};

const ColorPickerGrid = ({ setBackgroundColor, setGridColor, gridHelperRef }) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [backgroundColor, setBackground] = useState('#3b3b3b');

  const handleColorChange = (color) => {
    setBackground(color.hex);
    setBackgroundColor(color.hex);
    const complementaryColor = getComplementaryColor(color.hex);
    setGridColor(complementaryColor);

    // Update the gridHelper color
    if (gridHelperRef.current) {
      gridHelperRef.current.material.color.set(complementaryColor);
      gridHelperRef.current.material.needsUpdate = true;
    }
  };

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  return (
    <div className="color-picker-button">
      <button onClick={togglePicker}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2868/2868110.png" // Replace with the correct path to your icon
          alt="Color Picker Icon"
          className="color-picker-icon"
        />
        <span className="tooltip">Background Colour</span>
      </button>
      {pickerVisible && (
          <SketchPicker color={backgroundColor} onChange={handleColorChange} />
      )}
    </div>
  );
};

export default ColorPickerGrid;
