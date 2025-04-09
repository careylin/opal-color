// Extract alpha value from RGBA string
export const extractAlpha = (rgbaString: string): number => {
  const match = rgbaString.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
};

// Calculate brightness based on W3C algorithm
export const calculateBrightness = (hexColor: string): number => {
  // Remove # if present
  const cleanHex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Calculate brightness using W3C algorithm
  return Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
};

// Format RGB float values to a consistent format
export const formatRgbFloat = (rgbFloat: string): string => {
  // Extract the numbers from the rgb() or rgba() format
  const matches = rgbFloat.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!matches) return rgbFloat;
  
  const [, r, g, b, a = "1"] = matches;
  return `rgba(${Number(r).toFixed(4)}, ${Number(g).toFixed(4)}, ${Number(b).toFixed(4)}, ${Number(a).toFixed(4)})`;
};

// Convert alpha value to hex
export const alphaToHex = (alpha: number): string => {
  if (alpha === 1) return '';
  const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hexAlpha;
};

// Get hex with alpha if present
export const getHexWithAlpha = (hexValue: string, alpha: number): { hex6: string, hex8: string | null } => {
  const cleanHex = hexValue.replace('#', '');
  const hex6 = `#${cleanHex}`;
  
  if (alpha === 1) {
    return { hex6, hex8: null };
  }
  
  const hexAlpha = alphaToHex(alpha);
  const hex8 = `#${cleanHex}${hexAlpha}`;
  
  return { hex6, hex8 };
};

// Convert Hex to HSL
export const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  // Convert to degrees, percentage, percentage
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Format HSL values to a consistent format
export const formatHSL = (h: number, s: number, l: number, alpha: number = 1): string => {
  if (alpha === 1) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return `hsla(${h}, ${s}%, ${l}%, ${alpha.toFixed(4)})`;
};

// Convert RGB to HSL
export const rgbToHSL = (r: number, g: number, b: number): { h: number, s: number, l: number } => {
  // Normalize RGB values to 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  // Convert to degrees, percentage, percentage
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Convert RGB Float to HSL
export const rgbFloatToHSL = (r: number, g: number, b: number): { h: number, s: number, l: number } => {
  // RGB float values are already normalized to 0-1
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  // Convert to degrees, percentage, percentage
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}; 