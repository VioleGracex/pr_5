
// pages/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import MenuBar from './Components/MenuBar';
import Layer from './Components/Layer'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftPanel, RightPanel } from './Panels/MainPanels';
import createAnotherWindow from './Components/Windows/AnotherWindow'; // Import the createAnotherWindow function
import { ConsoleBar,addActivity} from './Panels/ConsoleBar';
import { UseCircleDraw } from './Components/Functions/ShapeTool';


const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column
  const [forceUpdateFlag, setForceUpdateFlag] = useState(false); // State variable to trigger force update
  const layersStackRef = useRef([{ id: 1, name: 'Default Layer' }]); // Initialize with one default layer

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default right-click behavior
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check if Ctrl + S is pressed
    if (event.ctrlKey && event.key === 's') {
      const fileName = prompt('Enter file name:', 'state_backup');
      if (fileName) {
        addActivity(`SAVED: ${fileName}.wise`);
        setForceUpdateFlag(!forceUpdateFlag); // Toggle the flag to trigger a re-render
      }
    }
  
    // Check if Ctrl + Shift + N is pressed
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
      createNewLayer();
      console.log("Created New Layer");
    }
  
    // Check if Ctrl + Shift + ] is pressed
    if (event.ctrlKey && event.shiftKey && event.code === 'BracketRight') {
      createAnotherWindow();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [forceUpdateFlag]); // Include forceUpdateFlag as a dependency

  const createNewLayer = () => {
    console.log('Creating a new layer...');
  
    if (layersStackRef.current.length > 0) {
      // Generate a new layer ID
      const newLayerId = layersStackRef.current.length + 1;
  
      // Create a new layer object
      const newLayer = { id: newLayerId, name: `Layer ${newLayerId}` };
  
      // Update the layers stack by adding the new layer
      layersStackRef.current = [...layersStackRef.current, newLayer];
  
      // Force a component update to reflect the changes
      setForceUpdateFlag(!forceUpdateFlag); // Toggle the flag to trigger a re-render
  
      console.log('New layer created:', newLayer);
      console.log('Updated layers stack:', layersStackRef.current);
      addActivity('Added layer');
    }
  };

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
            <h1 className="text-2xl font-bold mb-4"></h1>

            {/* Layer */}
            <Layer gridSize={gridSize} layers={layersStackRef.current} />
          </div>

          {/* Right Side (Right Panel) */}
          <RightPanel numberOfLayers={layersStackRef.current.length} />
        </div>

        {/* Console Bar */}
        <ConsoleBar />
      </div>
    </DndProvider>
  );
};

export default Home;
