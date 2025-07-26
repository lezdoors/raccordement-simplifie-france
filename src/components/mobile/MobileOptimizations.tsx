import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const MobileOptimizations = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Prevent zoom on input focus (iOS)
    const addNoZoomMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    };

    // Restore zoom after input blur
    const restoreZoomMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0'
        );
      }
    };

    // Handle input focus/blur for zoom prevention
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focusin', addNoZoomMeta);
      input.addEventListener('focusout', restoreZoomMeta);
    });

    // Improve touch responsiveness
    document.body.style.touchAction = 'manipulation';
    
    // Enhanced scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Prevent pull-to-refresh on forms
    const preventPullRefresh = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventPullRefresh, { passive: false });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focusin', addNoZoomMeta);
        input.removeEventListener('focusout', restoreZoomMeta);
      });
      document.removeEventListener('touchstart', preventPullRefresh);
    };
  }, [isMobile]);

  // Set CSS custom properties for mobile
  useEffect(() => {
    if (!isMobile) return;

    const setMobileVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setMobileVH();
    window.addEventListener('resize', setMobileVH);
    window.addEventListener('orientationchange', setMobileVH);

    return () => {
      window.removeEventListener('resize', setMobileVH);
      window.removeEventListener('orientationchange', setMobileVH);
    };
  }, [isMobile]);

  return null;
};