import { Heading, Theme } from '@radix-ui/themes';
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
      <Heading as="h1" align="left" size="8" weight="medium">Color converter</Heading>
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
