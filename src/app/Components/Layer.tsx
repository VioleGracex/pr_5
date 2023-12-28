// components/Layer.tsx
import React from 'react';

interface LayerProps {
  gridSize: number;
  layers: Array<{ id: number; name: string } & { length?: never }>;
}

const Layer: React.FC<LayerProps> = ({ gridSize, layers }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded">
      {layers.map((layer) => (
        <div key={layer.id} className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {/* Grid Cells */}
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-300 w-10 h-10 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Layer;
