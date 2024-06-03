// pages/Home.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import MenuBar from './Components/tools/MenuBar/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel, NpcEditorPanel, PalettePanel } from './Panels/MainPanels';
import { ConsoleBar, addActivity } from './Panels/ConsoleBar';
import { handleShortcuts } from './Components/tools/shortcuts';
import { CanvasProvider } from "./Panels/CanvasProvider";
import { Canvas } from './Panels/Canvas';
import { getZoomScaleFactor } from './Components/tools/useTools/useZoom';
import { allBarShortcuts } from './Components/tools/MenuBar/MenuConfig';

export interface HomeProps {
  canvasList: string[];
  isCanvasHidden: { [canvasId: string]: boolean };
  dragging: boolean;
  dragStart: { x: number; y: number } | null;
  canvasOffset: { x: number; y: number };
  setCanvasList: React.Dispatch<React.SetStateAction<string[]>>;
  setIsCanvasHidden: React.Dispatch<React.SetStateAction<{ [canvasId: string]: boolean }>>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setDragStart: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setCanvasOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const MainPage: React.FC<HomeProps> = ({
  canvasList = ['Canvas0'],
  isCanvasHidden = { 'Canvas0': false },
  dragging = false,
  dragStart = null,
  canvasOffset = { x: 50, y: 50 },
  setCanvasList,
  setIsCanvasHidden,
  setDragging,
  setDragStart,
  setCanvasOffset
}) => {
  const gridSize = 100;
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]);
  [dragging, setDragging] = useState(false);
  [dragStart, setDragStart] = useState<{ x: number; y: number; } | null>(null);
  [canvasOffset, setCanvasOffset] = useState<{ x: number; y: number; }>({ x: 50, y: 50 });
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  /* [isCanvasHidden, setIsCanvasHidden] = useState<{ [canvasId: string]: boolean }>({
    'Canvas0': false
  }); */
  [isCanvasHidden, setIsCanvasHidden] = useState<{ [canvasId: string]: boolean; }>(
    canvasList.reduce((acc, canvasId) => ({ ...acc, [canvasId]: false }), {})
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleShortcuts(event, allBarShortcuts)
      /* if (event.ctrlKey && event.key === 's') {
        addActivity("ZBI");
        //event.preventDefault(); // Prevent the default browser save dialog
        // Call the function to save DCanvas data to JSON
      } */
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 1) {
        setDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (dragging && dragStart) {
        const deltaX = (event.clientX - dragStart.x) * 0.1;
        const deltaY = (event.clientY - dragStart.y) * 0.1;
        setCanvasOffset({ x: canvasOffset.x + deltaX, y: canvasOffset.y + deltaY });
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setDragStart(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasOffset, dragging, dragStart]);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handleColorSelection = (color: string) => {
    setCurrentColor(color);
  };

  const handleColorChangeComplete = (colorResult: any) => {
    console.log('Color Change Complete:', colorResult);
  };

  const createNewCanvas = () => {
    const newId: string = `Canvas${canvasList.length}`;
    setCanvasList((prevList) => [...prevList, newId]);
    setIsCanvasHidden((prevVisibility) => ({ ...prevVisibility, [newId]: false }));
    addActivity(`create new canvas ${newId}`);
};


const renderDCanvas = (canvasId: string) => (
  <React.Fragment key={canvasId}>
    {!isCanvasHidden[canvasId] && (
      <div id={`canvas-${canvasId}`} style={{ zIndex: canvasList.length + 1,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)' }}>
        <CanvasProvider canvasId={canvasId} strokeColor={currentColor} scaleFactor={getZoomScaleFactor()} canvasWidth={5000} canvasHeight={5000}>
          <Canvas />
        </CanvasProvider>
      </div>
    )}
  </React.Fragment>
);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded relative">
        <div id="MenuBar" style={{ display: 'block', zIndex: 1000 }}>
          <MenuBar />
        </div>
        <div className="flex flex-1">
          <div id="leftPanelWrapper" style={{ display: 'block', zIndex: 999 }}>
            <LeftPanel />
          </div>
          <div id="rightPanelWrapper" style={{ display: 'none' }}>
            <RightPanel numberOfLayers={layersStackRef.current.length} />
          </div>
          <div id="npcEditorPanelWrapper" style={{ display: 'none', zIndex: 998 }}>
            <NpcEditorPanel />
          </div>
          <div id="zoom" style={{
            position: 'absolute',
            transform: `scale(${getZoomScaleFactor()})`,
            left: `${canvasOffset.x}%`, // Use canvasOffset.x as left position
            top: `${canvasOffset.y}%`, // Use canvasOffset.y as top position
            transformOrigin: 'center center'
          }}>
            
            <div style={{ overflow: 'hidden' }}>
            {canvasList.map((canvasId) => renderDCanvas(canvasId))}
            </div>
          </div>
          <div id="palettePanelWrapper" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'none', zIndex: 1002 }}>
            <PalettePanel
              selectedColor={currentColor}
              onSelectColor={handleColorSelection}
              onChangeComplete={handleColorChangeComplete} />
          </div>
        </div>
        <div className="rounded" style={{ zIndex: 1001 }}>
          <ConsoleBar />
        </div>
      </div>
    </DndProvider>
  );
};

export default MainPage;
