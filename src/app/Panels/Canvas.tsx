// Canvas.tsx
import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw, strokes } = useCanvas("exampleCanvas");

  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      // Always draw existing strokes
      strokes.forEach((stroke) => {
        if (stroke.path.length > 0) {
          context.strokeStyle = stroke.color;
          context.beginPath();
          context.moveTo(stroke.path[0].x, stroke.path[0].y);

          for (let i = 1; i < stroke.path.length; i++) {
            context.lineTo(stroke.path[i].x, stroke.path[i].y);
          }

          context.stroke();
        }
      });
    }
  }, [strokes, canvasRef]);

  return (
    <canvas
      onMouseDown={(e) => startDrawing(e)}
      onMouseUp={finishDrawing}
      onMouseMove={(e) => draw(e)}
      ref={canvasRef}
    />
  );
}
