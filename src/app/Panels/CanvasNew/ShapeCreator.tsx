import Shape, { ShapeProps } from '@/app/Components/tools/Objects/Shape';
import React from 'react';

export const drawRectangle = (
  { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  currentColor: string,
  initialPoint: { x: number; y: number } | null,
  shapes: React.ReactNode[],
  setCurrentShapePoints: React.Dispatch<React.SetStateAction<{ x: number; y: number; width: number; height: number; }[]>>,
  scaleFactor: number
) => {
  if (!initialPoint) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw previous shapes
  shapes.forEach(shape => {
    if (React.isValidElement(shape)) {
      const shapeProps = shape.props as ShapeProps;
      ctx.fillStyle = shapeProps.color;
      ctx.fillRect(shapeProps.points[0].x, shapeProps.points[0].y, shapeProps.size.width, shapeProps.size.height);
    }
  });

  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  const scaledOffsetX = offsetX / scaleFactor;
  const scaledOffsetY = offsetY / scaleFactor;
  const { x: startX, y: startY } = initialPoint;
  const width = scaledOffsetX - startX;
  const height = scaledOffsetY - startY;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, width, height);

  setCurrentShapePoints([
    { x: startX, y: startY, width: width, height: height },
    { x: scaledOffsetX, y: scaledOffsetY, width: width, height: height }
  ]);
};
  
  export const finishDrawingRectangle = (
    setIsDrawingShape: React.Dispatch<React.SetStateAction<boolean>>,
    currentColor: string,
    shapes: React.ReactNode[],
    setShapes: React.Dispatch<React.SetStateAction<React.ReactNode[]>>,
    currentBuildingPoints: { x: number; y: number; width: number; height: number; }[],
    setCurrentShapePoints: React.Dispatch<React.SetStateAction<{ x: number; y: number; width: number; height: number; }[]>>
  ) => {
    setIsDrawingShape(false);
    
    const newShape = (
      <Shape
        id={`shape_${shapes.length}`}
        type="rectangle"
        points={currentBuildingPoints}
        size={{
          width: currentBuildingPoints[1].x - currentBuildingPoints[0].x,
          height: currentBuildingPoints[1].y - currentBuildingPoints[0].y
        }}
        color={currentColor}
      />
    );

    setShapes((prevShapes) => [...prevShapes, newShape]);
    //setCurrentShapePoints([]);
  };
  




  /* import Shape, { ShapeProps } from '@/app/Components/tools/Objects/Shape';

export const useShapeCreator = (
  { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
  contextRef: React.RefObject<CanvasRenderingContext2D | null>,
  setIsDrawingShape: React.Dispatch<React.SetStateAction<boolean>>,
  currentColor: string,
  setInitialPoint: React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>,
  currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
  scaleFactor: number
) => {
  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  if (contextRef.current) {
    contextRef.current.strokeStyle = currentColor;
    contextRef.current.lineWidth = 3;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawingShape(true);
    setInitialPoint({ x: offsetX, y: offsetY });

    // Create a new path for the current shape
    currentPath.current = [{ x: offsetX, y: offsetY }];
  }
};

export const drawShape = (
  { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
  contextRef: React.RefObject<CanvasRenderingContext2D | null>,
  initialPoint: { x: number; y: number; },
  scaleFactor: number
) => {
  if (!contextRef.current) {
    return;
  }

  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  const scaledOffsetX = offsetX / scaleFactor;
  const scaledOffsetY = offsetY / scaleFactor;

  // Resize the shape with mouse event
  // Assuming you meant to draw a line to the scaledOffsetX and scaledOffsetY
  contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
  contextRef.current.beginPath();
  contextRef.current.moveTo(initialPoint.x, initialPoint.y);
  contextRef.current.lineTo(scaledOffsetX, scaledOffsetY);
  contextRef.current.stroke();
};

export const finishDrawingShape = (
  { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
  setIsDrawingShape: React.Dispatch<React.SetStateAction<boolean>>,
  currentColor: string,
  initialPoint: { x: number; y: number; },
  currentPath: React.MutableRefObject<{ x: number; y: number; }[]>,
  setShapes: React.Dispatch<React.SetStateAction<React.ReactNode[]>>,
  scaleFactor: number
) => {
  setIsDrawingShape(false);

  const { offsetX = 0, offsetY = 0 } = nativeEvent;
  const scaledOffsetX = offsetX / scaleFactor;
  const scaledOffsetY = offsetY / scaleFactor;

  // Create a new shape object without saving it yet
  const newShape: ShapeProps = {
    id: Math.random().toString(36).substr(2, 9),
    points: [{ x: initialPoint.x, y: initialPoint.y }, { x: scaledOffsetX, y: scaledOffsetY }],
    size: { width: 0, height: 0 },
    color: currentColor,
  };

  // Add the new shape to the canvas
  setShapes((prevShapes) => [...prevShapes, <Shape key={newShape.id} {...newShape} />]);
};
 */