import React from 'react';

interface Props {
  width: number;
  height: number;
  areaOfSquare: number;
}

const createSquareGrid = ({ width, height, areaOfSquare }: Props) => {
  // Calculate the size of each square based on the provided area
  const squareSize = Math.sqrt(areaOfSquare*1000);
  
  // Calculate the number of squares along each dimension to fill the canvas
  const rows = Math.ceil(height / squareSize); // Round up to ensure incomplete squares at the edges
  const columns = Math.ceil(width / squareSize); // Round up to ensure incomplete squares at the edges
  
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      // Adjust width and height for incomplete squares at the edges
      const adjustedWidth = (j === columns - 1 && width % squareSize !== 0) ? width % squareSize : squareSize;
      const adjustedHeight = (i === rows - 1 && height % squareSize !== 0) ? height % squareSize : squareSize;
      
      row.push(
        <div 
          key={`${i}-${j}`} 
          className="tile" 
          style={{ width: adjustedWidth, height: adjustedHeight }}
        ></div>
      );
    }
    grid.push(<div key={`row-${i}`} className="grid-row">{row}</div>);
  }
  return <div className="grid-container">{grid}</div>; // Wrap grid in a container with a class
};

export default createSquareGrid;
