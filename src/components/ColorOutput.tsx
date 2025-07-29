import { Card, Text, Flex } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import styles from './ColorOutput.module.css';
import { 
  formatRgbFloat, 
  alphaToHex
} from '../utils/colorUtils';
import CopyableText from './CopyableText';
import { DEFAULT_COLOR } from '../config/colors';
import { colord } from "colord";

interface ColorOutputProps {
  rgbaValue: string | null;
  rgbFloatValue: string | null;
  hexValue: string;
  hslValue?: string | null;
  labValue?: string | null;
}

const ColorOutput = ({ 
  rgbaValue, 
  rgbFloatValue, 
  hexValue = DEFAULT_COLOR, 
  hslValue,
  labValue
}: ColorOutputProps) => {
  // Memoize all calculations to prevent unnecessary recalculations
  const formattedRgbFloat = useMemo(() => 
    rgbFloatValue ? formatRgbFloat(rgbFloatValue) : null, 
    [rgbFloatValue]
  );

  // Use Colord for lightness calculation (HSL lightness is better for contrast detection)
  const lightness = useMemo(() => {
    if (!hexValue) return 100;
    const color = colord(hexValue);
    if (!color.isValid()) return 100;
    const hsl = color.toHsl();
    return hsl.l; // HSL lightness (0-100)
  }, [hexValue]);

  const isDark = useMemo(() => 
    lightness < 50, 
    [lightness]
  );

  // Use Colord for alpha extraction
  const alpha = useMemo(() => {
    if (!rgbaValue) return 1;
    const color = colord(rgbaValue);
    return color.isValid() ? color.alpha() : 1;
  }, [rgbaValue]);

  // Check if the hex value is a hex8 (with alpha)
  const isHex8 = useMemo(() => {
    const cleanHex = hexValue.replace('#', '');
    return cleanHex.length === 8;
  }, [hexValue]);

  // Extract hex6 and alpha parts from hex8 if applicable
  const hexValues = useMemo(() => {
    const cleanHex = hexValue.replace('#', '');
    
    if (isHex8) {
      // For hex8, extract the hex6 and alpha parts
      const hex6Part = `#${cleanHex.substring(0, 6)}`;
      const alphaPart = cleanHex.substring(6, 8);
      return { 
        hex6: hex6Part, 
        hex8: hexValue,
        alphaHex: alphaPart
      };
    } else {
      // For hex6, use Colord to get hex with alpha
      const color = colord(hexValue);
      const hex6 = color.toHex();
      const hex8 = alpha < 1 ? color.alpha(alpha).toHex() : null;
      return { 
        hex6, 
        hex8,
        alphaHex: alpha < 1 ? alphaToHex(alpha) : null
      };
    }
  }, [hexValue, alpha, isHex8]);
  
  // Calculate HSL values if not provided using Colord
  const calculatedHsl = useMemo(() => {
    if (!hexValue) return { h: 0, s: 0, l: 100 };
    const color = colord(hexValue);
    if (!color.isValid()) return { h: 0, s: 0, l: 100 };
    const hsl = color.toHsl();
    return { h: hsl.h, s: hsl.s, l: hsl.l };
  }, [hexValue]);
  
  const calculatedHslValue = useMemo(() => {
    const color = colord(hexValue);
    if (!color.isValid()) return 'hsl(0, 0%, 100%)';
    return color.alpha(alpha).toHslString();
  }, [hexValue, alpha]);
  
  // Use provided HSL value or calculated one
  const displayHslValue = hslValue || calculatedHslValue;
  
  // Calculate LAB values if not provided using Colord
  const calculatedLabValue = useMemo(() => {
    const color = colord(hexValue);
    if (!color.isValid()) return 'lab(100% 0 0 / 1)';
    const lab = color.toLab();
    return `lab(${lab.l.toFixed(2)}% ${lab.a.toFixed(2)} ${lab.b.toFixed(2)} / ${alpha.toFixed(2)})`;
  }, [hexValue, alpha]);
  
  // Use provided LAB value or calculated one
  const displayLabValue = labValue || calculatedLabValue;
  
  const labelClass = isDark ? styles['label-dark'] : styles['label-light'];
  const valueClass = isDark ? styles['value-dark'] : styles['value-light'];
  
  // State to track if the alpha part is being hovered
  const [isAlphaHovered, setIsAlphaHovered] = useState(false);
  const [isHex6Hovered, setIsHex6Hovered] = useState(false);

  // Handle hover for hex6 part
  const handleHex6Hover = (isHovering: boolean) => {
    setIsHex6Hovered(isHovering);
  };

  // Handle hover for alpha part
  const handleAlphaHover = (isHovering: boolean) => {
    setIsAlphaHovered(isHovering);
  };

  const backgroundColor = alpha < 1 ? rgbaValue : hexValue;
  const defaultBackgroundColor = DEFAULT_COLOR;
  const hasValues = Boolean(hexValue && rgbaValue && rgbFloatValue);
  const placeholderStyle = { opacity: hasValues ? 1 : 0.4, cursor: hasValues ? 'pointer' : 'default' };

  return (
    <Card className={styles.outputCard} style={{ backgroundColor: backgroundColor || defaultBackgroundColor }}>
      <Flex direction="column" gap="3">
        <div className={styles.colorInfo}>
          <Flex direction="column" gap="5" justify="between">
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>Hex</Text>
              <Flex direction="row" gap="2" align="center">
                <Flex direction="row" align="center">
                  <CopyableText 
                    text={hexValues.hex6}
                    className={valueClass}
                    size="7"
                    weight="medium"
                    groupId="hex6-group"
                    onGroupHover={handleHex6Hover}
                    style={{ 
                      ...placeholderStyle,
                      opacity: isHex6Hovered || isAlphaHovered ? '0.7' : placeholderStyle.opacity 
                    }}
                    disabled={!hasValues}
                  />
                  {hexValues.alphaHex && (
                    <CopyableText 
                      text={hexValues.hex8}
                      displayText={hexValues.alphaHex}
                      className={valueClass}
                      size="7"
                      weight="medium"
                      style={{ 
                        marginLeft: '4px',
                        opacity: isAlphaHovered ? '0.7' : placeholderStyle.opacity 
                      }}
                      groupId="alpha-group"
                      onGroupHover={handleAlphaHover}
                      disabled={!hasValues}
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGBA</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={rgbaValue || '255, 255, 255, 1'}
                  className={valueClass}
                  size="7"
                  weight="medium"
                  style={placeholderStyle}
                  disabled={!hasValues}
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGB Float</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={formattedRgbFloat || '1.0, 1.0, 1.0, 1.0'}
                  className={valueClass}
                  size="7"
                  weight="medium"
                  style={placeholderStyle}
                  disabled={!hasValues}
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>HSL</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={displayHslValue || 'hsl(0, 0%, 100%)'}
                  className={valueClass}
                  size="7"
                  weight="medium"
                  style={placeholderStyle}
                  disabled={!hasValues}
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>LAB</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={displayLabValue || 'lab(100% 0 0 / 1)'}
                  className={valueClass}
                  size="7"
                  weight="medium"
                  style={placeholderStyle}
                  disabled={!hasValues}
                />
              </Flex>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};

export default ColorOutput; 