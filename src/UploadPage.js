import React, {
  useCallback,
  useState,
} from 'react';

import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const newImagesPromises = acceptedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then((newImages) => {
      setImages(newImages);
    });
  }, []);

  const handleNext = () => {
    navigate('/collage', { state: { images } });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="upload-page">
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Перетащите файлы сюда или нажмите, чтобы выбрать файлы</p>
      </div>
      {images.length > 0 && (
        <div>
          <button onClick={handleNext}>Перейти к коллажу</button>
          <div className="image-previews">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`preview-${index}`}
                style={{ width: '100px', height: '100px', margin: '10px' }}
              />
            ))}
          </div>
        </div>
      )}
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

export default UploadPage;
