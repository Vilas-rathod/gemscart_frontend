import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import './ProductGallery.css';

const ProductGallery = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx(i => (i + 1) % images.length);

  return (
    <div className="product-gallery">
      {/* Thumbnails */}
      <div className="product-gallery__thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`product-gallery__thumb ${i === activeIdx ? 'active' : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <img src={img} alt={`${name} view ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className={`product-gallery__main ${zoomed ? 'zoomed' : ''}`}>
        <img
          src={images[activeIdx]}
          alt={name}
          className="product-gallery__img"
          onClick={() => setZoomed(z => !z)}
        />

        <button className="product-gallery__zoom-hint" onClick={() => setZoomed(z => !z)} aria-label="Zoom">
          <ZoomIn size={16} />
          <span>{zoomed ? 'Click to zoom out' : 'Click to zoom'}</span>
        </button>

        {images.length > 1 && (
          <>
            <button className="product-gallery__nav product-gallery__nav--prev" onClick={prev} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button className="product-gallery__nav product-gallery__nav--next" onClick={next} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="product-gallery__dots">
          {images.map((_, i) => (
            <button key={i} className={`product-gallery__dot ${i === activeIdx ? 'active' : ''}`} onClick={() => setActiveIdx(i)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
