import { useEffect } from "react";

/**
 * Mobile Performance Optimizer Component
 * Handles mobile-specific performance optimizations and viewport fixes
 */
const MobilePerformanceOptimizer = () => {
  useEffect(() => {
    // Fix viewport height for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial set
    setVH();

    // Update on resize
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100); // Delay for orientation change
    });

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    // Add mobile-specific meta tags for better performance
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // Add apple-touch-icon and mobile-web-app-capable for PWA-like experience
    const addMobileMetaTags = () => {
      // Apple mobile web app capable
      let appleMobileWebAppCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!appleMobileWebAppCapable) {
        appleMobileWebAppCapable = document.createElement('meta');
        appleMobileWebAppCapable.setAttribute('name', 'apple-mobile-web-app-capable');
        appleMobileWebAppCapable.setAttribute('content', 'yes');
        document.head.appendChild(appleMobileWebAppCapable);
      }

      // Apple mobile web app status bar style
      let appleStatusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!appleStatusBarStyle) {
        appleStatusBarStyle = document.createElement('meta');
        appleStatusBarStyle.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        appleStatusBarStyle.setAttribute('content', 'black-translucent');
        document.head.appendChild(appleStatusBarStyle);
      }

      // Theme color for mobile browsers
      let themeColor = document.querySelector('meta[name="theme-color"]');
      if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.setAttribute('name', 'theme-color');
        themeColor.setAttribute('content', '#1e3a8a'); // Primary color
        document.head.appendChild(themeColor);
      }
    };

    addMobileMetaTags();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MobilePerformanceOptimizer;