import React, { Component } from 'react';

interface BuildingPointProps {
  position: { x: number; y: number };
  onClick: () => void;
}

class BuildingPoint extends Component<BuildingPointProps> {
  render() {
    const { position, onClick } = this.props;

    return (
      <div
        className="BuildingPoint"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'red', // Or any other color you prefer
          cursor: 'pointer',
        }}
        onClick={onClick}
      />
    );
  }
}

export default BuildingPoint;
