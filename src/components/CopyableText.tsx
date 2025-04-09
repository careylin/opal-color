import { Text } from '@radix-ui/themes';
import { useState } from 'react';

interface CopyableTextProps {
  text: string;
  className?: string;
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  style?: React.CSSProperties;
  groupId?: string;
  onGroupHover?: (isHovering: boolean) => void;
}

const CopyableText = ({ 
  text, 
  className, 
  size = '7', 
  weight = 'medium',
  style = {},
  groupId,
  onGroupHover
}: CopyableTextProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '0.7';
    if (onGroupHover) {
      onGroupHover(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    if (onGroupHover) {
      onGroupHover(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Text 
        className={className} 
        size={size} 
        weight={weight} 
        style={{ 
          cursor: 'pointer',
          ...style
        }}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-group-id={groupId}
      >
        {text}
      </Text>
      {copied && (
        <Text size="1" color="green" style={{ position: 'absolute', top: '-20px', right: '0' }}>
          Copied
        </Text>
      )}
    </div>
  );
};

export default CopyableText; 