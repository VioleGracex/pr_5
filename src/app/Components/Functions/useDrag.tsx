/* // useDrag.tsx
import React, { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';

export const useDrag = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: React.MouseEvent) => {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is a button
    const isButton = clickedElement.tagName === 'BUTTON';

    // If it's a button, don't start dragging
    if (isButton) {
      return;
    }

    setIsDragging(true);
    appWindow.startDragging();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return {
    handleMouseDown,
  };
};
 */