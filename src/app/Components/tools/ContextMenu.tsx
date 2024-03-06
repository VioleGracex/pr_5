// ContextMenu.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { toolsExtra } from './toolConfig';

const ContextMenu: React.FC<{
  tools: typeof toolsExtra;
  onMenuItemClick: (toolName: string) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  position: { top: number; left: number } | null; // New position prop
}> = ({ tools, onMenuItemClick, menuRef, position }) => {
  return (
    <div 
      ref={menuRef}
      className="absolute p-2 bg-gray-700 rounded"
      style={{ top: position?.top, left: position?.left,backgroundColor: "#3b3a3a" }}
    >
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="cursor-pointer text-white p-2 hover:bg-gray-600 rounded flex items-center"
          onClick={() => onMenuItemClick(tool.name)}
          style={{ whiteSpace: 'nowrap', fontSize: '0.9em' }}
        >
          {tool.icon && <FontAwesomeIcon icon={tool.icon} className="mr-2" />}
          {tool.Image && (
            <img
              src={tool.Image.src}
              alt={tool.name}
              className="mr-2"
              style={{ width: '1.3em', height: '1.3em' }}
            />
          )}
          <span>{tool.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
