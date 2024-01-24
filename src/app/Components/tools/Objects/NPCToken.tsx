import React, { useState, useRef, useEffect } from 'react';
import defaultImage from '../../imgs/NPCAvatar.png';
import { StaticImageData } from 'next/image';

interface NPCTokenProps {
  name?: string;
  job?: string;
  race?: string;
  description?: string;
  x?: number;
  y?: number;
  src?: string | StaticImageData;
  // image?: string; // Assuming image is a string representing the image path
}

const NPCToken: React.FC<NPCTokenProps> = ({
  name = 'npc',
  job = '',
  race = '',
  description = '',
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
        const offsetX = event.clientX - tokenRef.current.offsetWidth / 2;
        const offsetY = event.clientY - tokenRef.current.offsetHeight / 2;
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
    setIsDragging(true);
  };

  return (
    <div
      ref={tokenRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {src !== undefined ? (
        <img src={typeof src === 'string' ? src : src.src} alt={name} style={{ width: '70px', height: '60px' }} />
      ) : (
        <img src={defaultImage.src} alt={name} style={{ width: '70px', height: '60px' }} />
      )}
      <p style={{ color: 'black',margin: 0, textAlign: 'center' }}>{name}</p>
    </div>
  );
};

export default NPCToken;
