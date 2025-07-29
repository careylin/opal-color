import { useState, useEffect } from 'react';
import { TextField, Button, Text, Card, Flex, Tabs } from '@radix-ui/themes';
import styles from './ColorConverter.module.css';
import { formatFloatValue } from '../utils/colorUtils';
import { DEFAULT_COLOR, DEFAULT_RGBA, DEFAULT_FLOAT, DEFAULT_HSL, DEFAULT_LAB } from '../config/colors';
import { colord } from "colord";

interface ColorConverterProps {
  onConvert: (rgba: string, rgbFloat: string, hex: string, hsl: string, lab: string) => void;
}

const ColorConverter = ({ onConvert }: ColorConverterProps) => {
  const [hexValue, setHexValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rgbFloatError, setRgbFloatError] = useState<string | null>(null);
  const [rgbError, setRgbError] = useState<string | null>(null);
  const [hslError, setHslError] = useState<string | null>(null);
  const [labError, setLabError] = useState<string | null>(null);
  const [rgbFloatInput, setRgbFloatInput] = useState('');
  const [rgbInput, setRgbInput] = useState('');
  const [hslInput, setHslInput] = useState('');
  const [labInput, setLabInput] = useState('');

  // Set default color on initial load
  useEffect(() => {
    handleHexSubmit(new Event('submit') as any);
  }, []);

  const handleReset = () => {
    setHexValue('');
    setRgbFloatInput('');
    setRgbInput('');
    setHslInput('');
    setLabInput('');
    setError(null);
    setRgbFloatError(null);
    setRgbError(null);
    setHslError(null);
    setLabError(null);
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // If no hex value is provided, use the default color
    const hexToProcess = hexValue || DEFAULT_COLOR;
    
    // Remove the # if present and trim whitespace
    const cleanHex = hexToProcess.replace('#', '').trim();
    
    // Check if it's a hex6 or hex8 format
    const isHex6 = /^[0-9A-Fa-f]{6}$/.test(cleanHex);
    const isHex8 = /^[0-9A-Fa-f]{8}$/.test(cleanHex);
    
    if (!isHex6 && !isHex8) {
      setError('Please enter a valid 6-digit or 8-digit hex color code (e.g., #FF0000 or FF0000FF)');
      return;
    }

    // Use Colord to parse and convert the color
    const color = colord(`#${cleanHex}`);
    
    if (!color.isValid()) {
      setError('Please enter a valid hex color code');
      return;
    }

    // Extract values using Colord
    const rgb = color.toRgb();
    const alpha = color.alpha();
    
    // Calculate RGB Float values
    const rFloat = formatFloatValue(rgb.r / 255);
    const gFloat = formatFloatValue(rgb.g / 255);
    const bFloat = formatFloatValue(rgb.b / 255);

    // Get HSL and LAB using Colord
    const hsl = color.toHsl();
    const lab = color.toLab();
    const hslValue = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatFloatValue(alpha)})`;
    const labValue = `lab(${formatFloatValue(lab.l)}% ${formatFloatValue(lab.a)} ${formatFloatValue(lab.b)} / ${formatFloatValue(alpha)})`;

    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatFloatValue(alpha)})`;
    const rgbFloatValue = `rgba(${rFloat}, ${gFloat}, ${bFloat}, ${formatFloatValue(alpha)})`;
    
    // Preserve original hex8 value if it was a hex8 input, otherwise use Colord's conversion
    const hexOutput = isHex8 ? `#${cleanHex}` : color.toHex();
    
    onConvert(rgbaValue, rgbFloatValue, hexOutput, hslValue, labValue);
  };

  // Parse RGB Float input in various formats
  const parseRgbFloatInput = (input: string): { r: number, g: number, b: number, a: number } | null => {
    // Try to match rgba(r, g, b, a) or rgb(r, g, b) format
    const rgbaMatch = input.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (rgbaMatch) {
      const [, r, g, b, a = "1"] = rgbaMatch;
      return {
        r: parseFloat(r),
        g: parseFloat(g),
        b: parseFloat(b),
        a: parseFloat(a)
      };
    }
    
    // Try to match comma-separated values
    const values = input.split(',').map(v => v.trim());
    if (values.length >= 3 && values.length <= 4) {
      const r = parseFloat(values[0]);
      const g = parseFloat(values[1]);
      const b = parseFloat(values[2]);
      const a = values.length === 4 ? parseFloat(values[3]) : 1;
      
      if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) {
        return { r, g, b, a };
      }
    }
    
    return null;
  };

  const handleRgbFloatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRgbFloatError(null);

    const parsedValues = parseRgbFloatInput(rgbFloatInput);
    
    if (!parsedValues) {
      setRgbFloatError('Please enter valid RGB float values (e.g., 0.5, 0.3, 0.8 or rgba(0.5, 0.3, 0.8, 1))');
      return;
    }

    const { r, g, b, a } = parsedValues;

    if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1) {
      setRgbFloatError('RGB values must be between 0 and 1');
      return;
    }

    if (a < 0 || a > 1) {
      setRgbFloatError('Alpha value must be between 0 and 1');
      return;
    }

    // Use Colord to convert from RGB float values
    const color = colord({ r: r * 255, g: g * 255, b: b * 255, a });
    
    if (!color.isValid()) {
      setRgbFloatError('Invalid color values');
      return;
    }

    // Extract values using Colord
    const rgb = color.toRgb();
    const alpha = color.alpha();
    
    // Convert to hex
    const hexValue = color.toHex();

    // Get HSL using Colord
    const hsl = color.toHsl();
    const hslValue = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatFloatValue(alpha)})`;

    // Get LAB using Colord
    const lab = color.toLab();
    const labValue = `lab(${formatFloatValue(lab.l)}% ${formatFloatValue(lab.a)} ${formatFloatValue(lab.b)} / ${formatFloatValue(alpha)})`;

    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatFloatValue(alpha)})`;
    const rgbFloatValue = `rgba(${formatFloatValue(r)}, ${formatFloatValue(g)}, ${formatFloatValue(b)}, ${formatFloatValue(alpha)})`;
    onConvert(rgbaValue, rgbFloatValue, hexValue, hslValue, labValue);
  };

  // Parse RGB input in various formats
  const parseRgbInput = (input: string): { r: number, g: number, b: number, a: number } | null => {
    // Try to match rgba(r, g, b, a) or rgb(r, g, b) format
    const rgbaMatch = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (rgbaMatch) {
      const [, r, g, b, a = "1"] = rgbaMatch;
      return {
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
        a: parseFloat(a)
      };
    }
    
    // Try to match comma-separated values
    const values = input.split(',').map(v => v.trim());
    if (values.length >= 3 && values.length <= 4) {
      const r = parseInt(values[0]);
      const g = parseInt(values[1]);
      const b = parseInt(values[2]);
      const a = values.length === 4 ? parseFloat(values[3]) : 1;
      
      if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) {
        return { r, g, b, a };
      }
    }
    
    return null;
  };

  const handleRgbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRgbError(null);

    const parsedValues = parseRgbInput(rgbInput);
    
    if (!parsedValues) {
      setRgbError('Please enter valid RGB values (e.g., 255, 128, 0 or rgba(255, 128, 0, 1))');
      return;
    }

    const { r, g, b, a } = parsedValues;

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      setRgbError('RGB values must be between 0 and 255');
      return;
    }

    if (a < 0 || a > 1) {
      setRgbError('Alpha value must be between 0 and 1');
      return;
    }

    // Use Colord to convert from RGB values
    const color = colord({ r, g, b, a });
    
    if (!color.isValid()) {
      setRgbError('Invalid color values');
      return;
    }

    // Extract values using Colord
    const rgb = color.toRgb();
    const alpha = color.alpha();
    
    // Convert to hex
    const hexValue = color.toHex();

    // Calculate RGB Float values
    const rFloat = formatFloatValue(r / 255);
    const gFloat = formatFloatValue(g / 255);
    const bFloat = formatFloatValue(b / 255);

    // Get HSL using Colord
    const hsl = color.toHsl();
    const hslValue = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatFloatValue(alpha)})`;

    // Get LAB using Colord
    const lab = color.toLab();
    const labValue = `lab(${formatFloatValue(lab.l)}% ${formatFloatValue(lab.a)} ${formatFloatValue(lab.b)} / ${formatFloatValue(alpha)})`;

    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatFloatValue(alpha)})`;
    const rgbFloatValue = `rgba(${rFloat}, ${gFloat}, ${bFloat}, ${formatFloatValue(alpha)})`;
    onConvert(rgbaValue, rgbFloatValue, hexValue, hslValue, labValue);
  };

  // Parse LAB input in various formats
  const parseLabInput = (input: string): { l: number, a: number, b: number, alpha: number } | null => {
    // Try to match lab(l a b / alpha) format
    const labMatch = input.match(/lab\s*\(\s*([\d.]+)%?\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i);
    if (labMatch) {
      const [, l, a, b, alpha = "1"] = labMatch;
      return {
        l: parseFloat(l),
        a: parseFloat(a),
        b: parseFloat(b),
        alpha: parseFloat(alpha)
      };
    }
    
    // Try to match comma-separated values
    const values = input.split(',').map(v => v.trim());
    if (values.length >= 3 && values.length <= 4) {
      const l = parseFloat(values[0]);
      const a = parseFloat(values[1]);
      const b = parseFloat(values[2]);
      const alpha = values.length === 4 ? parseFloat(values[3]) : 1;
      
      if (!isNaN(l) && !isNaN(a) && !isNaN(b) && !isNaN(alpha)) {
        return { l, a, b, alpha };
      }
    }
    
    return null;
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLabError(null);

    const parsedValues = parseLabInput(labInput);
    
    if (!parsedValues) {
      setLabError('Please enter valid LAB values (e.g., 53.24, 80.09, 67.2 or lab(53.24% 80.09 67.2 / 1))');
      return;
    }

    const { l, a, b, alpha } = parsedValues;

    // LAB value ranges: L: 0-100, a: -128 to 127, b: -128 to 127
    if (l < 0 || l > 100) {
      setLabError('L value must be between 0 and 100');
      return;
    }

    if (a < -128 || a > 127) {
      setLabError('a value must be between -128 and 127');
      return;
    }

    if (b < -128 || b > 127) {
      setLabError('b value must be between -128 and 127');
      return;
    }

    if (alpha < 0 || alpha > 1) {
      setLabError('Alpha value must be between 0 and 1');
      return;
    }

    // Use Colord to convert from LAB values
    const color = colord({ l, a, b, alpha });
    
    if (!color.isValid()) {
      setLabError('Invalid LAB color values');
      return;
    }

    // Extract values using Colord
    const rgb = color.toRgb();
    const extractedAlpha = color.alpha();
    
    // Convert to hex
    const hexValue = color.toHex();

    // Calculate RGB Float values
    const rFloat = formatFloatValue(rgb.r / 255);
    const gFloat = formatFloatValue(rgb.g / 255);
    const bFloat = formatFloatValue(rgb.b / 255);

    // Get HSL and LAB using Colord
    const hsl = color.toHsl();
    const lab = color.toLab();
    const hslValue = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatFloatValue(extractedAlpha)})`;
    const labValue = `lab(${formatFloatValue(lab.l)}% ${formatFloatValue(lab.a)} ${formatFloatValue(lab.b)} / ${formatFloatValue(extractedAlpha)})`;

    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatFloatValue(extractedAlpha)})`;
    const rgbFloatValue = `rgba(${rFloat}, ${gFloat}, ${bFloat}, ${formatFloatValue(extractedAlpha)})`;
    onConvert(rgbaValue, rgbFloatValue, hexValue, hslValue, labValue);
  };

  // Parse HSL input in various formats
  const parseHslInput = (input: string): { h: number, s: number, l: number, a: number } | null => {
    // Try to match hsla(h, s%, l%, a) or hsl(h, s%, l%) format
    const hslMatch = input.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (hslMatch) {
      const [, h, s, l, a = "1"] = hslMatch;
      return {
        h: parseFloat(h),
        s: parseFloat(s),
        l: parseFloat(l),
        a: parseFloat(a)
      };
    }
    
    // Try to match comma-separated values
    const values = input.split(',').map(v => v.trim());
    if (values.length >= 3 && values.length <= 4) {
      const h = parseFloat(values[0]);
      const s = parseFloat(values[1]);
      const l = parseFloat(values[2]);
      const a = values.length === 4 ? parseFloat(values[3]) : 1;
      
      if (!isNaN(h) && !isNaN(s) && !isNaN(l) && !isNaN(a)) {
        return { h, s, l, a };
      }
    }
    
    return null;
  };

  const handleHslSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHslError(null);

    const parsedValues = parseHslInput(hslInput);
    
    if (!parsedValues) {
      setHslError('Please enter valid HSL values (e.g., 150, 9, 96 or hsla(150, 9%, 96%, 1))');
      return;
    }

    const { h, s, l, a } = parsedValues;

    // HSL value ranges: H: 0-360, S: 0-100, L: 0-100
    if (h < 0 || h > 360) {
      setHslError('Hue value must be between 0 and 360');
      return;
    }

    if (s < 0 || s > 100) {
      setHslError('Saturation value must be between 0 and 100');
      return;
    }

    if (l < 0 || l > 100) {
      setHslError('Lightness value must be between 0 and 100');
      return;
    }

    if (a < 0 || a > 1) {
      setHslError('Alpha value must be between 0 and 1');
      return;
    }

    // Use Colord to convert from HSL values
    const color = colord({ h, s, l, a });
    
    if (!color.isValid()) {
      setHslError('Invalid HSL color values');
      return;
    }

    // Extract values using Colord
    const rgb = color.toRgb();
    const alpha = color.alpha();
    
    // Convert to hex
    const hexValue = color.toHex();

    // Calculate RGB Float values
    const rFloat = formatFloatValue(rgb.r / 255);
    const gFloat = formatFloatValue(rgb.g / 255);
    const bFloat = formatFloatValue(rgb.b / 255);

    // Get HSL and LAB using Colord
    const hsl = color.toHsl();
    const lab = color.toLab();
    const hslValue = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatFloatValue(alpha)})`;
    const labValue = `lab(${formatFloatValue(lab.l)}% ${formatFloatValue(lab.a)} ${formatFloatValue(lab.b)} / ${formatFloatValue(alpha)})`;

    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatFloatValue(alpha)})`;
    const rgbFloatValue = `rgba(${rFloat}, ${gFloat}, ${bFloat}, ${formatFloatValue(alpha)})`;
    onConvert(rgbaValue, rgbFloatValue, hexValue, hslValue, labValue);
  };

  return (
    <Card className={styles.container} variant="ghost">
      <Tabs.Root defaultValue="hex">
        <Tabs.List color="mint">
          <Tabs.Trigger value="hex">Hex</Tabs.Trigger>
          <Tabs.Trigger value="rgba">RGBA</Tabs.Trigger>
          <Tabs.Trigger value="float">Float</Tabs.Trigger>
          <Tabs.Trigger value="hsl">HSL</Tabs.Trigger>
          <Tabs.Trigger value="lab">LAB</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="hex">
          <form onSubmit={handleHexSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={hexValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHexValue(e.target.value)}
                placeholder={`${DEFAULT_COLOR}`}
                size="3"
              />
              <Button type="submit" size="3" highContrast>
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
                placeholder={DEFAULT_RGBA}
                size="3"
              />
              <Button type="submit" size="3" highContrast>
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
                placeholder={DEFAULT_FLOAT}
                size="3"
              />
              <Button type="submit" size="3" highContrast>
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

        <Tabs.Content value="hsl">
          <form onSubmit={handleHslSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={hslInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHslInput(e.target.value)}
                placeholder={DEFAULT_HSL}
                size="3"
              />
              <Button type="submit" size="3" highContrast>
                Convert
              </Button>
            </Flex>
          </form>
          
          {hslError && (
            <Text color="red" size="2" className={styles.error}>
              {hslError}
            </Text>
          )}
        </Tabs.Content>

        <Tabs.Content value="lab">
          <form onSubmit={handleLabSubmit}>
            <Flex direction="column" gap="3" className={styles.form}>
              <TextField.Root type="text"
                value={labInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabInput(e.target.value)}
                placeholder={DEFAULT_LAB}
                size="3"
              />
              <Button type="submit" size="3" highContrast>
                Convert
              </Button>
            </Flex>
          </form>
          
          {labError && (
            <Text color="red" size="2" className={styles.error}>
              {labError}
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