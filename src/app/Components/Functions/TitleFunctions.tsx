// TitleFunctions.tsx
"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';

export const handleExit = async () => {
  // Close the app window
  await appWindow.close();

  // Log the event
  console.log('Exit button clicked');
};

export const handleMinimize = async () => {
  // Minimize the app window
  await appWindow.minimize();

  // Log the event
  console.log('Minimize button clicked');
};

export const handleToggleMaximize = async (setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>) => {
  // Check if the window is currently maximized
  const isMaximized = await appWindow.isMaximized();

  if (isMaximized) {
    // If maximized, restore the window size
    await appWindow.unmaximize();
  } else {
    // If not maximized, maximize the window
    await appWindow.maximize();
  }

  // Update the state or perform additional logic
  setIsFullscreen((prevIsFullscreen) => !prevIsFullscreen);

  // Log the event
  console.log('Toggle Maximize button clicked');
};

export const useDrag = (handleDoubleClick: () => void) => {
  const [isDragging, setIsDragging] = useState(false);
  let clickCount = 0;
  let timeoutId: NodeJS.Timeout;

  const handleMouseDown = (event: React.MouseEvent) => {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is a button
    const isButton = clickedElement.tagName === 'BUTTON';

    // If it's a button, don't start dragging
    if (isButton) {
      return;
    }

    // Handle double-click
    clickCount++;
    if (clickCount === 1) {
      timeoutId = setTimeout(() => {
        clickCount = 0;
      }, 300);
    } else if (clickCount === 2) {
      clearTimeout(timeoutId);
      clickCount = 0;
      handleDoubleClick();
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

export const justDrag = () => {
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