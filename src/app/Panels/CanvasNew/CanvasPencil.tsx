import React from 'react';

export interface Stroke {
  path: { x: number; y: number }[];
  color: string;
}

export const usePencilDrawing = (
{ nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
contextRef: React.RefObject<CanvasRenderingContext2D | null>,
setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
currentColor: string,
setInitialPoint: React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>|null,
currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
scaleFactor: number
) => { //fix scale factor
    
    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    if (contextRef.current && setInitialPoint) {
      contextRef.current.strokeStyle = currentColor;
      contextRef.current.lineWidth = 3; // Set the width of the stroke (adjust as needed) add this as a meter to palette
      const { offsetX = 0, offsetY = 0 } = nativeEvent;
      const scaledOffsetX = offsetX / scaleFactor;
      const scaledOffsetY = offsetY / scaleFactor;
      contextRef.current.beginPath();
      contextRef.current.moveTo(scaledOffsetX, scaledOffsetY);
      setIsDrawing(true);
      setInitialPoint({ x: scaledOffsetX, y: scaledOffsetY });

      // Create a new path for the current stroke
      currentPath.current = [{ x: scaledOffsetX, y: scaledOffsetY }];
    }

};


 // Inside the draw function
 export const drawPencil = (
    { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
    contextRef: React.RefObject<CanvasRenderingContext2D | null>,
    currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
    scaleFactor: number
    ) => {
    if (!contextRef.current) {
      return;
    }

    const { offsetX = 0, offsetY = 0 } = nativeEvent;
    const scaledOffsetX = offsetX / scaleFactor;
    const scaledOffsetY = offsetY / scaleFactor;

    contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);
    contextRef.current.stroke();

    currentPath.current.push({ x: scaledOffsetX, y: scaledOffsetY });
  };


// Inside the finishDrawing function
export const finishDrawingPencil = (
    { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
    contextRef: React.RefObject<CanvasRenderingContext2D | null>,
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    currentColor: string,
    initialPoint: { x: number; y: number; } | null,
    currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
    scaleFactor: number
    ) => {
    setIsDrawing(false);

    if (contextRef.current && initialPoint) {
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
