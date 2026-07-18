import React, { useState, useRef, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0-100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;

    // Constrain position between 0 and 100
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Global mouseup/touchend listeners to stop dragging even if cursor leaves the container
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
    
      className="slider-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
        <h1>Empty Wall Into Best Wall</h1>
      {/* "After" Image (Background) */}
      <img 
        src={afterImage || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"} 
        alt="After" 
        className="slider-image image-after"
        draggable="false"
      />

      {/* "Before" Image (Foreground, clipped based on state) */}
      <div 
        className="image-before-container" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"} 
          alt="Before" 
          className="slider-image image-before"
          draggable="false"
        />
      </div>

      {/* The Slider Line & Handle */}
      <div 
        className="slider-bar" 
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="slider-handle">
          {/* Icon representation of the "|||" handles */}
          <div className="handle-line"></div>
          <div className="handle-line"></div>
          <div className="handle-line"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;