// Functions/ShapeTool.tsx
import React, { useState } from 'react';
import { addActivity } from '@/app/Panels/ConsoleBar';

export const UseCircleDraw: React.FC = () => {
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (drawing && startPoint) {
      // Calculate the radius and draw the circle (replace this with your drawing logic)
      const radius = Math.sqrt(Math.pow(event.clientX - startPoint.x, 2) + Math.pow(event.clientY - startPoint.y, 2));

      console.log('Drawing circle with radius:', radius);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setStartPoint(null);
    addActivity('Drawn circle');
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'auto' }}
    >
      {/* You might render additional elements or components for visual feedback */}
    </div>
  );
};

export const UseSquareDraw: React.FC = () => {
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (drawing && startPoint) {
      // Calculate the side length and draw the square (replace this with your drawing logic)
      const sideLength = Math.max(Math.abs(event.clientX - startPoint.x), Math.abs(event.clientY - startPoint.y));

      console.log('Drawing square with side length:', sideLength);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setStartPoint(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'auto' }}
    >
      {/* You might render additional elements or components for visual feedback */}
    </div>
  );
};

export const UseRectangleDraw: React.FC = () => {
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (drawing && startPoint) {
      // Calculate the width and height and draw the rectangle (replace this with your drawing logic)
      const width = Math.abs(event.clientX - startPoint.x);
      const height = Math.abs(event.clientY - startPoint.y);

      console.log('Drawing rectangle with width and height:', width, height);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setStartPoint(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'auto' }}
    >
      {/* You might render additional elements or components for visual feedback */}
    </div>
  );
};
