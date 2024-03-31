// Objects/Building.tsx
import React, { Component } from 'react';

interface BuildingProps {
  id?: string;
  name?: string;
  points?: { x: number; y: number }[];
}

interface BuildingState {
  position: { x: number; y: number };
  name: string;
  points: { x: number; y: number }[];
}

class Building extends Component<BuildingProps, BuildingState> {
  state: BuildingState = {
    position: { x: 0, y: 0 },
    name: this.props.name || '',
    points: this.props.points || [],
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Add any necessary mouse event handling logic here
  };

  componentDidMount() {
    // Add any necessary event listeners or initialization logic here
  }

  componentWillUnmount() {
    // Remove any event listeners or cleanup logic here
  }

  render() {
    const { position, name } = this.state;

    return (
      <div
        className="Building"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          /* Add any additional styles here */
        }}
        onMouseDown={this.handleMouseDown}
      >
        <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{name}</p>
      </div>
    );
  }
}

export default Building;
