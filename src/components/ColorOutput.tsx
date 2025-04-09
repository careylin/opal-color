import { Card, Text, Flex } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import styles from './ColorOutput.module.css';
import { 
  extractAlpha, 
  calculateBrightness, 
  formatRgbFloat, 
  getHexWithAlpha,
  hexToHSL,
  formatHSL
} from '../utils/colorUtils';
import CopyableText from './CopyableText';

interface ColorOutputProps {
  rgbaValue: string | null;
  rgbFloatValue: string | null;
  hexValue: string;
  hslValue?: string | null;
}

const DEFAULT_COLOR = '#ececec';

const ColorOutput = ({ 
  rgbaValue, 
  rgbFloatValue, 
  hexValue = DEFAULT_COLOR, 
  hslValue 
}: ColorOutputProps) => {
  // Memoize all calculations to prevent unnecessary recalculations
  const formattedRgbFloat = useMemo(() => 
    rgbFloatValue ? formatRgbFloat(rgbFloatValue) : null, 
    [rgbFloatValue]
  );

  const brightness = useMemo(() => 
    hexValue ? calculateBrightness(hexValue) : 255, 
    [hexValue]
  );

  const isDark = useMemo(() => 
    brightness < 128, 
    [brightness]
  );

  const alpha = useMemo(() => 
    rgbaValue ? extractAlpha(rgbaValue) : 1, 
    [rgbaValue]
  );

  const { hex6, hex8 } = useMemo(() => 
    hexValue ? getHexWithAlpha(hexValue, alpha) : { hex6: DEFAULT_COLOR, hex8: null }, 
    [hexValue, alpha]
  );
  
  // Calculate HSL values if not provided
  const calculatedHsl = useMemo(() => 
    hexValue ? hexToHSL(hexValue) : { h: 0, s: 0, l: 100 }, 
    [hexValue]
  );
  
  const calculatedHslValue = useMemo(() => 
    formatHSL(calculatedHsl.h, calculatedHsl.s, calculatedHsl.l, alpha), 
    [calculatedHsl, alpha]
  );
  
  // Use provided HSL value or calculated one
  const displayHslValue = hslValue || calculatedHslValue;
  
  const labelClass = isDark ? styles['label-dark'] : styles['label-light'];
  const valueClass = isDark ? styles['value-dark'] : styles['value-light'];
  
  // State to track if the alpha part is being hovered
  const [isAlphaHovered, setIsAlphaHovered] = useState(false);

  // Handle group hover for hex parts
  const handleHexGroupHover = (isHovering: boolean) => {
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
                    text={hexValue || DEFAULT_COLOR}
                    className={valueClass}
                    size="7"
                    weight="medium"
                    groupId="hex-group"
                    onGroupHover={handleHexGroupHover}
                    style={{ 
                      ...placeholderStyle,
                      opacity: isAlphaHovered ? '0.7' : placeholderStyle.opacity 
                    }}
                    disabled={!hasValues}
                  />
                  {hex8 && (
                    <CopyableText 
                      text={hex8.substring(7)}
                      className={valueClass}
                      size="7"
                      weight="medium"
                      style={{ 
                        marginLeft: '4px',
                        opacity: isAlphaHovered ? '0.7' : placeholderStyle.opacity 
                      }}
                      groupId="hex-group"
                      onGroupHover={handleHexGroupHover}
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
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};

export default ColorOutput; 