// components/ToolPanel.tsx
"use client"; // This is a client component 👈🏽
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt,
  faSquare,
  faCrop,
  faPen,
  faPencil,
  faPaintBrush,
  faSearch,
  faFont,
  faHandPaper,
  faShapes,
  faFillDrip,
  faRuler,
} from '@fortawesome/free-solid-svg-icons';

const tools = [
  { icon: faArrowsAlt, name: "Move Tool" },
  { icon: faSquare, name: "Marquee tool" },
  { icon: faCrop, name: "Crop Tool" },
  { icon: faPen, name: "Pen Tool" },
  { icon: faPencil, name: "Pencil" },
  { icon: faPaintBrush, name: "Brush" },
  { icon: faSearch, name: "Zoom Tool" },
  { icon: faFont, name: "Text Tool" },
  { icon: faHandPaper, name: "Hand Tool" },
  { icon: faShapes, name: "Shapes Tool" },
  { icon: faFillDrip, name: "Bucket Tool" },
  { icon: faRuler, name: "Show Rulers" },
];

const ToolPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const handleToolClick = (toolName: string) => {
    setActiveTool(activeTool === toolName ? null : toolName);
    // Add your toggle functionality or other logic here
  };

  return (
    <div className="w-5 ml-7 mr-7 flex flex-col items-center space-y-7 mt-20">
      {tools.map((tool, index) => (
        <ToolIcon
          key={index}
          icon={tool.icon}
          name={tool.name}
          active={activeTool === tool.name}
          isHovered={hoveredTool === tool.name}
          onClick={() => handleToolClick(tool.name)}
          onMouseEnter={() => setHoveredTool(tool.name)}
          onMouseLeave={() => setHoveredTool(null)}
        />
      ))}
    </div>
  );
};

const ToolIcon: React.FC<{
  icon: any;
  name: string;
  active: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ icon, name, active, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`relative w-12 ml-7 mr-7 space-y-2 group border ${
        active ? 'border-blue-500 border-2 rounded ' : 'border-transparent'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FontAwesomeIcon icon={icon} className="tool-icon ml-2" size="lg" />
      {isHovered && (
        <div
          className={`opacity-100 bg-gray-800 text-white text-sm p-2 rounded-md absolute left-full ml-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 whitespace-nowrap`}
        >
          {name}
        </div>
      )}
    </div>
  );
};

export default ToolPanel;
