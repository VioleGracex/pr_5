// Save.ts
import { useEffect, useState } from "react";
import MainPage  from "../Home";

export const saveHomeData = () => {
    // Render the Home component to generate its data
    const homeData = MainPage;
  
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

const loadWiseFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.wise';
    fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const fileContent = e.target.result as string;
                    try {
                        const parsedContent = JSON.parse(fileContent);
                        //setLoadedHome(parsedContent); // Set the loaded home
                    } catch (error) {
                        console.error('Error parsing .wise file:', error);
                    }
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
};


// loadData.ts

export const loadMainPageData = () => {
    // Implement your load logic here
    const savedData = localStorage.getItem('mainPageData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null; // Return null if no data is found
  };
  
