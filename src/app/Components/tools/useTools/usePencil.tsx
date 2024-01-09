//usePencil.tsx
import { addActivity } from "@/app/Panels/ConsoleBar";
import { getActiveTool, setActiveTool } from "../ToolPanel";

function usePencil(): void {
  
  setActiveTool("Pencil");
  const activeTool = getActiveTool();
  if (activeTool) {
    // If active tool is set, add activity based on the active tool
    addActivity(`Used ${activeTool} Pencil `);
  } else {
    // If active tool is not set, add a default activity
    addActivity("Error Using Tool not found");
  }
}

export default usePencil;
