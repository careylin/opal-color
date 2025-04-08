import { Heading, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import ColorConverter from './components/ColorConverter';
import ColorOutput from './components/ColorOutput';
import { useState } from 'react'
import './App.css'

function App() {
  const [rgbValue, setRgbValue] = useState<string | null>(null);
  const [rgbaValue, setRgbaValue] = useState<string | null>(null);
  const [rgbFloatValue, setRgbFloatValue] = useState<string | null>(null);
  const [hexValue, setHexValue] = useState<string>('');

  const handleColorConvert = (rgb: string, rgba: string, rgbFloat: string, hex: string) => {
    setRgbValue(rgb);
    setRgbaValue(rgba);
    setRgbFloatValue(rgbFloat);
    setHexValue(hex);
  };

  return (
    <Theme>
      <Heading as="h1" align="left" size="7">Color converter</Heading>
      <div className="layout-container">
        <div className="input-section">
          <ColorConverter onConvert={handleColorConvert} />
        </div>
        <div className="output-section">
          <ColorOutput 
            rgbValue={rgbValue} 
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
