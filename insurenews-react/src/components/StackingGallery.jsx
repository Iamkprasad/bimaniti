import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageFallback from './ImageFallback';
import { STACK_IMAGES } from '../data/stackImages';

export default function StackingGallery() {
  const [errors, setErrors] = useState({});

  const handleImgError = (id) => {
    setErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="stack-container">
      {STACK_IMAGES.map((item) => (
        <div key={item.id} className="stack-layer">
          <div className="stack-card">
            {errors[item.id] ? (
              <ImageFallback height="240px" />
            ) : (
              <img
                src={item.src}
                alt={item.title}
                onError={() => handleImgError(item.id)}
              />
            )}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
