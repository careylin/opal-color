// Format a float value with 3 decimal places, no decimals for whole numbers
export const formatFloatValue = (value: number): string => {
  // Check if the value is a whole number (integer)
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(3);
};

// Format RGB float values to a consistent format
export const formatRgbFloat = (rgbFloat: string): string => {
  // Extract the numbers from the rgb() or rgba() format
  const matches = rgbFloat.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!matches) return rgbFloat;
  
  const [, r, g, b, a = "1"] = matches;
  return `rgba(${formatFloatValue(Number(r))}, ${formatFloatValue(Number(g))}, ${formatFloatValue(Number(b))}, ${formatFloatValue(Number(a))})`;
};

// Convert alpha value to hex
export const alphaToHex = (alpha: number): string => {
  if (alpha === 1) return '';
  const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hexAlpha;
}; 