import React, { useState, useRef, useEffect } from 'react';
import defaultImage from '../../imgs/NPCAvatar.png';
import { getGlobalActiveTool } from '../ToolPanel';
import { StaticImageData } from 'next/image';

interface NPCTokenProps {
  name?: string;
  x?: number;
  y?: number;
  src?: string | StaticImageData;
}

const NPCToken: React.FC<NPCTokenProps> = ({
  name = 'npc',
  x = 0,
  y = 0,
  src = defaultImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && tokenRef.current) {
        const updatedX = event.clientX - tokenRef.current.offsetWidth - offsetX;
        const updatedY = event.clientY - tokenRef.current.offsetHeight - offsetY;
        setPosition({ x: updatedX, y: updatedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      /* setIsNPCEditorVisible(true); */
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offsetX, offsetY]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    
    // Check if the active tool is 'Move Tool' before enabling dragging
    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool') {
      setIsDragging(true);
    }
  };

  const handleWindowOpen = () => {
    // Calculate offset when the window is opened
    const windowOffsetX = 380; // Adjust this value based on your requirements
    const windowOffsetY = 50; // Adjust this value based on your requirements
    setOffsetX(windowOffsetX);
    setOffsetY(windowOffsetY);
  };

  const activeTool = getGlobalActiveTool();

  useEffect(() => {
    // Event listener to detect window opening
    window.addEventListener('openWindow', handleWindowOpen);

    return () => {
      window.removeEventListener('openWindow', handleWindowOpen);
    };
  }, []);

  return (
    <div
      ref={tokenRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: activeTool === 'Move Tool' ? (isDragging ? 'grabbing' : 'grab') : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Render the token image */}
      {src !== undefined ? (
        <img src={typeof src === 'string' ? src : src.src} alt={name} style={{ width: '70px', height: '60px' }} />
      ) : (
        <img src={defaultImage.src} alt={name} style={{ width: '70px', height: '60px' }} />
      )}

      {/* Render the token name */}
      <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{name}</p>
    </div>
  );
};

export default NPCToken;
