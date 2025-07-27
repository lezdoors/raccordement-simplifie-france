import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export const MobileGestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onTap,
  onLongPress,
  className = '',
  disabled = false,
}) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isMobile || disabled || !ref.current) return;

    const element = ref.current;
    let lastScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      setIsPressed(true);
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };

        // Start long press timer
        if (onLongPress) {
          longPressTimerRef.current = setTimeout(() => {
            onLongPress();
            setIsPressed(false);
          }, 500);
        }
      } else if (e.touches.length === 2 && onPinch) {
        // Handle pinch start
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        lastScale = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Clear long press timer on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (e.touches.length === 2 && onPinch) {
        // Handle pinch
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = distance / lastScale;
        onPinch(scale);
        lastScale = distance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setIsPressed(false);
      
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current || e.touches.length > 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;
      const maxTapDistance = 10;
      const maxTapTime = 200;

      // Handle tap
      if (
        Math.abs(deltaX) <= maxTapDistance &&
        Math.abs(deltaY) <= maxTapDistance &&
        deltaTime <= maxTapTime &&
        onTap
      ) {
        onTap();
        return;
      }

      // Handle swipes
      if (deltaTime <= maxSwipeTime) {
        if (Math.abs(deltaX) >= minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else if (Math.abs(deltaY) >= minSwipeDistance) {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
    };

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [isMobile, disabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onTap, onLongPress]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`${className} ${isPressed ? 'touch-feedback' : ''}`}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};