/**
 * Special element creation functions for Figma plugin
 * Handles more specialized node types like boolean operations, connectors, etc.
 */

import { createSolidPaint } from '../utils/colorUtils';
import { applyCommonProperties } from '../utils/nodeUtils';

/**
 * Create a boolean operation from data
 * @param data Boolean operation configuration data
 * @returns Created boolean operation node
 */
export function createBooleanOperationFromData(data: any): BooleanOperationNode | null {
  // Boolean operations require child nodes
  if (!data.children || !Array.isArray(data.children) || data.children.length < 2) {
    console.error('Boolean operation requires at least 2 child nodes');
    return null;
  }

  // First we need to create the child nodes and ensure they're on the page
  let childNodes: SceneNode[] = [];
  try {
    for (const childData of data.children) {
      const node = figma.createRectangle(); // Placeholder, would need actual createElement logic here
      // In actual use, you'll need to create the proper node type and apply properties
      childNodes.push(node);
    }

    // Now create the boolean operation with the child nodes
    const booleanOperation = figma.createBooleanOperation();
    
    // Set the operation type
    if (data.booleanOperation) {
      booleanOperation.booleanOperation = data.booleanOperation;
    }
    
    // Apply common properties
    applyCommonProperties(booleanOperation, data);
    
    return booleanOperation;
  } catch (error) {
    console.error('Failed to create boolean operation:', error);
    // Clean up any created nodes to avoid leaving orphans
    childNodes.forEach(node => node.remove());
    return null;
  }
}

/**
 * Create a connector node from data
 * @param data Connector configuration data
 * @returns Created connector node
 */
export function createConnectorFromData(data: any): ConnectorNode {
  const connector = figma.createConnector();
  
  // Set connector specific properties
  if (data.connectorStart) connector.connectorStart = data.connectorStart;
  if (data.connectorEnd) connector.connectorEnd = data.connectorEnd;
  if (data.connectorStartStrokeCap) connector.connectorStartStrokeCap = data.connectorStartStrokeCap;
  if (data.connectorEndStrokeCap) connector.connectorEndStrokeCap = data.connectorEndStrokeCap;
  if (data.connectorLineType) connector.connectorLineType = data.connectorLineType;
  
  // Set stroke properties
  if (data.strokes) connector.strokes = data.strokes;
  if (data.strokeWeight) connector.strokeWeight = data.strokeWeight;
  
  // Apply common properties
  applyCommonProperties(connector, data);
  
  return connector;
}

/**
 * Create a shape with text node (used in FigJam)
 * This function might not work in all Figma versions
 * 
 * @param data Shape with text configuration data
 * @returns Created shape with text node
 */
export function createShapeWithTextFromData(data: any): ShapeWithTextNode | null {
  // Check if this node type is supported
  if (!('createShapeWithText' in figma)) {
    console.error('ShapeWithText creation is not supported in this Figma version');
    return null;
  }
  
  try {
    const shapeWithText = figma.createShapeWithText();
    
    // Set shape specific properties
    if (data.shapeType) shapeWithText.shapeType = data.shapeType;
    
    // Text content
    if (data.text || data.characters) {
      shapeWithText.text.characters = data.text || data.characters;
    }
    
    // Text styling - these properties may not be directly accessible on all versions
    try {
      if (data.fontSize) shapeWithText.text.fontSize = data.fontSize;
      if (data.fontName) shapeWithText.text.fontName = data.fontName;
      // These properties may not exist directly on TextSublayerNode depending on Figma version
      if (data.textAlignHorizontal && 'textAlignHorizontal' in shapeWithText.text) {
        (shapeWithText.text as any).textAlignHorizontal = data.textAlignHorizontal;
      }
      if (data.textAlignVertical && 'textAlignVertical' in shapeWithText.text) {
        (shapeWithText.text as any).textAlignVertical = data.textAlignVertical;
      }
    } catch (e) {
      console.warn('Some text properties could not be set on ShapeWithText:', e);
    }
    
    // Fill and stroke
    if (data.fills) shapeWithText.fills = data.fills;
    if (data.strokes) shapeWithText.strokes = data.strokes;
    
    // Apply common properties
    applyCommonProperties(shapeWithText, data);
    
    return shapeWithText;
  } catch (error) {
    console.error('Failed to create shape with text:', error);
    return null;
  }
}

