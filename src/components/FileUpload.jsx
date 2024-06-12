import { useRef } from 'react';

export default function FileUploader({ onFileUpload }) {
  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
    </div>
  );
}
