import React from 'react';
import { useEffect,useState } from 'react';

export function ModelName({modelUrls,inputModelUrl,setInputModelUrl}) {
    const [isUrlUnique, setIsUrlUnique] = useState(true); // State to track if the URL is unique

    useEffect(() => {
        // Check if the input URL is already in modelUrls

        console.log(inputModelUrl);
        console.log(modelUrls)
        const urlExists =  modelUrls.some(model => model.name === inputModelUrl+'.glb');
        setIsUrlUnique(!urlExists);
      }, [inputModelUrl, modelUrls]);
    
      const handleInputChange = (event) => {
        setInputModelUrl(event.target.value);
      };
    return (
        <div style={{float:'left',padding:'5px'}}>
        <label htmlFor="model-url-input">Enter Model name:</label>
        <input
          id="model-url-input"
          type="text"
          value={inputModelUrl}
          onChange={handleInputChange}
          placeholder="Enter a new model name"
        />
        {!isUrlUnique && <p style={{ color: 'red' }}>This model name is taken will be replaced</p>}
        </div>
    );
}