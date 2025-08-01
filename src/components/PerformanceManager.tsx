import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Consolidated Performance Manager
 * Handles all performance optimizations in one place
 */
export const PerformanceManager = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set CSS custom properties for mobile viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    const handleResize = () => setVH();
    const handleOrientationChange = () => setTimeout(setVH, 100);

    // Critical performance optimizations
    const optimizePerformance = () => {
      // 1. Optimize viewport for mobile
      if (isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      }

      // 2. Set viewport height
      setVH();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleOrientationChange);

      // 3. Optimize touch interactions
      if (isMobile) {
        document.body.style.touchAction = 'manipulation';
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        const preventDoubleTapZoom = (event: TouchEvent) => {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        };
        document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
      }

      // 4. Optimize font loading
      if (document.fonts) {
        document.fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });
      }

      // 5. Preload critical resources
      const preloadCriticalResources = () => {
        const criticalImages = [
          '/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png',
          '/lovable-uploads/07de93d6-9367-486b-8b5d-f050c8703a3e.png'
        ];

        criticalImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        });
      };

      preloadCriticalResources();

      // 6. Optimize animations based on device capability
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const isLowEndDevice = navigator.hardwareConcurrency <= 2 || (navigator as any).deviceMemory <= 2;
      
      if (prefersReducedMotion.matches || isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.classList.add('reduce-motion');
      }
    };

    optimizePerformance();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);

  // Monitor performance and report issues
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log slow resources
          if (entry.entryType === 'resource' && entry.duration > 1000) {
            console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['resource', 'navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
};