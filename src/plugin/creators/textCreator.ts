/**
 * Text element creation functions for Figma plugin
 */

import { createSolidPaint } from '../utils/colorUtils';
import { selectAndFocusNodes } from '../utils/nodeUtils';

/**
 * Create a text node from data
 * @param data Text configuration data
 * @returns Created text node
 */
export async function createTextFromData(data: any): Promise<TextNode> {
  const text = figma.createText();
  
  // Load font - default to Inter if not specified
  const fontFamily = data.fontFamily || (data.fontName.family) || "Inter";
  const fontStyle = data.fontStyle || (data.fontName.style) || "Regular";
  
  // Load the font before setting text
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily} ${fontStyle}. Falling back to Inter Regular.`);
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }
  
  // Set basic text content
  text.characters = data.text || data.characters || "Text";
  
  // Position and size
  if (data.x !== undefined) text.x = data.x;
  if (data.y !== undefined) text.y = data.y;
  
  // Text size and dimensions
  if (data.fontSize) text.fontSize = data.fontSize;
  if (data.width) text.resize(data.width, text.height);
  
  // Text style and alignment
  if (data.fontName) text.fontName = data.fontName;
  if (data.textAlignHorizontal) text.textAlignHorizontal = data.textAlignHorizontal;
  if (data.textAlignVertical) text.textAlignVertical = data.textAlignVertical;
  if (data.textAutoResize) text.textAutoResize = data.textAutoResize;
  if (data.textTruncation) text.textTruncation = data.textTruncation;
  if (data.maxLines !== undefined) text.maxLines = data.maxLines;
  
  // Paragraph styling
  if (data.paragraphIndent) text.paragraphIndent = data.paragraphIndent;
  if (data.paragraphSpacing) text.paragraphSpacing = data.paragraphSpacing;
  if (data.listSpacing) text.listSpacing = data.listSpacing;
  if (data.hangingPunctuation !== undefined) text.hangingPunctuation = data.hangingPunctuation;
  if (data.hangingList !== undefined) text.hangingList = data.hangingList;
  if (data.autoRename !== undefined) text.autoRename = data.autoRename;
  
  // Text styling
  if (data.letterSpacing) text.letterSpacing = data.letterSpacing;
  if (data.lineHeight) text.lineHeight = data.lineHeight;
  if (data.leadingTrim) text.leadingTrim = data.leadingTrim;
  if (data.textCase) text.textCase = data.textCase;
  if (data.textDecoration) text.textDecoration = data.textDecoration;
  if (data.textStyleId) text.textStyleId = data.textStyleId;
  
  // Text decoration details
  if (data.textDecorationStyle) text.textDecorationStyle = data.textDecorationStyle;
  if (data.textDecorationOffset) text.textDecorationOffset = data.textDecorationOffset;
  if (data.textDecorationThickness) text.textDecorationThickness = data.textDecorationThickness;
  if (data.textDecorationColor) text.textDecorationColor = data.textDecorationColor;
  if (data.textDecorationSkipInk !== undefined) text.textDecorationSkipInk = data.textDecorationSkipInk;
  
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
  
  // Layout properties
  if (data.layoutAlign) text.layoutAlign = data.layoutAlign;
  if (data.layoutGrow !== undefined) text.layoutGrow = data.layoutGrow;
  if (data.layoutSizingHorizontal) text.layoutSizingHorizontal = data.layoutSizingHorizontal;
  if (data.layoutSizingVertical) text.layoutSizingVertical = data.layoutSizingVertical;
  
  // Apply text range styles if provided
  if (data.rangeStyles && Array.isArray(data.rangeStyles)) {
    applyTextRangeStyles(text, data.rangeStyles);
  }
  
  // Apply common base properties
  if (data.name) text.name = data.name;
  if (data.visible !== undefined) text.visible = data.visible;
  if (data.locked !== undefined) text.locked = data.locked;
  if (data.opacity !== undefined) text.opacity = data.opacity;
  if (data.blendMode) text.blendMode = data.blendMode;
  if (data.effects) text.effects = data.effects;
  if (data.effectStyleId) text.effectStyleId = data.effectStyleId;
  if (data.exportSettings) text.exportSettings = data.exportSettings;
  if (data.constraints) text.constraints = data.constraints;
  
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
    fontSize,
    x,
    y
  });
  
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
      } else if (property === 'textDecorationStyle') {
        textNode.setRangeTextDecorationStyle(range.start, range.end, value as TextDecorationStyle);
      } else if (property === 'textDecorationOffset') {
        textNode.setRangeTextDecorationOffset(range.start, range.end, value as TextDecorationOffset);
      } else if (property === 'textDecorationThickness') {
        textNode.setRangeTextDecorationThickness(range.start, range.end, value as TextDecorationThickness);
      } else if (property === 'textDecorationColor') {
        textNode.setRangeTextDecorationColor(range.start, range.end, value as TextDecorationColor);
      } else if (property === 'textDecorationSkipInk') {
        textNode.setRangeTextDecorationSkipInk(range.start, range.end, value as boolean);
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
      } else if (property === 'paragraphIndent') {
        textNode.setRangeParagraphIndent(range.start, range.end, value as number);
      } else if (property === 'paragraphSpacing') {
        textNode.setRangeParagraphSpacing(range.start, range.end, value as number);
      } else if (property === 'listOptions') {
        textNode.setRangeListOptions(range.start, range.end, value as TextListOptions);
      } else if (property === 'listSpacing') {
        textNode.setRangeListSpacing(range.start, range.end, value as number);
      }
    }
  }
} 