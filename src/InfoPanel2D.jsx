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
    onVertexColorsToggle,
    onClose
    
  }) {
    if (!object) return null;
  
    const { geometry, material, name } = object;
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
              X
          </button>
        </div>
        <div className="info-header">
          
          <h2>Info Panel</h2>
          
        </div>
  
        
        {material && (
          <div>
            <label>Color</label>
            <input
              type="color"
              value={`#${material.color ? material.color.getHexString() : 'ffffff'}`}
              onChange={(e) => onColorChange(object, e.target.value)}
            />
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