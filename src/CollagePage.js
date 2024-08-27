import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import gsap from 'gsap';
import {
  Image as KonvaImage,
  Layer,
  Stage,
} from 'react-konva';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';

Modal.setAppElement('#root');

function CollagePage() {
  const { state } = useLocation();
  const images = useMemo(() => state?.images || [], [state?.images]);

  const [loadedImages, setLoadedImages] = useState([]);
  const [animationSettings, setAnimationSettings] = useState(
    images.map(() => ({ type: 'none', duration: 2, angle: 360, scale: 1 }))
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRefs = useRef([]);

  useEffect(() => {
    const loadImages = async () => {
      const loaded = await Promise.all(
        images.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
          });
        })
      );
      setLoadedImages(loaded);
    };
    loadImages();
  }, [images]);

  useEffect(() => {
    loadedImages.forEach((img, index) => {
      const imgNode = imageRefs.current[index];
      const { type, duration, angle, scale } = animationSettings[index] || {};

      // Прекращаем все анимации перед применением новых
      gsap.killTweensOf(imgNode);

      if (imgNode && type !== 'none') {
        const animation = {
          duration,
          repeat: -1,
          ease: 'linear',
        };

        if (type === 'rotate') {
          gsap.to(imgNode, { ...animation, rotation: angle });
        } else if (type === 'scale') {
          gsap.to(imgNode, {
            ...animation,
            scaleX: scale,
            scaleY: scale,
            repeat: -1,
            yoyo: true
          });
        }
      }
    });
  }, [loadedImages, animationSettings]);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const handleAnimationChange = (type, value) => {
    const newSettings = [...animationSettings];
    newSettings[selectedImage] = { ...newSettings[selectedImage], [type]: value };
    setAnimationSettings(newSettings);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="collage-page">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {loadedImages.map((image, index) => (
            <KonvaImage
              key={index}
              image={image}
              ref={(node) => { imageRefs.current[index] = node; }}
              x={100 * index}
              y={100}
              width={100}
              height={100}
              draggable
              onClick={() => handleImageClick(index)}
            />
          ))}
        </Layer>
      </Stage>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Animation Settings"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedImage !== null && (
          <div className="animation-controls">
            <h3>Анимация для изображения {selectedImage + 1}</h3>
            <label>
              Тип анимации:
              <select
                value={animationSettings[selectedImage]?.type}
                onChange={(e) => handleAnimationChange('type', e.target.value)}
              >
                <option value="none">Нет</option>
                <option value="rotate">Вращение</option>
                <option value="scale">Изменение размеров</option>
              </select>
            </label>
            {animationSettings[selectedImage]?.type === 'rotate' && (
              <label>
                Угол вращения:
                <input
                  type="number"
                  value={animationSettings[selectedImage]?.angle}
                  onChange={(e) => handleAnimationChange('angle', e.target.value)}
                />
              </label>
            )}
            {animationSettings[selectedImage]?.type === 'scale' && (
              <label>
                Масштаб:
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={animationSettings[selectedImage]?.scale}
                  onChange={(e) => handleAnimationChange('scale', e.target.value)}
                />
              </label>
            )}
            <label>
              Скорость анимации:
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={animationSettings[selectedImage]?.duration}
                onChange={(e) => handleAnimationChange('duration', e.target.value)}
              />
            </label>
            <button onClick={handleModalClose}>Закрыть</button>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .modal {
          content: {
            position: 'absolute';
            top: '50%';
            left: '50%';
            transform: 'translate(-50%, -50%)';
            width: '400px';
            height: '400px';
            padding: '20px';
            background: '#ff0000';
            border-radius: '10px';
          }
        }
        .modal-overlay {
          position: 'fixed';
          top: '0';
          left: '0';
          right: '0';
          bottom: '0';
          background: 'rgba(0, 0, 0, 0.5)';
        }
        .animation-controls {
          display: 'flex';
          flex-direction: 'column';
          gap: '10px';
        }
        .animation-controls label {
          display: 'block';
          margin: '5px 0';
        }
      `}</style>
    </div>
  );
}

export default CollagePage;
