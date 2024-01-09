
// pages/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import MenuBar from './Components/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel } from './Panels/MainPanels';
import createAnotherWindow from './Components/Windows/AnotherWindow'; // Import the createAnotherWindow function
import { ConsoleBar,addActivity} from './Panels/ConsoleBar';
import { handleShortcuts, Shortcut } from './Components/tools/shortcuts';
import shortcuts from './Components/tools/shortcutConfig'; // Import the shortcuts configuration
import { CanvasProvider } from './Panels/CanvasContext';
import { Canvas } from './Panels/Canvas';
import Layer from './Components/Layer'; 



const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column
  const [forceUpdateFlag, setForceUpdateFlag] = useState(false); // State variable to trigger force update
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]); // Initialize with one default layer
  
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default right-click behavior
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleShortcuts(event, shortcuts);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [forceUpdateFlag, layersStackRef]); // Include additional dependencies if needed

 

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded" onContextMenu={handleContextMenu}>
        {/* Top MenuBar */}
        <MenuBar />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Side (Tool Panel) */}
          <LeftPanel />

          {/* Center/Main Area with Layer */}
          <div className="flex-1 relative overflow-hidden rounded" onContextMenu={handleContextMenu}>
            {/* Add your main app content here */}
            <CanvasProvider><Canvas/></CanvasProvider>
            
            {/* <h1 className="text-2xl font-bold mb-4"></h1> */}

            {/* Layer */}
           {/*  <Layer gridSize={gridSize} layers={layersStackRef.current} /> */}
          </div>

          {/* Right Side (Right Panel) */}
          <RightPanel numberOfLayers={layersStackRef.current.length} />
        </div>
        <div className="flex-1 relative rounded">
          <ConsoleBar />
        </div>
        {/* Console Bar */}
        
      </div>
    </DndProvider>
  );
};

export default Home;

