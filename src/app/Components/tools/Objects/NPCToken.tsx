// NPCToken.tsx
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
  x = 500,
  y = 500,
  src = defaultImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && tokenRef.current) {
        const offsetX = event.clientX - tokenRef.current.offsetWidth - 45;
        const offsetY = event.clientY - tokenRef.current.offsetHeight - 40;
        setPosition({ x: offsetX, y: offsetY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    
    // Check if the active tool is 'Move Tool' before enabling dragging
    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool') {
      setIsDragging(true);
    }
  };

  const activeTool = getGlobalActiveTool();

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
