import { useEffect } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export default function CompressExportButton({ modelRef, modelLoaded, originalSize }) {
  const handleExport = () => {
    if (modelLoaded) {
      console.log('Starting export process');
      console.log('Original File Size:', originalSize, 'bytes');
      const exporter = new GLTFExporter();

      // Ensure modelRef.current is defined and log it
      if (!modelRef.current) {
        console.error('modelRef.current is not defined');
        return;
      }
      console.log('Model reference:', modelRef.current);

      exporter.parse(
        modelRef.current,
        (result) => {
          const output = JSON.stringify(result, null, 2);
          const compressedBlob = new Blob([output], { type: 'application/json' });
          const compressedSize = compressedBlob.size;

          // Log the compressed file size
          console.log('Compressed File Size:', compressedSize, 'bytes');

          // Calculate and log the compression ratio or percentage
          const compressionRatio = (originalSize - compressedSize) / originalSize;
          const compressionPercentage = compressionRatio * 100;
          console.log('Compression Ratio:', compressionRatio.toFixed(2));
          console.log('Compression Percentage:', compressionPercentage.toFixed(2), '%');

          // Create a URL for the Blob and trigger a download
          const url = URL.createObjectURL(compressedBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'compressed_model.glb';
          link.click();

          // Cleanup the URL
          URL.revokeObjectURL(url);
        },
        { binary: true }
      );
    } else {
      console.log('Model is not loaded yet');
    }
  };

  return (
    <button onClick={handleExport} style={{ marginTop: '20px', border: '1px solid black' }}>
      Compress and Export
    </button>
  );
}
