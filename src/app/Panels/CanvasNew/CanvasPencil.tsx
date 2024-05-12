import React, { useState, useRef } from 'react';

export interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const usePencilDrawing = (
{ nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
contextRef: React.RefObject<CanvasRenderingContext2D | null>,
isDrawing: boolean,
setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
currentColor: string,
initialPoint: { x: number; y: number; },
setInitialPoint: React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>,
currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
scaleFactor: number
) => {
 
    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.strokeStyle = currentColor;
      contextRef.current.lineWidth = 3; // Set the width of the stroke (adjust as needed) add this as a meter to palette
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      setInitialPoint({ x: offsetX, y: offsetY });

      // Create a new path for the current stroke
      currentPath.current = [{ x: offsetX, y: offsetY }];
    }
  

  // Inside the draw function

    if (!isDrawing || !contextRef.current) {
      return;
    }
    else
    {
        const { offsetX = 0, offsetY = 0 } = nativeEvent;
        const scaledOffsetX = offsetX / scaleFactor;
        const scaledOffsetY = offsetY / scaleFactor;

        contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);
        contextRef.current.stroke();

        currentPath.current.push({ x: scaledOffsetX, y: scaledOffsetY });
    }
    
  

  // Inside the finishDrawing function
  const finishDrawing = () => {
    setIsDrawing(false);

    if (contextRef.current) {
      const offsetX = nativeEvent.clientX;
      const offsetY = nativeEvent.clientY;
      const distance = Math.sqrt(
        Math.pow(offsetX - initialPoint.x, 2) + Math.pow(offsetY - initialPoint.y, 2)
      );

      const scaledOffsetX = offsetX / scaleFactor;
      const scaledOffsetY = offsetY / scaleFactor;

      contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);

      const newStroke: Stroke = {
        path: [...currentPath.current],
        color: currentColor,
      };

      if (distance < 2) {
        contextRef.current.arc(
          scaledOffsetX,
          scaledOffsetY,
          contextRef.current.lineWidth / 2,
          0,
          Math.PI * 2
        );
        contextRef.current.fill();
      } else {
        contextRef.current.stroke();
        setStrokes((prevStrokes) => [...prevStrokes, newStroke]);
      }
    }
  };

};
