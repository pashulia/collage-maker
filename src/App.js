import React, {
  useCallback,
  useState,
} from 'react';

import { useDropzone } from 'react-dropzone';

function App() {
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="App">
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Drag & drop some files here, or click to select files</p>
      </div>
      <div style={previewContainerStyles}>
        {images.map((file, index) => (
          <div key={index} style={previewStyle}>
            <img src={file.preview} alt="preview" style={imageStyle} />
          </div>
        ))}
      </div>
    </div>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  padding: '20px',
  width: '400px',
  margin: '20px auto',
  textAlign: 'center',
};

const previewContainerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: '20px',
};

const previewStyle = {
  margin: '10px',
  border: '1px solid #cccccc',
  padding: '10px',
};

const imageStyle = {
  maxWidth: '200px',
  maxHeight: '200px',
};

export default App;