import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Percentages of screen height [30, 60, 90]
  initialSnap?: number; // Index of initial snap point
  showHandle?: boolean;
  className?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [30, 60, 90],
  initialSnap = 1,
  showHandle = true,
  className = '',
}) => {
  const isMobile = useIsMobile();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(sheetRef.current.offsetHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sheetRef.current) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const newHeight = Math.max(
      window.innerHeight * 0.2, // Minimum 20% height
      Math.min(window.innerHeight * 0.95, startHeight - deltaY) // Maximum 95% height
    );

    sheetRef.current.style.height = `${newHeight}px`;
  };

  const handleTouchEnd = () => {
    if (!isDragging || !sheetRef.current) return;

    setIsDragging(false);
    const currentHeight = sheetRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const currentPercentage = (currentHeight / windowHeight) * 100;

    // Find closest snap point
    let closestSnap = 0;
    let closestDistance = Math.abs(snapPoints[0] - currentPercentage);

    snapPoints.forEach((snap, index) => {
      const distance = Math.abs(snap - currentPercentage);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSnap = index;
      }
    });

    // If dragged down significantly from the lowest snap point, close
    if (currentPercentage < snapPoints[0] - 10) {
      onClose();
      return;
    }

    setCurrentSnap(closestSnap);
    sheetRef.current.style.height = `${snapPoints[closestSnap]}vh`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isMobile || !isOpen) {
    return null;
  }

  const sheetContent = (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className={`w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl transition-all duration-300 ease-out ${className}`}
        style={{
          height: `${snapPoints[currentSnap]}vh`,
          maxHeight: '95vh',
          minHeight: '20vh',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-safe">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(sheetContent, document.body);
};