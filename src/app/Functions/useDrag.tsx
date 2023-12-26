// useDrag.tsx
import React, { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';

export const useDrag = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
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
