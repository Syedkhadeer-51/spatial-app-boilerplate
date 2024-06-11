import React, { useEffect } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const Compressor = ({ model, originalSize }) => {
  useEffect(() => {
    if (model && originalSize > 0) {
      console.log('Starting export process');
      const exporter = new GLTFExporter();
      exporter.parse(
        model,
        (result) => {
          console.log('Export process completed');
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
        },
        { binary: true }
      );
    }
  }, [model, originalSize]);

  return null;
};

export default Compressor;
