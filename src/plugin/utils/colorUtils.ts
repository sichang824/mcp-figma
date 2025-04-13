/**
 * Color utility functions for Figma plugin
 */

/**
 * Convert hex color to RGB object
 * @param hex Hexadecimal color string (with or without #)
 * @returns RGB object with values between 0 and 1
 */
export function hexToRgb(hex: string): RGB {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/**
 * Convert RGB object to hex color string
 * @param rgb RGB object with values between 0 and 1
 * @returns Hexadecimal color string with #
 */
export function rgbToHex(rgb: RGB): string {
  const r = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Create a solid color paint
 * @param color RGB color object or hex string
 * @returns Solid paint object
 */
export function createSolidPaint(color: RGB | string): SolidPaint {
  if (typeof color === 'string') {
    return { type: 'SOLID', color: hexToRgb(color) };
  }
  return { type: 'SOLID', color };
} 