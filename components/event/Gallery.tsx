'use client';

import { useState, useEffect, useCallback } from 'react';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show first 4 images in preview grid
  const previewImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowLeft': prevImage(); break;
        case 'ArrowRight': nextImage(); break;
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  // Touch swipe
  let touchStartX = 0;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  }

  return (
    <>
      <section id="gallery" className="gallery-section">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll">Nuestra Historia</h2>
          <p className="section-subtitle animate-on-scroll">Momentos que atesoramos</p>

          <div className="gallery-preview">
            {previewImages.map((src, i) => (
              <div
                key={i}
                className={`gallery-item animate-on-scroll ${i === 3 ? 'gallery-more' : ''}`}
                data-index={i}
                onClick={() => openLightbox(i === 3 ? 0 : i)}
              >
                <img src={src} alt="Galería" loading="lazy" />
                {i === 3 && remainingCount > 0 && (
                  <div className="gallery-more-overlay">
                    <span className="gallery-more-count">+{remainingCount}</span>
                    <span className="gallery-more-text">Ver más fotos</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hidden gallery items for data — not displayed */}
          <div className="gallery-hidden" style={{ display: 'none' }}>
            {images.slice(4).map((src, i) => (
              <div key={i} className="gallery-item" data-index={i + 4}>
                <img src={src} alt="Galería" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          id="lightbox"
          className="lightbox active"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <button className="lightbox-prev" onClick={prevImage}>&larr;</button>
          <button className="lightbox-next" onClick={nextImage}>&rarr;</button>
          <div className="lightbox-content">
            <img
              id="lightbox-img"
              src={images[currentIndex]}
              alt="Galería"
              style={{ transition: 'opacity 0.15s ease' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
