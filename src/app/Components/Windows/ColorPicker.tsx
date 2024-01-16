import React, { useState, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { addActivity } from '@/app/Panels/ConsoleBar';
import { setIsPaletteVisible,getIsPaletteVisible } from '../tools/useTools/usePalette';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onChangeComplete: (color: ColorResult) => void;
}

const ColorPickerModule: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor, onChangeComplete }) => {
  const [visible, setVisible] = useState<boolean>(getIsPaletteVisible()); // Internal state for visibility
  const [color, setColor] = useState<ColorResult>({
    hex: selectedColor,
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsl: { h: 0, s: 0, l: 0, a: 1 },
  });

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor);
    onSelectColor(newColor.hex);
    addActivity(`changed color to ${newColor.hex}`);
  };

  const handleChangeCompleteLocal = (newColor: ColorResult) => {
    onChangeComplete(newColor);
  };

  const handleOK = () => {
    setIsPaletteVisible(false);
    setVisible(false); // Update the internal state
    // addActivity("CLICKED OK");
  };

  useEffect(() => {
    
  }, [visible]);

  // Render the ColorPickerModule only if internal state visible is true
  return visible ? (
    <div style={{ position: 'relative' }}>
      <ChromePicker color={color.rgb} onChange={handleChange} onChangeComplete={handleChangeCompleteLocal} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <button style={{ marginRight: '15px', backgroundColor: 'white', color: 'black', border: '0.5px solid gray', padding: '5px 10px' }} onClick={handleOK}>OK</button>
      </div>
    </div>
  ) : null;
};

export default ColorPickerModule;
