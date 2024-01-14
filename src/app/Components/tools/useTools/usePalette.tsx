//usePalatte.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getGlobalActiveTool, setGlobalActiveTool } from "../ToolPanel";

function usePalette(): void {
  
  const activeTool = getGlobalActiveTool();
  if (activeTool) {
    // If active tool is set, add activity based on the active tool
    addActivity(`Used ${activeTool} Brush `);
  } else {
    // If active tool is not set, add a default activity
    addActivity("Error Using Tool not found");
  }
}

export default usePalette;
