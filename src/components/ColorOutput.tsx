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

const ColorOutput = ({ rgbaValue, rgbFloatValue, hexValue, hslValue }: ColorOutputProps) => {
  if (!rgbaValue || !rgbFloatValue) return null;

  // Memoize all calculations to prevent unnecessary recalculations
  const formattedRgbFloat = useMemo(() => 
    formatRgbFloat(rgbFloatValue), 
    [rgbFloatValue]
  );

  const brightness = useMemo(() => 
    calculateBrightness(hexValue), 
    [hexValue]
  );

  const isDark = useMemo(() => 
    brightness < 128, 
    [brightness]
  );

  const alpha = useMemo(() => 
    extractAlpha(rgbaValue), 
    [rgbaValue]
  );

  const { hex6, hex8 } = useMemo(() => 
    getHexWithAlpha(hexValue, alpha), 
    [hexValue, alpha]
  );
  
  // Calculate HSL values if not provided
  const calculatedHsl = useMemo(() => 
    hexToHSL(hexValue), 
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

  return (
    <Card className={styles.outputCard} style={{ backgroundColor: alpha < 1 ? rgbaValue : hexValue }}>
      <Flex direction="column" gap="3">
        <div className={styles.colorInfo}>
          <Flex direction="column" gap="5" justify="between">
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>Hex</Text>
              <Flex direction="row" gap="2" align="center">
                <Flex direction="row" align="center">
                  <CopyableText 
                    text={hex6}
                    className={valueClass}
                    size="7"
                    weight="medium"
                    groupId="hex-group"
                    onGroupHover={handleHexGroupHover}
                    style={{ opacity: isAlphaHovered ? '0.7' : '1' }}
                  />
                  {hex8 && (
                    <CopyableText 
                      text={hex8.substring(7)}
                      className={valueClass}
                      size="7"
                      weight="medium"
                      style={{ marginLeft: '4px' }}
                      groupId="hex-group"
                      onGroupHover={handleHexGroupHover}
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGBA</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={rgbaValue}
                  className={valueClass}
                  size="7"
                  weight="medium"
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>RGB Float</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={formattedRgbFloat}
                  className={valueClass}
                  size="7"
                  weight="medium"
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap="1" justify="start">
              <Text size="2" className={labelClass}>HSL</Text>
              <Flex direction="row" gap="2" align="center">
                <CopyableText 
                  text={displayHslValue}
                  className={valueClass}
                  size="7"
                  weight="medium"
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