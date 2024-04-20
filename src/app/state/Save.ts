// Save.ts
import { Home } from "../Home";

export const saveHomeData = () => {
    // Render the Home component to generate its data
    const homeData = Home;
  
    // Convert the data to JSON
    const jsonData = JSON.stringify(homeData);
  
    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
  
    // Create a download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'homeData.wise'; // Set the file name with .wise extension
  
    // Trigger a click event to download the file
    a.click();
  
    // Cleanup
    URL.revokeObjectURL(a.href);
};
