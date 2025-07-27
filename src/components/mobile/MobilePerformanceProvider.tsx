import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobilePerformanceContextType {
  isLoading: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  isLowEndDevice: boolean;
  enableAnimations: boolean;
  lazyLoadImages: boolean;
}

const MobilePerformanceContext = createContext<MobilePerformanceContextType>({
  isLoading: false,
  connectionSpeed: 'unknown',
  isLowEndDevice: false,
  enableAnimations: true,
  lazyLoadImages: false,
});

export const useMobilePerformance = () => useContext(MobilePerformanceContext);

interface Props {
  children: React.ReactNode;
}

export const MobilePerformanceProvider: React.FC<Props> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    // Detect connection speed
    const detectConnectionSpeed = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        const speed = connection.effectiveType;
        setConnectionSpeed(['slow-2g', '2g', '3g'].includes(speed) ? 'slow' : 'fast');
      }
    };

    // Detect device performance
    const detectDevicePerformance = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 4;
      
      // Consider low-end device if it has <= 2 cores or <= 2GB RAM
      setIsLowEndDevice(hardwareConcurrency <= 2 || memory <= 2);
    };

    detectConnectionSpeed();
    detectDevicePerformance();

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', detectConnectionSpeed);
      return () => connection.removeEventListener('change', detectConnectionSpeed);
    }
  }, [isMobile]);

  const enableAnimations = !isLowEndDevice && connectionSpeed !== 'slow';
  const lazyLoadImages = isMobile && (isLowEndDevice || connectionSpeed === 'slow');

  const value = {
    isLoading,
    connectionSpeed,
    isLowEndDevice,
    enableAnimations,
    lazyLoadImages,
  };

  return (
    <MobilePerformanceContext.Provider value={value}>
      {children}
    </MobilePerformanceContext.Provider>
  );
};