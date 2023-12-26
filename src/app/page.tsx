// pages/page.tsx
import React from 'react';
import ToolPanel from './Components/ToolPanel';
import MenuBar from './Components/MenuBar'; // Import the MenuBar component

const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column

  return (
    <div className="flex flex-col h-screen bg-Menu-panel rounded">
      {/* Top MenuBar */}
      <MenuBar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Side (Tool Panel) */}
        <div className="w-1/7 bg-left-panel rounded z-10">
          <ToolPanel />
        </div>

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
        <div className="w-1/7 bg-right-panel rounded z-10">
          {/* Add content for the right panel here */}
          <p className="text-lg font-semibold mt-4 mr-10 ml-10">Inspector</p>
        </div>
      </div>
    </div>
  );
};

export default Home;