// NPCToken.tsx
import React, { useState, useEffect } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Assuming you are using FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface NPCTokenProps {
  name: string;
  job: string;
  race: string;
  description: string;
  x?: number; // x-coordinate, default to center of the parent object
  y?: number; // y-coordinate, default to center of the parent object
  image?: string; // image for token, default to faUser
}

const NPCToken: React.FC<NPCTokenProps> = ({
  name,
  job,
  race,
  description,
  x = 0,
  y = 0,
  image = faUser.iconName,
}) => {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // Fetch the parent object's dimensions or use a reference
    // Replace the following with your logic to get the parent's dimensions
    const parentWidth = 200;
    const parentHeight = 200;

    // Calculate the center coordinates
    const centerX = parentWidth / 2;
    const centerY = parentHeight / 2;

    // Set the token's position to the center if x or y is not provided
    setPosition({
      x: x !== undefined ? x : centerX,
      y: y !== undefined ? y : centerY,
    });
  }, [x, y]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)', // Center the token
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black', // Add black background
        padding: '5px', // Adjust padding as needed
        borderRadius: '5px', // Add border radius as needed
        color: 'white', // Text color
      }}
    >
      <img
        src={image}
        alt={`${name}'s token`}
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      />
      <div>
        <strong>{name}</strong>
      </div>
      <div>{job}</div>
      <div>{race}</div>
      <div>{description}</div>
    </div>
  );
};

export default NPCToken;
