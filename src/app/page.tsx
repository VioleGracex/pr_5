// pages/page.tsx
import React from 'react';
import ToolPanel from './Components/ToolPanel';

const Home: React.FC = () => {
  const gridSize = 100; // Number of cells per row and column

  return (
    <div className="flex h-screen">
      {/* Left Side (Tool Panel) */}
      <div className="w-1/7 bg-black-100 z-10"> {/* z-10 to keep the panel above */}
        <ToolPanel />
      </div>
      
      {/* Center/Main Area with Grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Add your main app content here */}
        <h1 className="text-2xl font-bold mb-4">Main App Area</h1>
        
        {/* Infinite Grid */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {/* Grid Cells */}
            {Array.from({ length: gridSize * gridSize }, (_, index) => (
              <div key={index} className="bg-white border border-gray-300 w-10 h-10"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side (Right Panel) */}
      <div className="w-1/7 bg-gray-200 z-10"> {/* z-10 to keep the panel above */}
        {/* Add content for the right panel here */}
        <p className="text-lg font-semibold mt-4">Right Panel Content</p>
      </div>
    </div>
  );
};

export default Home;
