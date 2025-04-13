/**
 * Text element creation functions for Figma plugin
 */

import { createSolidPaint } from '../utils/colorUtils';
import { applyCommonProperties, selectAndFocusNodes } from '../utils/nodeUtils';

/**
 * Create a text node from data
 * @param data Text configuration data
 * @returns Created text node
 */
export async function createTextFromData(data: any): Promise<TextNode> {
  const text = figma.createText();
  
  // Load font - default to Inter if not specified
  const fontFamily = data.fontFamily || "Inter";
  const fontStyle = data.fontStyle || "Regular";
  
  // Load the font before setting text
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily} ${fontStyle}. Falling back to Inter Regular.`);
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }
  
  // Set basic text content
  text.characters = data.text || data.characters || "Text";
  
  // Text size and dimensions
  if (data.fontSize) text.fontSize = data.fontSize;
  if (data.width) text.resize(data.width, text.height);
  
  // Text styling
  if (data.fontName) text.fontName = data.fontName;
  if (data.textAlignHorizontal) text.textAlignHorizontal = data.textAlignHorizontal;
  if (data.textAlignVertical) text.textAlignVertical = data.textAlignVertical;
  if (data.textAutoResize) text.textAutoResize = data.textAutoResize;
  if (data.paragraphIndent) text.paragraphIndent = data.paragraphIndent;
  if (data.paragraphSpacing) text.paragraphSpacing = data.paragraphSpacing;
  if (data.letterSpacing) text.letterSpacing = data.letterSpacing;
  if (data.lineHeight) text.lineHeight = data.lineHeight;
  if (data.textCase) text.textCase = data.textCase;
  if (data.textDecoration) text.textDecoration = data.textDecoration;
  
  // Text fill
  if (data.fills) {
    text.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === 'string') {
      text.fills = [createSolidPaint(data.fill)];
    } else {
      text.fills = [data.fill];
    }
  }
  
  // Text hyperlink
  if (data.hyperlink) {
    text.hyperlink = data.hyperlink;
  }
  
  return text;
}

/**
 * Create a simple text node with basic properties
 * @param x X coordinate
 * @param y Y coordinate
 * @param content Text content
 * @param fontSize Font size
 * @returns Created text node
 */
export async function createText(x: number, y: number, content: string, fontSize: number): Promise<TextNode> {
  // Use the data-driven function
  const text = await createTextFromData({
    text: content,
    fontSize
  });
  
  // Set position
  text.x = x;
  text.y = y;
  
  // Select and focus
  selectAndFocusNodes(text);
  
  return text;
}

/**
 * Apply character-level styling to text ranges in a text node
 * @param textNode Text node to style
 * @param ranges Array of range objects with start, end, and style properties
 */
export function applyTextRangeStyles(textNode: TextNode, ranges: Array<{start: number, end: number, style: any}>): void {
  for (const range of ranges) {
    // Apply individual style properties to the range
    for (const [property, value] of Object.entries(range.style)) {
      if (property === 'fills') {
        textNode.setRangeFills(range.start, range.end, value as Paint[]);
      } else if (property === 'fillStyleId') {
        textNode.setRangeFillStyleId(range.start, range.end, value as string);
      } else if (property === 'fontName') {
        textNode.setRangeFontName(range.start, range.end, value as FontName);
      } else if (property === 'fontSize') {
        textNode.setRangeFontSize(range.start, range.end, value as number);
      } else if (property === 'textCase') {
        textNode.setRangeTextCase(range.start, range.end, value as TextCase);
      } else if (property === 'textDecoration') {
        textNode.setRangeTextDecoration(range.start, range.end, value as TextDecoration);
      } else if (property === 'letterSpacing') {
        textNode.setRangeLetterSpacing(range.start, range.end, value as LetterSpacing);
      } else if (property === 'lineHeight') {
        textNode.setRangeLineHeight(range.start, range.end, value as LineHeight);
      } else if (property === 'hyperlink') {
        textNode.setRangeHyperlink(range.start, range.end, value as HyperlinkTarget);
      } else if (property === 'textStyleId') {
        textNode.setRangeTextStyleId(range.start, range.end, value as string);
      } else if (property === 'indentation') {
        textNode.setRangeIndentation(range.start, range.end, value as number);
      }
    }
  }
} 