/**
 * Create a code block node
 * @param data Code block configuration data
 * @returns Created code block node
 */
export function createCodeBlockFromData(data: any): CodeBlockNode {
  const codeBlock = figma.createCodeBlock();
  
  // Code content
  if (data.code) codeBlock.code = data.code;
  if (data.codeLanguage) codeBlock.codeLanguage = data.codeLanguage;
  
  // Apply common properties
  applyCommonProperties(codeBlock, data);
  
  return codeBlock;
}

/**
 * Create a table node
 * @param data Table configuration data
 * @returns Created table node
 */
export function createTableFromData(data: any): TableNode {
  // Create table with specified rows and columns (defaults to 2x2)
  const table = figma.createTable(
    data.numRows || 2,
    data.numColumns || 2
  );
  
  // Applying table styling
  // Note: Some properties may not be directly available depending on Figma version
  if (data.fills && 'fills' in table) {
    (table as any).fills = data.fills;
  }
  
  // Process cell data if provided
  if (data.cells && Array.isArray(data.cells)) {
    for (const cellData of data.cells) {
      if (cellData.rowIndex !== undefined && cellData.columnIndex !== undefined) {
        try {
          // Different Figma versions may have different API for accessing cells
          let cell;
          if ('cellAt' in table) {
            cell = table.cellAt(cellData.rowIndex, cellData.columnIndex);
          } else if ('getCellAt' in table) {
            cell = (table as any).getCellAt(cellData.rowIndex, cellData.columnIndex);
          }
          
          if (cell) {
            // Apply cell properties
            if (cellData.text && cell.text) cell.text.characters = cellData.text;
            if (cellData.fills && 'fills' in cell) cell.fills = cellData.fills;
            if (cellData.rowSpan && 'rowSpan' in cell) cell.rowSpan = cellData.rowSpan;
            if (cellData.columnSpan && 'columnSpan' in cell) cell.columnSpan = cellData.columnSpan;
          }
        } catch (e) {
          console.warn(`Could not set properties for cell at ${cellData.rowIndex}, ${cellData.columnIndex}:`, e);
        }
      }
    }
  }
  
  // Apply common properties
  applyCommonProperties(table, data);
  
  return table;
}

/**
 * Create a widget node (if supported in current Figma version)
 * @param data Widget configuration data
 * @returns Created widget node or null
 */
export function createWidgetFromData(data: any): WidgetNode | null {
  // Check if widget creation is supported
  if (!('createWidget' in figma)) {
    console.error('Widget creation is not supported in this Figma version');
    return null;
  }
  
  // Widgets require a package ID
  if (!data.widgetId) {
    console.error('Widget creation requires a widgetId');
    return null;
  }
  
  try {
    // Using type assertion since createWidget may not be recognized by TypeScript
    const widget = (figma as any).createWidget(data.widgetId);
    
    // Set widget properties
    if (data.widgetData) widget.widgetData = JSON.stringify(data.widgetData);
    if (data.width && data.height && 'resize' in widget) widget.resize(data.width, data.height);
    
    // Apply common properties
    applyCommonProperties(widget, data);
    
    return widget;
  } catch (error) {
    console.error('Failed to create widget:', error);
    return null;
  }
}

/**
 * Create a media node (if supported in current Figma version)
 * @param data Media configuration data
 * @returns Created media node or null
 */
export function createMediaFromData(data: any): MediaNode | null {
  // Check if media creation is supported
  if (!('createMedia' in figma)) {
    console.error('Media creation is not supported in this Figma version');
    return null;
  }
  
  // Media requires a hash
  if (!data.hash) {
    console.error('Media creation requires a valid media hash');
    return null;
  }
  
  try {
    // Using type assertion since createMedia may not be recognized by TypeScript
    const media = (figma as any).createMedia(data.hash);
    
    // Apply common properties
    applyCommonProperties(media, data);
    
    return media;
  } catch (error) {
    console.error('Failed to create media:', error);
    return null;
  }
} 