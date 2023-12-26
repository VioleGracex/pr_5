// tauri.d.ts
interface Window {
    Tauri: {
      listen: (windowName: string, payload: any) => void;
      // Add other Tauri properties as needed
    };
  }
  