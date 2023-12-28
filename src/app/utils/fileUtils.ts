// fileUtils.ts
import { AppState } from '../state/appStateReducer';

export const getProjectFileName = (projectId: number): string => `newProject${projectId > 1 ? `_${projectId}` : ''}.wise`;
export const getSaveFolderName = (): string => 'saves';

export const loadStateFromStorage = (projectId: number): AppState | null => {
  try {
    const serializedState = localStorage.getItem(`${getSaveFolderName()}/${getProjectFileName(projectId)}`);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading state from storage:', error);
    return null;
  }
};

export const createSaveFolderIfNeeded = (): void => {
  const saveFolderName = getSaveFolderName();
  if (!localStorage.getItem(saveFolderName)) {
    localStorage.setItem(saveFolderName, 'created');
  }
};

export const saveStateToFile = (state: AppState, projectId: number): void => {
  try {
    createSaveFolderIfNeeded();
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${getSaveFolderName()}/${getProjectFileName(projectId)}`, serializedState);
  } catch (error) {
    console.error('Error saving state to file:', error);
  }
};
