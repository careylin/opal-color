import { Heading, Theme, Text, Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import ColorConverter from './components/ColorConverter';
import ColorOutput from './components/ColorOutput';
import { useState, useEffect } from 'react'
import './App.css'
import { DEFAULT_COLOR, DEFAULT_RGBA, DEFAULT_FLOAT, DEFAULT_HSL, DEFAULT_LAB } from './config/colors';

function App() {
  const [rgbaValue, setRgbaValue] = useState<string | null>(null);
  const [rgbFloatValue, setRgbFloatValue] = useState<string | null>(null);
  const [hexValue, setHexValue] = useState<string>(DEFAULT_COLOR);
  const [hslValue, setHslValue] = useState<string | null>(null);
  const [labValue, setLabValue] = useState<string | null>(null);

  // Set default color on initial load
  useEffect(() => {
    setRgbaValue(`rgba(${DEFAULT_RGBA})`);
    setRgbFloatValue(`rgba(${DEFAULT_FLOAT})`);
    setHexValue(DEFAULT_COLOR);
    setHslValue(DEFAULT_HSL);
    setLabValue(DEFAULT_LAB);
  }, []);

  const handleColorConvert = (rgba: string, rgbFloat: string, hex: string, hsl: string, lab: string) => {
    setRgbaValue(rgba);
    setRgbFloatValue(rgbFloat);
    setHexValue(hex);
    setHslValue(hsl);
    setLabValue(lab);
  };

  return (
    <Theme accentColor="gray" grayColor="sage" radius="large">
      <Flex direction="column" gap="2">
        <Heading as="h1" align="left" size="9" weight="medium">Opal Color</Heading>
        <Text as="p" align="left" size="2" color="gray" weight="regular">Convert between Hex, RGB, RGB Floating Point Values, and LAB</Text>
      </Flex>
      <div className="layout-container">
        <div className="input-section">
          <ColorConverter onConvert={handleColorConvert} />
        </div>
        <div className="output-section">
          <ColorOutput 
            rgbaValue={rgbaValue} 
            rgbFloatValue={rgbFloatValue}
            hexValue={hexValue}
            hslValue={hslValue}
            labValue={labValue}
          />
        </div>
      </div>
    </Theme>
  )
}

export default App
