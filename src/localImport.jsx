import React from 'react';

function LocalImport({setModelPath,setExport,setToCloud}) {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {

            const url = URL.createObjectURL(file);
            setModelPath(url);
            console.log("Original File Size: "+file.size);
            setExport(false);
            setToCloud(false);         


        }
    };
    return (
        <input type="file" accept=".glb, .gltf" onChange={handleFileUpload} style={{float:'left',padding:'0',width:'190px'}}/>
    );
}

export default LocalImport;