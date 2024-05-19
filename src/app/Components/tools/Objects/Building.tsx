import React, { Component } from 'react';
import { Stroke } from '@/app/Panels/CanvasContext';

export interface BuildingProps {
  id?: string;
  name?: string;
  points?: { x: number; y: number }[];
  strokes?: { path: { x: number; y: number }[]; color: string }[];
}

interface BuildingState {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  strokes: Stroke[];
}

class Building extends Component<BuildingProps, BuildingState> {
  constructor(props: BuildingProps) {
    super(props);
    this.state = {
      id: props.id || '',
      name: props.name || '',
      points: props.points || [],
      strokes: props.strokes || [],
    };
  }

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
    const { points, name, id, strokes } = this.state;
    const nameToDisplay = name || id;

    // Calculate the center of the shape
    let centerX = 0;
    let centerY = 0;
    if (points.length > 0) {
      const totalPoints = points.length;
      const sumX = points.reduce((acc, cur) => acc + cur.x, 0);
      const sumY = points.reduce((acc, cur) => acc + cur.y, 0);
      centerX = sumX / totalPoints;
      centerY = sumY / totalPoints;
    }

    // Generate the SVG path data
    const pathData = points.map(point => `${point.x},${point.y}`).join(' ');

    return (
      <div className="Building">
        {/* Render points */}
        {points.map((point, index) => {
          if (!point || typeof point.x === 'undefined' || typeof point.y === 'undefined') {
            return null;
          }
          return (
            <div
              key={`point-${index}`}
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                width: 8,
                height: 8,
                backgroundColor: 'black',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Render building name */}
        <p style={{ color: 'black', margin: 0, textAlign: 'center', position: 'absolute', top: centerY, left: centerX, transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          {nameToDisplay}
        </p>

        {/* Render strokes */}
        {strokes.map((stroke, index) => (
          <line
            key={`stroke-${index}`}
            x1={stroke.path[0].x}
            y1={stroke.path[0].y}
            x2={stroke.path[1].x}
            y2={stroke.path[1].y}
            style={{ stroke: stroke.color, strokeWidth: 1 }}
          />
        ))}

        {/* Render the shape area with grey soft color */}
        <polygon points={pathData} style={{ fill: 'grey', fillOpacity: 0.5 }} />

        {/* Add line under the text */}
        <hr style={{ position: 'absolute', top: centerY + 15, left: centerX - 30, width: '60px', color: 'blue' }} />
      </div>
    );
  }
}

export default Building;


export class Road extends Component<BuildingProps, BuildingState> {
  constructor(props: BuildingProps) {
    super(props);
    this.state = {
      id: props.id || '',
      name: props.name || '',
      points: props.points || [],
      strokes: props.strokes || [],
    };
  }

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
    const { points, name, id, strokes } = this.state;
    const nameToDisplay = name || id;

    // Calculate the center of the shape
    let centerX = 0;
    let centerY = 0;
    if (points.length > 0) {
      const totalPoints = points.length;
      const sumX = points.reduce((acc, cur) => acc + cur.x, 0);
      const sumY = points.reduce((acc, cur) => acc + cur.y, 0);
      centerX = sumX / totalPoints;
      centerY = sumY / totalPoints;
    }

    // Generate the SVG path data
    const pathData = points.map(point => `${point.x},${point.y}`).join(' ');

    return (
      <div className="Building">
        {/* Render points */}
        {points.map((point, index) => {
          if (!point || typeof point.x === 'undefined' || typeof point.y === 'undefined') {
            return null;
          }
          return (
            <div
              key={`point-${index}`}
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                width: 8,
                height: 8,
                backgroundColor: 'black',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Render strokes */}
        {strokes.map((stroke, index) => (
          <line
            key={`stroke-${index}`}
            x1={stroke.path[0].x}
            y1={stroke.path[0].y}
            x2={stroke.path[1].x}
            y2={stroke.path[1].y}
            style={{ stroke: stroke.color, strokeWidth: 1 }}
          />
        ))}

        {/* Render the shape area with grey soft color */}
        <polygon points={pathData} style={{ fill: 'grey', fillOpacity: 0.5 }} />

        {/* Add line under the text */}
        <hr style={{ position: 'absolute', top: centerY + 15, left: centerX - 30, width: '60px', color: 'blue' }} />
      </div>
    );
  }
}