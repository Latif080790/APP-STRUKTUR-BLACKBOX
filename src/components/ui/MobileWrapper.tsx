/**
 * Mobile-Responsive Component Wrapper
 * Provides touch-friendly interactions and responsive behavior
 */

import React, { useEffect, useState, useCallback } from 'react';

export interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableTouchGestures?: boolean;
  enableSwipeNavigation?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinchZoom?: (scale: number) => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  scale: number;
  lastTouchDistance: number;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  className = '',
  enableTouchGestures = true,
  enableSwipeNavigation = false,
  onSwipeLeft,
  onSwipeRight,
  onPinchZoom
}) => {
  const [touchState, setTouchState] = useState<TouchState | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(mobileRegex.test(userAgent) || (isTouchDevice && isSmallScreen));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableTouchGestures) return;

    const touch = e.touches[0];
    const distance = getTouchDistance(e.touches);
    
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      scale: 1,
      lastTouchDistance: distance
    });
  }, [enableTouchGestures, getTouchDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableTouchGestures || !touchState) return;

    // Handle pinch zoom
    if (e.touches.length === 2 && onPinchZoom) {
      const currentDistance = getTouchDistance(e.touches);
      
      if (touchState.lastTouchDistance > 0) {
        const scale = currentDistance / touchState.lastTouchDistance;
        const newScale = touchState.scale * scale;
        
        if (newScale !== touchState.scale) {
          onPinchZoom(newScale);
          setTouchState(prev => prev ? {
            ...prev,
            scale: newScale,
            lastTouchDistance: currentDistance
          } : null);
        }
      }
    }

    // Prevent default scrolling behavior for touch gestures
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, [enableTouchGestures, touchState, onPinchZoom, getTouchDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enableTouchGestures || !touchState || !enableSwipeNavigation) {
      setTouchState(null);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const deltaTime = Date.now() - touchState.startTime;
    
    // Check for swipe gesture
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    const maxVerticalDistance = 100;
    
    if (
      Math.abs(deltaX) > minSwipeDistance &&
      Math.abs(deltaY) < maxVerticalDistance &&
      deltaTime < maxSwipeTime
    ) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setTouchState(null);
  }, [enableTouchGestures, touchState, enableSwipeNavigation, onSwipeLeft, onSwipeRight]);

  const wrapperClasses = `
    ${className}
    ${isMobile ? 'mobile-optimized' : ''}
    ${enableTouchGestures ? 'touch-enabled' : ''}
  `.trim();

  return (
    <div
      className={wrapperClasses}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: enableTouchGestures ? 'manipulation' : 'auto',
        userSelect: enableTouchGestures ? 'none' : 'auto'
      }}
    >
      {children}
      {isMobile && (
        <div className="mobile-indicator sr-only">
          Mobile interface active
        </div>
      )}
    </div>
  );
};

/**
 * Hook for detecting mobile device and screen size
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize,
    orientation: screenSize.width > screenSize.height ? 'landscape' : 'portrait'
  };
};

export default MobileWrapper;