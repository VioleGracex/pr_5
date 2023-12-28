// utils/file.ts
import { AppState } from '../state/appStateReducer';

export const saveStateToFile = (state: AppState, fileName: string): void => {
  const jsonState = JSON.stringify(state);
  const blob = new Blob([jsonState], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const loadStateFromFile = (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonState = event.target?.result as string;
        const state = JSON.parse(jsonState);
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};
