import { Card, Text, Flex } from '@radix-ui/themes';
import styles from './ColorOutput.module.css';

interface ColorOutputProps {
  rgbValue: string | null;
  rgbaValue: string | null;
  rgbFloatValue: string | null;
  hexValue: string;
}

const ColorOutput = ({ rgbValue, rgbaValue, rgbFloatValue, hexValue }: ColorOutputProps) => {
  if (!rgbValue || !rgbaValue || !rgbFloatValue) return null;

  return (
    <Card className={styles.outputCard}>
      <Flex direction="column" gap="3">
        <div className={styles.colorPreview} style={{ backgroundColor: hexValue }} />
        <div className={styles.colorInfo}>
          <Text size="3" weight="medium">Hex: {hexValue}</Text>
          <Text size="3" weight="medium">RGB: {rgbValue}</Text>
          <Text size="3" weight="medium">RGBA: {rgbaValue}</Text>
          <Text size="3" weight="medium">RGB Float: {rgbFloatValue}</Text>
        </div>
      </Flex>
    </Card>
  );
};

export default ColorOutput; 