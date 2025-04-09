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

const ColorOutput = ({ rgbaValue, rgbFloatValue, hexValue }: ColorOutputProps) => {
  if (!rgbaValue || !rgbFloatValue) return null;

  const formattedRgbFloat = formatRgbFloat(rgbFloatValue);
  const brightness = calculateBrightness(hexValue);
  const isDark = brightness < 128;
  
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
    <Card className={styles.outputCard} style={{ backgroundColor: hexValue }}>
      <Flex direction="column" gap="3">
        <div className={styles.colorInfo}>
          <Flex direction="column" gap="5" justify="between">
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>Hex</Text>
              <Flex direction="row" gap="2" align="center">
                <Text 
                  className={valueClass} 
                  size="7" 
                  weight="medium" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCopy(hexValue, 'hex')}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {hexValue}
                </Text>
                {copiedValue === 'hex' && (
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