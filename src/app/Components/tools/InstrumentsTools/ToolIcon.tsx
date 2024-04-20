import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const ToolIcon: React.FC<{
  icon?: IconDefinition;
  Image?: { src: string; height: number; width: number };
  name: string;
  shortcut?: string;
  active: boolean;
  isHovered: boolean;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ icon, Image, name, shortcut = "", active, isHovered, onClick, onContextMenu, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`relative w-12 ml-7 mr-7 space-y-2 group border ${
        active ? 'border-blue-500 border-2 rounded ' : 'border-transparent'
      }`}
      data-tool={name}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="tool-icon ml-2" size="lg" />
      )}
      {Image && (
        <img
          src={Image.src}
          alt={name}
          className="tool-icon ml-2"
          style={{ width: '1.3em', height: '1.3em' }}
        />
      )}
      {isHovered && (
        <div
          className={`opacity-100 bg-gray-800 text-white text-sm p-2 rounded-md absolute left-full ml-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 whitespace-nowrap`}
          style={{ zIndex: 9999 }} // Adjust z-index to ensure the menu appears above all
        >
          <span className="mr-1">{name}</span>
          <span className="text-xs font-light">({shortcut})</span>
        </div>
      )}
    </div>
  );
};

export default ToolIcon;
