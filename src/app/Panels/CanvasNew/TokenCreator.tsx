import { addActivity } from '@/app/Panels/ConsoleBar'; // Import addActivity function
import Token from '@/app/Components/tools/Objects/Token';

const createToken = (
  { nativeEvent }: React.MouseEvent<HTMLCanvasElement>,
  type: string,
  layerRef: React.RefObject<HTMLCanvasElement>,
  tokens: React.ReactNode[],
  setTokens: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
  , scaleFactor:number
) => {
  const layer = layerRef.current;

  if (!layer) return;

  // Get the bounding rectangle of the canvas
  const canvasRect = layer.getBoundingClientRect();

  // Calculate the offset of the mouse event relative to the canvas
  const offsetX = nativeEvent.clientX - canvasRect.left - window.scrollX;
  const offsetY = nativeEvent.clientY - canvasRect.top - window.scrollY;
  /* const offsetX = nativeEvent.clientX - window.scrollX;
  const offsetY = nativeEvent.clientY - window.scrollY; */

  // Adjust the offset based on the scale factor
  const scaledOffsetX = (offsetX / scaleFactor) - 30;
  const scaledOffsetY = (offsetY / scaleFactor) - 20;

  // Create a new token with adjusted coordinates
  const newToken = (
    <Token
      type={type}
      key={tokens.length} // Use a unique key for each token
      x={scaledOffsetX}
      y={scaledOffsetY}
    />
  );

  // Update the state to include the new token
  setTokens((prevTokens) => [...prevTokens, newToken]);

  // Log the activity (optional)
  addActivity(`Created Token at coordinates ${scaledOffsetX}, ${scaledOffsetY}`);
};

export default createToken;
