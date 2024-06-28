import React from 'react';
import { useEffect,useState } from 'react';
import { modelUrls } from './atoms';
import { inputModelUrl } from './atoms';
import { useAtom } from 'jotai';


export function ModelName() {
    const [isUrlUnique, setIsUrlUnique] = useState(true); // State to track if the URL is unique
    const [ModelUrls,setModelUrls] = useAtom(modelUrls);
    const [InputModelUrl,setInputModelUrl] = useAtom(inputModelUrl);
    useEffect(() => {
        // Check if the input URL is already in modelUrls

        console.log(InputModelUrl);
        console.log(ModelUrls)
        const urlExists =  ModelUrls.some(model => model.name === InputModelUrl+'.glb');
        setIsUrlUnique(!urlExists);
      }, [InputModelUrl, ModelUrls]);
    
      const handleInputChange = (event) => {
        setInputModelUrl(event.target.value);
      };
    return (
        <div style={{float:'left',padding:'5px'}}>
        <label htmlFor="model-url-input">Enter Model name:</label>
        <input
          id="model-url-input"
          type="text"
          value={InputModelUrl}
          onChange={handleInputChange}
          placeholder="Enter a new model name"
        />
        {!isUrlUnique && <p style={{ color: 'red' }}>This model name is taken will be replaced</p>}
        </div>
    );
}