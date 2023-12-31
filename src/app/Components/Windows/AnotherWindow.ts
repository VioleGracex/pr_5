// AnotherWindow.ts
import { WebviewWindow } from '@tauri-apps/api/window';

const createAnotherWindow = () => {
  const anotherWindow = new WebviewWindow('anotherUniqueLabel', {
    url: 'http://localhost:3000', // Replace with your desired URL or 'index.html' if it's a local file
    title: '', // Provide an empty string as the title
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
