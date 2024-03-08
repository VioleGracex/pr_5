// Objects/NPCToken.tsx
import React, { useState, useRef, useEffect } from 'react';
import defaultImage from '../../imgs/NPCAvatar.png';
import { getGlobalActiveTool } from '../ToolPanel';
import { StaticImageData } from 'next/image';
import { setPanelVisibility } from '@/app/state/panelVisibility';
import { setActiveElement } from '@/app/state/ActiveElement';
import { getZoomScaleFactor } from '../useTools/useZoom';

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
        const scaleFactor = getZoomScaleFactor();
        const canvasOffsetX = offsetX / scaleFactor;
        const canvasOffsetY = offsetY / scaleFactor;
        const updatedX = (event.clientX - canvasOffsetX - tokenRef.current.offsetWidth / 2) / scaleFactor;
        const updatedY = ((event.clientY - canvasOffsetY - tokenRef.current.offsetHeight / 2) / scaleFactor);
        setPosition({ x: updatedX, y: updatedY });
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
  }, [isDragging, offsetX, offsetY]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    
    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool' && tokenRef.current) {
      const scaleFactor = getZoomScaleFactor();
      const canvasOffsetX = offsetX / scaleFactor;
      const canvasOffsetY = offsetY / scaleFactor;
      const updatedX = (event.clientX - canvasOffsetX - tokenRef.current.offsetWidth / 2) / scaleFactor;
      const updatedY = ((event.clientY - canvasOffsetY - tokenRef.current.offsetHeight / 2) / scaleFactor);
      setPosition({ x: updatedX, y: updatedY });
      setIsDragging(true);
    }
    else if(activeTool === 'Cursor Tool') {
      setActiveElement(tokenRef.current);
      setPanelVisibility('npcEditorPanelWrapper', true);
    }
  };
  

  const handleWindowOpen = () => {
    const windowOffsetX = 3000; // Adjust this value based on your requirements
    const windowOffsetY = 50; // Adjust this value based on your requirements
    setOffsetX(windowOffsetX);
    setOffsetY(windowOffsetY);
  };

  useEffect(() => {
    window.addEventListener('openWindow', handleWindowOpen);
    return () => {
      window.removeEventListener('openWindow', handleWindowOpen);
    };
  }, []);

  return (
    <div className='NpcToken'
      id={'NpcToken'} 
      ref={tokenRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: getGlobalActiveTool() === 'Move Tool' ? (isDragging ? 'grabbing' : 'grab') : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      {src !== undefined ? (
        <img src={typeof src === 'string' ? src : src.src} alt={name} style={{ width: '70px', height: '60px' }} />
      ) : (
        <img src={defaultImage.src} alt={name} style={{ width: '70px', height: '60px' }} />
      )}
      <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{name}</p>
    </div>
  );
};

export default NPCToken;
