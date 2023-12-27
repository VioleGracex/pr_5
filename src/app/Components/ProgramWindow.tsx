import React from 'react';
import { useDrag, ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import { ItemTypes } from './Constants'; // Define your drag item types

interface ProgramWindowProps {
  id: string;
  title: string;
  initialX: number;
  initialY: number;
}

const ProgramWindow: React.FC<ProgramWindowProps> = ({ id, title, initialX, initialY }) => {
  const [collectedProps, drag, preview] = useDrag<any, any, any>({
    type: ItemTypes.PROGRAM_WINDOW,
    item: { id, title, type: ItemTypes.PROGRAM_WINDOW },
  });

  const isDragging = collectedProps ? collectedProps.isDragging : false;

  return (
    <div
      ref={drag}
      className="program-window"
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: isDragging ? 2 : 1,
      }}
    >
      {title}
    </div>
  );
};

export default ProgramWindow;
