import { useState } from 'react';

interface UseClipboardOptions {
  resetDelay?: number;
}

const useClipboard = (options: UseClipboardOptions = {}) => {
  const { resetDelay = 2000 } = options;
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopiedValue(type);
        // Reset the copied state after the specified delay
        setTimeout(() => {
          setCopiedValue(null);
        }, resetDelay);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return {
    copiedValue,
    copyToClipboard
  };
};

export default useClipboard; 