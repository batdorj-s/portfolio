import React, { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
}

/**
 * Optimized Image Component for Vite + React
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder while loading
 * - Smooth fade-in animation
 * - WebP format support with fallback
 * - Priority loading for hero images
 */
export function OptimizedImage({
  src,
  alt,
  blurDataURL,
  priority = false,
  className = '',
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert image path to WebP for optimization
  const getOptimizedPath = (imagePath: string): string => {
    if (imagePath.endsWith('.webp')) return imagePath;
    return imagePath.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
  };

  const webpSrc = getOptimizedPath(src);
  const defaultBlur =
    blurDataURL ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbiBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI0MCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiBmaWxsPSIjMDAwMEZGIiBvcGFjaXR5PSIwLjEiIC8+PC9zdmc+';

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority) return; // Priority images load immediately

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Blur placeholder - visible while loading */}
      {!isLoaded && (
        <img
          src={defaultBlur}
          alt={`${alt} placeholder`}
          className="optimized-image-blur"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            opacity: 0.8,
          }}
        />
      )}

      {/* Picture element with WebP support */}
      {isVisible && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            className={`optimized-image ${isLoaded ? 'optimized-image-loaded' : 'optimized-image-loading'}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </picture>
      )}

      {/* Loading skeleton animation for extra visual feedback */}
      {!isLoaded && isVisible && (
        <div className="optimized-image-skeleton" aria-hidden="true">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
