//useBrush.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getGlobalActiveTool, setGlobalActiveTool } from "../ToolPanel";

function useBrush(): void {
  
  setGlobalActiveTool("Pencil");
  const activeTool = getGlobalActiveTool();
  if (activeTool) {
    // If active tool is set, add activity based on the active tool
    addActivity(`Used ${activeTool} Brush `);
  } else {
    // If active tool is not set, add a default activity
    addActivity("Error Using Tool not found");
  }
}

export default useBrush;
