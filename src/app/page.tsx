// pages/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import MenuBar from './Components/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel, NpcEditorPanel, PalettePanel } from './Panels/MainPanels'; // Import other panels
import { ConsoleBar, addActivity } from './Panels/ConsoleBar';
import { handleShortcuts } from './Components/tools/shortcuts';
import shortcuts from './Components/tools/shortcutConfig'; // Import the shortcuts configuration
import { CanvasProvider } from './Panels/CanvasContext';
import { Canvas } from './Panels/Canvas';
import { setIsPaletteVisibleState, getIsPaletteVisibleState } from './Components/tools/useTools/usePalette';
import { leftPanelVisible, rightPanelVisible, npcEditorPanelVisible, togglePanelVisibility,togglePalettePanelVisibility } from './state/panelVisibility';

const Home: React.FC = () => {
  const gridSize = 100;
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]);
  const [canvasList, setCanvasList] = useState<string[]>(['Canvas0']); // List of canvas IDs
  const [isCanvasHidden, setIsCanvasHidden] = useState<{ [canvasId: string]: boolean }>(
    canvasList.reduce((acc, canvasId) => ({ ...acc, [canvasId]: false }), {})
  );

  // States for visibility of panels
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [npcEditorPanelVisible, setNpcEditorPanelVisible] = useState<boolean>(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleShortcuts(event, shortcuts);
      // Toggle palette panel visibility when "k" key is pressed
      if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        createNewCanvas();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // No dependencies, so it only runs once on component mount

  const handleColorSelection = (color: string) => {
    setCurrentColor(color);
  };

  const handleColorChangeComplete = (colorResult: any) => {
    console.log('Color Change Complete:', colorResult);
  };

  const createNewCanvas = () => {
    const newCanvasId = `Canvas${canvasList.length}`;
    setCanvasList((prevList) => [...prevList, newCanvasId]);
    setIsCanvasHidden((prevVisibility) => ({ ...prevVisibility, [newCanvasId]: false }));
    addActivity(`create new canvas ${newCanvasId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded">
        <MenuBar />
        
        <div className="flex flex-1">
          {leftPanelVisible && <LeftPanel />}
          {rightPanelVisible && <RightPanel numberOfLayers={layersStackRef.current.length} />}
          {npcEditorPanelVisible && <NpcEditorPanel />}
          <div className="flex-1 relative overflow-hidden rounded">
            {canvasList.map((canvasId, index) => (
              <React.Fragment key={canvasId}>
                {!isCanvasHidden[canvasId] && (
                  <div style={{ position: 'absolute' }}>
                    <CanvasProvider canvasId={canvasId} strokeColor={currentColor}>
                      <Canvas />
                    </CanvasProvider>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div id="palette" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'none'}}>
            {/* Render palette panel content here */}
            <PalettePanel
              selectedColor={currentColor}
              onSelectColor={handleColorSelection}
              onChangeComplete={handleColorChangeComplete}
            />
          </div>
        </div>
        <div className="rounded">
          <ConsoleBar />
        </div>
      </div>
    </DndProvider>
  );
};

export default Home;