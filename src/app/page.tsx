// pages/page.tsx
"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import MenuBar from './Components/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel, NpcEditorPanel, PalettePanel } from './Panels/MainPanels'; // Import PalettePanel
import createAnotherWindow from './Components/Windows/AnotherWindow'; // Import the createAnotherWindow function
import { ConsoleBar, addActivity } from './Panels/ConsoleBar';
import { handleShortcuts, Shortcut } from './Components/tools/shortcuts';
import shortcuts from './Components/tools/shortcutConfig'; // Import the shortcuts configuration
import { CanvasProvider } from './Panels/CanvasContext';
import { Canvas } from './Panels/Canvas';
import { getIsPaletteVisible, setIsPaletteVisible } from './Components/tools/useTools/usePalette';

const Home: React.FC = () => {
  const gridSize = 100;
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]);
  const [canvasList, setCanvasList] = useState<string[]>(['Canvas0']); // List of canvas IDs
  const [isCanvasHidden, setIsCanvasHidden] = useState<{ [canvasId: string]: boolean }>(
    canvasList.reduce((acc, canvasId) => ({ ...acc, [canvasId]: false }), {})
  );

  // Lift state for color picker
  const [currentColor, setCurrentColor] = useState<string>("#000000");

  // Dictionary to track visibility of panels
  const [panelVisibility, setPanelVisibility] = useState<{ [panelName: string]: boolean }>({
    leftPanel: true,
    rightPanel: false,
    npcEditorPanel: false,
    buildingEditorPanel: true,
    palettePanel: true,
  });

    // Function to toggle the visibility of a panel
    const togglePanelVisibility = (panelName: string) => {
      setPanelVisibility((prevState) => ({
        ...prevState,
        [panelName]: !prevState[panelName],
      }));
    };


  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleShortcuts(event, shortcuts);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [layersStackRef]);

  const handleColorSelection = (color: string) => {
    setCurrentColor(color);
  };

  const handleColorChangeComplete = (colorResult: any) => {
    console.log('Color Change Complete:', colorResult);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        createNewCanvas();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasList, currentColor]); // Include dependencies if needed

  const createNewCanvas = () => {
    const newCanvasId = `Canvas${canvasList.length}`;
    setCanvasList((prevList) => [...prevList, newCanvasId]);
    setIsCanvasHidden((prevVisibility) => ({ ...prevVisibility, [newCanvasId]: false }));
    addActivity(`create new canvas ${newCanvasId}`);
  };



  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded" onContextMenu={handleContextMenu}>
        <MenuBar />
        
        <div className="flex flex-1">
          {panelVisibility.leftPanel && <LeftPanel />}
          {panelVisibility.rightPanel && <RightPanel numberOfLayers={layersStackRef.current.length}/>}
          {panelVisibility.npcEditorPanel && <NpcEditorPanel />}
          <div className="flex-1 relative overflow-hidden rounded" onContextMenu={handleContextMenu}>
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
          {/* {panelVisibility.buildingEditorPanel && <BuildingEditorPanel />} */}
          {panelVisibility.palettePanel && <PalettePanel 
          selectedColor={currentColor}
          onSelectColor={handleColorSelection}
          onChangeComplete={handleColorChangeComplete} />} {/* Render palette panel based on visibility state */}
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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



/* ------------------------------------------------------------------------------------------------------------------------------------------------ */

