import React, { createContext, useContext, useEffect, useState } from "react";

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
  isHighContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  isReducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');

  // Detect user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isHighContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

    root.setAttribute('data-font-size', fontSize);
    
    if (isReducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  }, [isHighContrast, fontSize, isReducedMotion]);

  const announceMessage = (message: string) => {
    // Create or update aria-live region for screen readers
    let announcement = document.getElementById('a11y-announcer');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'a11y-announcer';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }
    
    // Clear and set message with slight delay to ensure screen readers pick it up
    announcement.textContent = '';
    setTimeout(() => {
      announcement!.textContent = message;
    }, 100);
  };

  const setHighContrast = (enabled: boolean) => {
    setIsHighContrast(enabled);
    localStorage.setItem('high-contrast', enabled.toString());
  };

  const handleSetFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    setFontSize(size);
    localStorage.setItem('font-size', size);
  };

  // Load saved preferences
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('high-contrast');
    const savedFontSize = localStorage.getItem('font-size') as 'normal' | 'large' | 'extra-large';
    
    if (savedHighContrast) {
      setIsHighContrast(savedHighContrast === 'true');
    }
    
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  const value: AccessibilityContextType = {
    announceMessage,
    isHighContrast,
    setHighContrast,
    isReducedMotion,
    fontSize,
    setFontSize: handleSetFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader only skip links */}
      <div className="sr-only">
        <a href="#main-content" className="focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded">
          Aller au contenu principal
        </a>
        <a href="#main-navigation" className="focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded">
          Aller au menu principal
        </a>
      </div>
    </AccessibilityContext.Provider>
  );
};