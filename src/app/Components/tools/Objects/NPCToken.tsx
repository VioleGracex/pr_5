import React, { Component } from 'react';
import defaultImage from '../../imgs/NPCAvatar.png';
import { getGlobalActiveTool } from '../ToolPanel';
import { StaticImageData } from 'next/image';
import { setPanelVisibility } from '@/app/state/panelVisibility';
import { setActiveElement } from '@/app/state/ActiveElement';
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

class NPCToken extends Component<NPCTokenProps> {
  state = {
    isDragging: false,
    position: { x: this.props.x || 0, y: this.props.y || 0 },
    offsetX: 0,
    offsetY: 0,
  };

  tokenRef = React.createRef<HTMLDivElement>();

  setName = (value: string) => {
    // Implement the logic to set the name state here
    this.setState({ name: value });
  };

  setJob = (value: string) => {
    // Implement the logic to set the job state here
    this.setState({ job: value });
  };

  setRace = (value: string) => {
    // Implement the logic to set the race state here
    this.setState({ race: value });
  };

  setDescription = (value: string) => {
    // Implement the logic to set the description state here
    this.setState({ description: value });
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const { isDragging } = this.state;
    const { current } = this.tokenRef;

    if (!current) return;

    const activeTool = getGlobalActiveTool();
    if (activeTool === 'Move Tool') {
       // set is dragging true
       this.setState({ isDragging: true });
    } else if (activeTool === 'Cursor Tool') {
      setActiveElement(current);
      setPanelVisibility('npcEditorPanelWrapper', true);
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    const { isDragging, position, offsetX, offsetY } = this.state;
    addActivity("isDragging" + isDragging);
    if (isDragging && this.tokenRef.current) {
      addActivity("isdrag");
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
}

export default NPCToken;
