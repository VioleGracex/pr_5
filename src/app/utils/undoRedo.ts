import { Command } from '../state/appStateReducer';

export const pushUndo = (undoStack: Command[], command: Command): Command[] => {
  return [...undoStack, command];
};

export const popUndo = (undoStack: Command[]): { command: Command; rest: Command[] } => {
  const [command, ...rest] = undoStack.slice().reverse();
  return { command, rest: rest.reverse() };
};

export const pushRedo = (redoStack: Command[], command: Command): Command[] => {
  return [...redoStack, command];
};

export const popRedo = (redoStack: Command[]): { command: Command; rest: Command[] } => {
  const [command, ...rest] = redoStack.slice().reverse();
  return { command, rest: rest.reverse() };
};
