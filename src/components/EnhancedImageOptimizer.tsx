import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  blurhash?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const EnhancedOptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '/placeholder.svg',
  blurhash,
  priority = false,
  sizes = '100vw',
  quality = 85,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection observer for lazy loading
  const entry = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isInView) {
      setIsInView(true);
      setImageSrc(src);
    }
  }, [entry, src, isInView]);

  // Handle image load and error
  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
  };

  // Generate optimized image URL with CDN parameters
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a CDN URL or external URL, return as is
    if (originalSrc.includes('://') && !originalSrc.includes('raccordement-connect.com')) {
      return originalSrc;
    }

    // For internal images, add optimization parameters
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', 'webp');
    
    return url.toString();
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    const baseUrl = getOptimizedSrc(originalSrc);
    const url = new URL(baseUrl);
    
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths.map(width => {
      url.searchParams.set('width', width.toString());
      return `${url.toString()} ${width}w`;
    }).join(', ');
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: blurhash ? '#f0f0f0' : 'transparent' }}
    >
      {/* Blurhash placeholder */}
      {blurhash && !isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3C/svg%3E")`,
            filter: 'blur(2px)'
          }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Main image */}
      {imageSrc && (
        <img
          src={getOptimizedSrc(imageSrc)}
          srcSet={generateSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image non disponible
        </div>
      )}
    </div>
  );
};

// Progressive image loader component
interface ProgressiveImageProps {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  className?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  lowQualitySrc,
  highQualitySrc,
  alt,
  className = '',
}) => {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      setIsInView(true);
    }
  }, [entry]);

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.onload = () => setHighResLoaded(true);
      img.src = highQualitySrc;
    }
  }, [isInView, highQualitySrc]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          highResLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(2px)' }}
      />
      
      {/* High quality image */}
      {isInView && (
        <img
          src={highQualitySrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            highResLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

// Hook for preloading critical images
export const useImagePreloader = (imageSources: string[]) => {
  useEffect(() => {
    imageSources.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup preload links
      imageSources.forEach(src => {
        const link = document.querySelector(`link[href="${src}"]`);
        if (link) {
          document.head.removeChild(link);
        }
      });
    };
  }, [imageSources]);
};