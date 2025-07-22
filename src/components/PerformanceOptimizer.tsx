import React, { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface LazyComponentProps {
  children: React.ReactNode;
  threshold?: number;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  threshold = 0.1,
  fallback = <div className="bg-muted h-32 w-full rounded" />,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(ref, {
    threshold,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      setIsVisible(true);
    }
  }, [entry]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

interface ImageOptimizerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const OptimizedImage: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className,
  fallback = "/placeholder.svg",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'navigation') {
            const navigationEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Time:', navigationEntry.loadEventEnd - navigationEntry.loadEventStart);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'navigation'] });
      } catch (e) {
        console.log('Performance Observer not supported');
      }

      return () => observer.disconnect();
    }
  }, []);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // No images to preload - removed all external assets
};