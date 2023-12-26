// components/ToolPanel.tsx
import React from 'react';
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

const ToolPanel: React.FC = () => {
  return (
    <div className="w-9 ml-7 mr-7 flex flex-col items-center space-y-8 mt-6">
      <ToolIcon icon={faArrowsAlt} name="Move Tool" />
      <ToolIcon icon={faSquare} name="Rectangular Marquee tool" />
      <ToolIcon icon={faCrop} name="Crop Tool" />
      <ToolIcon icon={faPen} name="Pen Tool" />
      <ToolIcon icon={faPencil} name="Pencil" />
      <ToolIcon icon={faPaintBrush} name="Brush" />
      <ToolIcon icon={faSearch} name="Zoom Tool" />
      <ToolIcon icon={faFont} name="Text Tool" />
      <ToolIcon icon={faHandPaper} name="Hand Tool" />
      <ToolIcon icon={faShapes} name="Shapes Tool" />
      <ToolIcon icon={faFillDrip} name="Bucket Tool" />
      <ToolIcon icon={faRuler} name="Show Rulers" />
    </div>
  );
};

const ToolIcon: React.FC<{ icon: any; name: string }> = ({ icon, name }) => {
    return (
      <div className="relative w-9 ml-7 mr-7 group">
        <FontAwesomeIcon icon={icon} className="tool-icon" />
        <div className="opacity-0 bg-gray-800 text-white text-sm p-2 rounded-md absolute left-full ml-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 group-hover:opacity-100">
          {name}
        </div>
      </div>
    );
  };
  
  
  
  

export default ToolPanel;
