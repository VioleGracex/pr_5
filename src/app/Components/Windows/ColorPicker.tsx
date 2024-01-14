import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { useCanvas } from '@/app/Panels/CanvasContext';
import { addActivity } from '@/app/Panels/ConsoleBar';

interface ColorPickerProps {
  onSelectColor: (color: string) => void;
  onChangeComplete: (color: ColorResult) => void;
}

const ColorPickerModule: React.FC<ColorPickerProps> = ({ onSelectColor, onChangeComplete }) => {
  const { setStrokeColor } = useCanvas(); // Access setStrokeColor from CanvasContext
  const [color, setColor] = useState<ColorResult>({
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsl: { h: 0, s: 0, l: 0, a: 1 },
  });

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor);
    onSelectColor(newColor.hex);
    setStrokeColor(newColor.hex); // Set stroke color for canvas
    addActivity(`changed color to ${newColor.hex}`);

  };

  const handleChangeCompleteLocal = (newColor: ColorResult) => {
    onChangeComplete(newColor);
  };

  return (
    <div>
      <ChromePicker color={color.rgb} onChange={handleChange} onChangeComplete={handleChangeCompleteLocal} />
    </div>
  );
};

export default ColorPickerModule;
