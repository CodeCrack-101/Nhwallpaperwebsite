/**
 * Lazy Image Loader Component with Mosaic Indicator
 * Location: frontend/src/components/common/ImageLoader.jsx
 * Description: Uses IntersectionObserver for lazy loading images. Displays the
 *              Mosaic loader while the image is fetching or out of view, and smoothly
 *              fades in the actual image once loaded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mosaic } from 'react-loading-indicators';

const ImageLoader = ({
    src,
    alt = '',
    className = '',
    style = {},
    containerStyle = {},
    mosaicSize = 'small',
    mosaicColor = '#111511',
    onClick,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        // IntersectionObserver to delay image request until element approaches viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px 0px', // Preload when within 200px of viewport
                threshold: 0.01
            }
        );

        observer.observe(node);

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setIsLoaded(true);
        setHasError(true);
    };

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f7',
                borderRadius: style.borderRadius || 'inherit',
                ...containerStyle
            }}
            className={`image-loader-container ${className}`}
        >
            {/* Show Mosaic Loader while out of viewport or loading */}
            {(!isVisible || !isLoaded) && !hasError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f7f7f7',
                    zIndex: 1,
                    transition: 'opacity 0.3s ease'
                }}>
                    <Mosaic color={mosaicColor} size={mosaicSize} text="" textColor="" />
                </div>
            )}

            {/* Fallback if image path is broken */}
            {hasError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#999',
                    fontSize: '12px',
                    fontFamily: 'sans-serif'
                }}>
                    <span>Image unavailable</span>
                </div>
            )}

            {/* Actual Lazy Image */}
            {isVisible && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: style.objectFit || 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.4s ease-in-out',
                        ...style
                    }}
                    {...props}
                />
            )}
        </div>
    );
};

export default ImageLoader;
