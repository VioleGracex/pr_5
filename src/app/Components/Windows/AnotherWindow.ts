// AnotherWindow.ts
import { WebviewWindow } from '@tauri-apps/api/window';

const createAnotherWindow = () => {
  const anotherWindow = new WebviewWindow('anotherUniqueLabel', {
    url: 'path/to/another-page.html',
  });

  // Handle creation response
  anotherWindow.once('tauri://created', () => {
    console.log('Another window successfully created');
  });

  anotherWindow.once('tauri://error', (error) => {
    console.error('An error occurred during the creation of another window:', error);
  });
};

export default createAnotherWindow;
