// Objects/NPCToken.tsx
import React, { Component } from 'react';
import defaultImage from '../../imgs/NPCAvatar.png';
import { getGlobalActiveTool } from '../ToolPanel';
import { StaticImageData } from 'next/image';
import { setPanelVisibility } from '@/app/state/panelVisibility';
import { setActiveElement, setActiveNpcToken } from '@/app/state/ActiveElement';
import { getZoomScaleFactor } from '../useTools/useZoom';
import { addActivity } from '@/app/Panels/ConsoleBar';

interface NPCTokenProps {
  name?: string;
  race?: string;
  job?: string;
  description?: string;
  x?: number;
  y?: number;
  src?: string | StaticImageData;
}

interface NPCTokenState {
  isDragging: boolean;
  position: { x: number; y: number };
  offsetX: number;
  offsetY: number;
  name: string; // Define the name property in the state
  job: string; // Define the job property in the state
  race: string; // Define the race property in the state
  description: string; // Define the description property in the state
}

class NPCToken extends Component<NPCTokenProps, NPCTokenState> {
  state: NPCTokenState = {
    isDragging: false,
    position: { x: this.props.x || 0, y: this.props.y || 0 },
    offsetX: 0,
    offsetY: 0,
    name: this.props.name || '', // Initialize name with default value from props
    job: this.props.job || '', // Initialize job with default value from props
    race: this.props.race || '', // Initialize race with default value from props
    description: this.props.description || '', // Initialize description with default value from props
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

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const { current } = this.tokenRef;

    if (!current) return;

    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool') {
      this.setState({ isDragging: true });
    } else if (activeTool === 'Cursor Tool') {
      setActiveNpcToken(this);
      setPanelVisibility('npcEditorPanelWrapper', true);
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    const { isDragging, position, offsetX, offsetY } = this.state;
    if (isDragging && this.tokenRef.current) {
      const scaleFactor = getZoomScaleFactor();
      const canvasOffsetX = offsetX / scaleFactor;
      const canvasOffsetY = offsetY / scaleFactor;
      const updatedX = (event.clientX - canvasOffsetX - this.tokenRef.current.offsetWidth / 2) / scaleFactor;
      const updatedY = (event.clientY - canvasOffsetY - this.tokenRef.current.offsetHeight / 2) / scaleFactor;
      this.setState({ position: { x: updatedX, y: updatedY } });
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
    const { name = '', job = '', description = '', race = '', src } = this.props;

    return (
      <div
        className="NpcToken"
        id="NpcToken"
        ref={this.tokenRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          cursor: getGlobalActiveTool() === 'Move Tool' ? (isDragging ? 'grabbing' : 'grab') : 'auto',
        }}
        onMouseDown={this.handleMouseDown}
      >
        {src !== undefined ? (
          <img src={typeof src === 'string' ? src : src.src} alt={this.state.name} style={{ width: '70px', height: '60px' }} />
        ) : (
          <img src={defaultImage.src} alt={this.state.name} style={{ width: '70px', height: '60px' }} />
        )}
        <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{this.state.name}</p>
        {/* <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{this.state.job}</p>
        <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{this.state.description}</p>
        <p style={{ color: 'black', margin: 0, textAlign: 'center' }}>{this.state.race}</p> */}
      </div>
    );
  }
}

export default NPCToken;
