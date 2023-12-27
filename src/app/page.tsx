// pages/page.tsx
"use client"; // This is a client component 👈🏽
import React from 'react';
import ToolPanel from './Components/ToolPanel';
import MenuBar from './Components/MenuBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {LeftPanel, RightPanel} from './Panels/MainPanels'

const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-Menu-panel rounded">
        {/* Top MenuBar */}
        <MenuBar />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Side (Tool Panel) */}
          <LeftPanel />

          {/* Center/Main Area with Grid */}
          <div className="flex-1 relative overflow-hidden rounded">
            {/* Add your main app content here */}
            <h1 className="text-2xl font-bold mb-4">Main App Area</h1>

            {/* Infinite Grid */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {/* Grid Cells */}
                {Array.from({ length: gridSize * gridSize }, (_, index) => (
                  <div key={index} className="bg-white border border-gray-300 w-10 h-10 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side (Right Panel) */}
          <RightPanel />
        </div>
      </div>
    </DndProvider>
  );
};

export default Home;
