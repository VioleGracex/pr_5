// Objects/Token.tsx
import React, { Component } from 'react';
import defaultNPCImage from '../../imgs/NPCAvatar.png';
import defaultItemImage from '../../imgs/ItemToken.png'; // Default item image
import { getGlobalActiveTool } from '../InstrumentsTools/ToolPanel';
import { setPanelVisibility } from '@/app/state/panelVisibility';
import { setActiveToken } from '@/app/state/ActiveElement';
import { getZoomScaleFactor } from '../useTools/useZoom';
import { addActivity } from '@/app/Panels/ConsoleBar';

// Define the type for the token, e.g., 'npc' or 'item'
export type TokenType = 'npc' | 'item';

export interface TokenProps {
  type: string;
  name?: string;
  race?: string;
  job?: string;
  description?: string;
  x?: number;
  y?: number;
  src?: string; // Change src type to string for file paths
}

export interface TokenState {
  isDragging: boolean;
  position: { x: number; y: number };
  offsetX: number;
  offsetY: number;
  name: string;
  job: string;
  race: string;
  description: string;
  src: string; // Change src type to string for file paths
  index: number; // Add index property to the state
}

class Token extends Component<TokenProps, TokenState> {
  state: TokenState = {
    isDragging: false,
    position: { x: this.props.x || 0, y: this.props.y || 0 },
    offsetX: 0,
    offsetY: 0,
    name: this.props.name || '',
    job: this.props.job || '',
    race: this.props.race || '',
    description: this.props.description || '',
    src: this.props.src || this.props.type === 'npc' ? defaultNPCImage.src : defaultItemImage.src,
    index: 0, // Initialize index property
  };

  tokenRef = React.createRef<HTMLDivElement>();

  setName = (value: string) => {
    this.setState({ name: value });
    addActivity("set name to " + value);
  };

  setJob = (value: string) => {
    this.setState({ job: value });
  };

  setRace = (value: string) => {
    this.setState({ race: value });
  };

  setDescription = (value: string) => {
    this.setState({ description: value });
  };

  setSrc = (value: string) => {
    this.setState({ src: value });
  };

  setIndex = (value: number) => {
    this.setState({ index: value });
  };

  
  getName = () => {
    return this.state.name || '';
  };

  getJob = () => {
    return this.state.job || '';
  };

  getRace = () => {
    return this.state.race || '';
  };

  getDescription = () => {
    return this.state.description || '';
  };

  getSrc = () => {
    return this.state.src || defaultNPCImage.src;
  };

  getIndex = () => {
    return this.state.index;
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const { current } = this.tokenRef;

    if (!current) return;

    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool') {
      this.setState({ isDragging: true });
    } else if (activeTool === 'Cursor Tool') {
      setActiveToken(this);
      setPanelVisibility('npcEditorPanelWrapper', true);
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    const { isDragging, position, offsetX, offsetY } = this.state;
    if (isDragging && this.tokenRef.current) {
      const scaleFactor = getZoomScaleFactor();
      const canvas = document.getElementById('canvas'); // Replace 'your-canvas-id' with the actual ID of your canvas
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      // Calculate the offset of the mouse event relative to the canvas
      const offsetX = event.clientX - canvasRect.left - window.scrollX;
      const offsetY = event.clientY - canvasRect.top - window.scrollY;
      /* const offsetX = nativeEvent.clientX - window.scrollX;
      const offsetY = nativeEvent.clientY - window.scrollY; */

      // Adjust the offset based on the scale factor
      const scaledOffsetX = (offsetX / scaleFactor) - 30;
      const scaledOffsetY = (offsetY / scaleFactor) - 20;
      this.setState({ position: { x: scaledOffsetX, y: scaledOffsetY } });
    }
  };
  
  handleMouseUp = () => {
    this.setState({ isDragging: false });
  };

  handleWindowOpen = () => {
    const windowOffsetX = 3000;
    const windowOffsetY = 50;
    this.setState({ offsetX: windowOffsetX, offsetY: windowOffsetY });
  };

  componentDidMount() {
    window.addEventListener('openWindow', this.handleWindowOpen);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('openWindow', this.handleWindowOpen);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { position, isDragging } = this.state;

    return (
      <div
        className="Token"
        id="Token"
        ref={this.tokenRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          cursor: getGlobalActiveTool() === 'Move Tool' ? (isDragging ? 'grabbing' : 'grab') : 'auto',
        }}
        onMouseDown={this.handleMouseDown}
      >
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <img src={this.state.src} alt={defaultNPCImage.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{this.state.name}</p>
      </div>
    );
  }
}

export default Token;
