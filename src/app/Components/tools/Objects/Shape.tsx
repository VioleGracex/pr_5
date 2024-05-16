import React, { Component } from 'react';

export interface ShapeProps {
  id: string;
  type: string;
  points: { x: number; y: number }[];
  size: { width: number; height: number };
  color: string;
}

interface ShapeState {
  position: { x: number; y: number };
}

class Shape extends Component<ShapeProps, ShapeState> {
  state: ShapeState = {
    position: { x: 0, y: 0 },
  };

  shapeRef = React.createRef<SVGGElement>();

  handleMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    event.preventDefault();
    const { current } = this.shapeRef;

    if (!current) return;

    // Get the starting position of the shape
    const boundingRect = current.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const offsetY = event.clientY - boundingRect.top;

    // Store the starting position in the state
    this.setState({
      position: { x: offsetX, y: offsetY },
    });

    // Add event listeners for mouse move and mouse up
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (event: MouseEvent) => {
    const { position } = this.state;
    const { current } = this.shapeRef;

    if (!current) return;

    // Calculate the new position based on mouse movement
    const updatedX = event.clientX - position.x;
    const updatedY = event.clientY - position.y;

    // Set the new position as the style of the shape
    current.style.transform = `translate(${updatedX}px, ${updatedY}px)`;
  };

  handleMouseUp = () => {
    // Remove event listeners when mouse is released
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    return (
      <g ref={this.shapeRef} onMouseDown={this.handleMouseDown}>
        {/* Render your shape here */}
        {/* For example, for a polygon */}
        <polygon points={this.props.points.map(point => `${point.x},${point.y}`).join(' ')} />
      </g>
    );
  }
}

export default Shape;
