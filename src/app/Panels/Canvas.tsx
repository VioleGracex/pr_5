// Canvas.tsx
import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw, paths } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context && paths.length > 0) {
      paths.forEach((path) => {
        if (path.length > 0) { // Check if the path array has elements
          context.beginPath();
          context.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
          }

          context.stroke();
        }
      });
    }
  }, [paths, canvasRef]);

  return (
    <canvas
      onMouseDown={(e) => startDrawing(e)}
      onMouseUp={finishDrawing}
      onMouseMove={(e) => draw(e)}
      ref={canvasRef}
    />
  );
}
