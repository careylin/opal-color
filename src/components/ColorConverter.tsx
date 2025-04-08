import { useState } from 'react';
import { TextField, Button, Text, Card, Flex, Tabs } from '@radix-ui/themes';
import styles from './ColorConverter.module.css';

interface ColorConverterProps {
  onConvert: (rgb: string, rgba: string, rgbFloat: string, hex: string) => void;
}

const ColorConverter = ({ onConvert }: ColorConverterProps) => {
  const [hexValue, setHexValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rgbFloatError, setRgbFloatError] = useState<string | null>(null);
  const [rgbError, setRgbError] = useState<string | null>(null);
  const [rgbFloatInput, setRgbFloatInput] = useState('');
  const [rgbInput, setRgbInput] = useState('');

  const handleReset = () => {
    setHexValue('');
    setRgbFloatInput('');
    setRgbInput('');
    setError(null);
    setRgbFloatError(null);
    setRgbError(null);
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Remove the # if present
    const cleanHex = hexValue.replace('#', '');
    
    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      setError('Please enter a valid 6-digit hex color code');
      return;
    }

    // Convert hex to RGB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Calculate RGB Float values
    const rFloat = (r / 255).toFixed(12);
    const gFloat = (g / 255).toFixed(12);
    const bFloat = (b / 255).toFixed(12);

    const rgbValue = `rgb(${r}, ${g}, ${b})`;
    const rgbaValue = `rgba(${r}, ${g}, ${b}, 1)`;
    const rgbFloatValue = `rgb(${rFloat}, ${gFloat}, ${bFloat})`;
    onConvert(rgbValue, rgbaValue, rgbFloatValue, hexValue);
  };

  const handleRgbFloatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRgbFloatError(null);

    // Split the input string and trim whitespace
    const values = rgbFloatInput.split(',').map(v => v.trim());
    
    if (values.length < 3 || values.length > 4) {
      setRgbFloatError('Please enter three or four comma-separated values (RGB or RGBA)');
      return;
    }

    // Parse the values
    const r = parseFloat(values[0]);
    const g = parseFloat(values[1]);
    const b = parseFloat(values[2]);
    const a = values.length === 4 ? parseFloat(values[3]) : 1;

    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
      setRgbFloatError('Please enter valid numbers');
      return;
    }

    if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1) {
      setRgbFloatError('RGB values must be between 0 and 1');
      return;
    }

    if (a < 0 || a > 1) {
      setRgbFloatError('Alpha value must be between 0 and 1');
      return;
    }

    // Convert to RGB
    const rgbR = Math.round(r * 255);
    const rgbG = Math.round(g * 255);
    const rgbB = Math.round(b * 255);

    // Convert to hex
    const hexR = rgbR.toString(16).padStart(2, '0');
    const hexG = rgbG.toString(16).padStart(2, '0');
    const hexB = rgbB.toString(16).padStart(2, '0');
    const hexValue = `#${hexR}${hexG}${hexB}`;

    const rgbValue = `rgb(${rgbR}, ${rgbG}, ${rgbB})`;
    const rgbaValue = `rgba(${rgbR}, ${rgbG}, ${rgbB}, ${a})`;
    const rgbFloatValue = `rgb(${r.toFixed(12)}, ${g.toFixed(12)}, ${b.toFixed(12)})`;
    onConvert(rgbValue, rgbaValue, rgbFloatValue, hexValue);
  };

  const handleRgbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRgbError(null);

    // Split the input string and trim whitespace
    const values = rgbInput.split(',').map(v => v.trim());
    
    if (values.length !== 3) {
      setRgbError('Please enter three comma-separated values');
      return;
    }

    // Parse the values
    const rNum = parseInt(values[0]);
    const gNum = parseInt(values[1]);
    const bNum = parseInt(values[2]);

    if (isNaN(rNum) || isNaN(gNum) || isNaN(bNum)) {
      setRgbError('Please enter valid numbers');
      return;
    }

    if (rNum < 0 || rNum > 255 || gNum < 0 || gNum > 255 || bNum < 0 || bNum > 255) {
      setRgbError('Values must be between 0 and 255');
      return;
    }

    // Convert to hex
    const hexR = rNum.toString(16).padStart(2, '0');
    const hexG = gNum.toString(16).padStart(2, '0');
    const hexB = bNum.toString(16).padStart(2, '0');
    const hexValue = `#${hexR}${hexG}${hexB}`;

    // Calculate RGB Float values
    const rFloat = (rNum / 255).toFixed(12);
    const gFloat = (gNum / 255).toFixed(12);
    const bFloat = (bNum / 255).toFixed(12);

    const rgbValue = `rgb(${rNum}, ${gNum}, ${bNum})`;
    const rgbaValue = `rgba(${rNum}, ${gNum}, ${bNum}, 1)`;
    const rgbFloatValue = `rgb(${rFloat}, ${gFloat}, ${bFloat})`;
    onConvert(rgbValue, rgbaValue, rgbFloatValue, hexValue);
  };

  return (
    <Card className={styles.container}>
      <Tabs.Root defaultValue="hex">
        <Tabs.List>
          <Tabs.Trigger value="hex">Hex</Tabs.Trigger>
          <Tabs.Trigger value="rgba">RGBA</Tabs.Trigger>
          <Tabs.Trigger value="float">Float</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="hex">
          <form onSubmit={handleHexSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={hexValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHexValue(e.target.value)}
                placeholder="#FF0000"
                size="3"
              />
              <Button type="submit" size="3">
                Convert
              </Button>
            </Flex>
          </form>
          
          {error && (
            <Text color="red" size="2" className={styles.error}>
              {error}
            </Text>
          )}
        </Tabs.Content>

        <Tabs.Content value="rgba">
          <form onSubmit={handleRgbSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={rgbInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRgbInput(e.target.value)}
                placeholder="255, 128, 0, 1"
                size="3"
              />
              <Button type="submit" size="3">
                Convert
              </Button>
            </Flex>
          </form>
          
          {rgbError && (
            <Text color="red" size="2" className={styles.error}>
              {rgbError}
            </Text>
          )}
        </Tabs.Content>

        <Tabs.Content value="float">
          <form onSubmit={handleRgbFloatSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={rgbFloatInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRgbFloatInput(e.target.value)}
                placeholder="0.364, 0.890, 0.447, 1"
                size="3"
              />
              <Button type="submit" size="3">
                Convert
              </Button>
            </Flex>
          </form>
          
          {rgbFloatError && (
            <Text color="red" size="2" className={styles.error}>
              {rgbFloatError}
            </Text>
          )}
        </Tabs.Content>
      </Tabs.Root>
      <Flex justify="start" mt="3">
        <Button variant="ghost" size="2" onClick={handleReset}>
          Reset
        </Button>
      </Flex>
    </Card>
  );
};

export default ColorConverter; 