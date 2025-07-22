import { useEffect, useState } from "react";

interface MobileDetectorProps {
  children: (props: { isMobile: boolean }) => React.ReactNode;
}

const MobileDetector = ({ children }: MobileDetectorProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return <>{children({ isMobile })}</>;
};

export default MobileDetector;