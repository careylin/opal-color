import { Heading, Theme, Text, Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import ColorConverter from './components/ColorConverter';
import ColorOutput from './components/ColorOutput';
import { useState } from 'react'
import './App.css'

function App() {
  const [rgbaValue, setRgbaValue] = useState<string | null>(null);
  const [rgbFloatValue, setRgbFloatValue] = useState<string | null>(null);
  const [hexValue, setHexValue] = useState<string>('');

  const handleColorConvert = (rgba: string, rgbFloat: string, hex: string) => {
    setRgbaValue(rgba);
    setRgbFloatValue(rgbFloat);
    setHexValue(hex);
  };

  return (
    <Theme accentColor="green" grayColor="mauve">
      <Flex direction="column" gap="2">
        <Heading as="h1" align="left" size="8" weight="medium">Color converter</Heading>
        <Text as="p" align="left" size="2" color="gray" weight="regular">Convert between Hex, RGB, and RGB Floating Point Values</Text>
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
          />
        </div>
      </div>
    </Theme>
  )
}

export default App
