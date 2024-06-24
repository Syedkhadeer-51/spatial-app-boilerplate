import { useState } from "react";
import LocalImport from "./localImport";
import Dropdown from "./dropdown";
import { ModelName } from "./modelName";
import { exports } from "./atoms";
import { toCloud } from "./atoms";
import { useAtom } from "jotai";
import { modelPath } from "./atoms";
import { inputModelUrl } from "./atoms";
import Draggable from 'react-draggable';

export default function UiForFirebase() {
   const [Exports,setExport]=useAtom(exports);
   const [Tocloud,setToCloud]=useAtom(toCloud);
   const [InputModelUrl,setInputModelUrl]=useAtom(inputModelUrl);
   const [ModelPath,setModelPath]=useAtom(modelPath);


   return(
      <Draggable>
<div style={{position:'absolute', zIndex:'1',left:'100px',top:'7px',backgroundColor:'rgba(0,0,0,0.5)',borderRadius:'10px',color:'white'}}>
      <LocalImport/>
      <div style={{float:'left',margin:'0px 10px 0px 0px'}}> OR </div>
      <Dropdown/>
      {ModelPath&& InputModelUrl &&
      <button onClick={()=>{setExport(true)}} style={{margin:'0px 20px'}} className='hover-button'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="download" className='icon'><g><g><rect width="16" height="2" x="4" y="18" rx="1" ry="1"></rect><rect width="4" height="2" x="3" y="17" rx="1" ry="1" transform="rotate(-90 5 18)"></rect><rect width="4" height="2" x="17" y="17" rx="1" ry="1" transform="rotate(-90 19 18)"></rect><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"></path><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"></path></g></g></svg>
      </button>}
      {ModelPath && InputModelUrl &&
      <button onClick={()=>{setToCloud(true)}}>
      <img src="./firebase.png" alt="" style={{width:'20px'}}/>
      <span >Export to firebase</span>
      </button>}
      {ModelPath &&
      <ModelName/>}
      </div>
      </Draggable>

   );
    
  }