import { Card, Text, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import styles from './ColorOutput.module.css';

interface ColorOutputProps {
  rgbaValue: string | null;
  rgbFloatValue: string | null;
  hexValue: string;
}

// Calculate brightness based on W3C algorithm
const calculateBrightness = (hexColor: string): number => {
  // Remove # if present
  const cleanHex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Calculate brightness using W3C algorithm
  return Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
};

const formatRgbFloat = (rgbFloat: string): string => {
  // Extract the numbers from the rgb() or rgba() format
  const matches = rgbFloat.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!matches) return rgbFloat;
  
  const [, r, g, b, a = "1"] = matches;
  return `rgba(${Number(r).toFixed(4)}, ${Number(g).toFixed(4)}, ${Number(b).toFixed(4)}, ${Number(a).toFixed(4)})`;
};

// Extract alpha value from RGBA string
const extractAlpha = (rgbaString: string): number => {
  const match = rgbaString.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
};

// Convert alpha value to hex
const alphaToHex = (alpha: number): string => {
  if (alpha === 1) return '';
  const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hexAlpha;
};

// Get hex with alpha if present
const getHexWithAlpha = (hexValue: string, alpha: number): { hex6: string, hex8: string | null } => {
  const cleanHex = hexValue.replace('#', '');
  const hex6 = `#${cleanHex}`;
  
  if (alpha === 1) {
    return { hex6, hex8: null };
  }
  
  const hexAlpha = alphaToHex(alpha);
  const hex8 = `#${cleanHex}${hexAlpha}`;
  
  return { hex6, hex8 };
};

const ColorOutput = ({ rgbaValue, rgbFloatValue, hexValue }: ColorOutputProps) => {
  if (!rgbaValue || !rgbFloatValue) return null;

  const formattedRgbFloat = formatRgbFloat(rgbFloatValue);
  const brightness = calculateBrightness(hexValue);
  const isDark = brightness < 128;
  const alpha = extractAlpha(rgbaValue);
  const { hex6, hex8 } = getHexWithAlpha(hexValue, alpha);
  
  const labelClass = isDark ? styles['label-dark'] : styles['label-light'];
  const valueClass = isDark ? styles['value-dark'] : styles['value-light'];

  // State for tracking which value was copied
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  // Function to handle copying to clipboard
  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopiedValue(type);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedValue(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Card className={styles.outputCard} style={{ backgroundColor: alpha < 1 ? rgbaValue : hexValue }}>
      <Flex direction="column" gap="3">
        <div className={styles.colorInfo}>
          <Flex direction="column" gap="5" justify="between">
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>Hex</Text>
              <Flex direction="row" gap="2" align="center">
                <Flex direction="row" align="center">
                  <Text 
                    className={valueClass} 
                    size="7" 
                    weight="medium" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCopy(hex6, 'hex')}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {hex6}
                  </Text>
                  {hex8 && (
                    <Text 
                      className={valueClass} 
                      size="7" 
                      weight="medium" 
                      style={{ cursor: 'pointer', marginLeft: '4px' }}
                      onClick={() => handleCopy(hex8, 'hex8')}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {hex8.substring(7)}
                    </Text>
                  )}
                </Flex>
                {copiedValue && (copiedValue === 'hex' || copiedValue === 'hex8') && (
                  <Text size="1" color="green">Copied</Text>
                )}
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGBA</Text>
              <Flex direction="row" gap="2" align="center">
                <Text 
                  className={valueClass} 
                  size="7" 
                  weight="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCopy(rgbaValue, 'rgba')}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {rgbaValue}
                </Text>
                {copiedValue === 'rgba' && (
                  <Text size="1" color="green">Copied</Text>
                )}
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGB Float</Text>
              <Flex direction="row" gap="2" align="center">
                <Text 
                  className={valueClass} 
                  size="7" 
                  weight="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCopy(formattedRgbFloat, 'float')}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {formattedRgbFloat}
                </Text>
                {copiedValue === 'float' && (
                  <Text size="1" color="green">Copied</Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </div>
        {/* <div className={styles.colorPreview} style={{ backgroundColor: hexValue }} /> */}
      </Flex>
    </Card>
  );
};

export default ColorOutput; 