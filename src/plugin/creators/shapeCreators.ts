/**
 * Shape creation functions for Figma plugin
 */

import { createSolidPaint } from "../utils/colorUtils";
import { selectAndFocusNodes } from "../utils/nodeUtils";

/**
 * Create a rectangle from data
 * @param data Rectangle configuration data
 * @returns Created rectangle node
 */
export function createRectangleFromData(data: any): RectangleNode {
  const rect = figma.createRectangle();

  // Size
  rect.resize(data.width || 100, data.height || 100);

  // Fill
  if (data.fills) {
    rect.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      // Handle hex color
      rect.fills = [createSolidPaint(data.fill)];
    } else {
      // Handle fill object
      rect.fills = [data.fill];
    }
  }

  // Stroke
  if (data.strokes) rect.strokes = data.strokes;
  if (data.strokeWeight !== undefined) rect.strokeWeight = data.strokeWeight;
  if (data.strokeAlign) rect.strokeAlign = data.strokeAlign;
  if (data.strokeCap) rect.strokeCap = data.strokeCap;
  if (data.strokeJoin) rect.strokeJoin = data.strokeJoin;
  if (data.dashPattern) rect.dashPattern = data.dashPattern;

  // Corner radius
  if (data.cornerRadius !== undefined) rect.cornerRadius = data.cornerRadius;
  if (data.topLeftRadius !== undefined) rect.topLeftRadius = data.topLeftRadius;
  if (data.topRightRadius !== undefined)
    rect.topRightRadius = data.topRightRadius;
  if (data.bottomLeftRadius !== undefined)
    rect.bottomLeftRadius = data.bottomLeftRadius;
  if (data.bottomRightRadius !== undefined)
    rect.bottomRightRadius = data.bottomRightRadius;

  return rect;
}

/**
 * Create a simple rectangle
 * Convenient function for basic rectangle creation
 *
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Width of rectangle
 * @param height Height of rectangle
 * @param color Fill color as hex string
 * @returns Created rectangle node
 */
export function createRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): RectangleNode {
  // Use the new data-driven function
  const rect = createRectangleFromData({
    width,
    height,
    fill: color,
  });

  // Set position
  rect.x = x;
  rect.y = y;

  // Select and focus
  selectAndFocusNodes(rect);

  return rect;
}

/**
 * Create an ellipse/circle from data
 * @param data Ellipse configuration data
 * @returns Created ellipse node
 */
export function createEllipseFromData(data: any): EllipseNode {
  const ellipse = figma.createEllipse();

  // Size
  ellipse.resize(data.width || 100, data.height || 100);

  // Fill
  if (data.fills) {
    ellipse.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      // Handle hex color
      ellipse.fills = [createSolidPaint(data.fill)];
    } else {
      // Handle fill object
      ellipse.fills = [data.fill];
    }
  }

  // Stroke
  if (data.strokes) ellipse.strokes = data.strokes;
  if (data.strokeWeight !== undefined) ellipse.strokeWeight = data.strokeWeight;
  if (data.strokeAlign) ellipse.strokeAlign = data.strokeAlign;
  if (data.strokeCap) ellipse.strokeCap = data.strokeCap;
  if (data.strokeJoin) ellipse.strokeJoin = data.strokeJoin;
  if (data.dashPattern) ellipse.dashPattern = data.dashPattern;

  return ellipse;
}

/**
 * Create a simple circle or ellipse
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Width of ellipse
 * @param height Height of ellipse
 * @param color Fill color as hex string
 * @returns Created ellipse node
 */
export function createCircle(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): EllipseNode {
  // Use the data-driven function
  const ellipse = createEllipseFromData({
    width,
    height,
    fill: color,
  });

  // Set position
  ellipse.x = x;
  ellipse.y = y;

  // Select and focus
  selectAndFocusNodes(ellipse);

  return ellipse;
}

/**
 * Create a polygon from data
 * @param data Polygon configuration data
 * @returns Created polygon node
 */
export function createPolygonFromData(data: any): PolygonNode {
  const polygon = figma.createPolygon();
  polygon.resize(data.width || 100, data.height || 100);

  // Set number of sides
  if (data.pointCount) polygon.pointCount = data.pointCount;

  // Fill
  if (data.fills) {
    polygon.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      polygon.fills = [createSolidPaint(data.fill)];
    } else {
      polygon.fills = [data.fill];
    }
  }

  return polygon;
}

/**
 * Create a star from data
 * @param data Star configuration data
 * @returns Created star node
 */
export function createStarFromData(data: any): StarNode {
  const star = figma.createStar();
  star.resize(data.width || 100, data.height || 100);

  // Star specific properties
  if (data.pointCount) star.pointCount = data.pointCount;
  if (data.innerRadius) star.innerRadius = data.innerRadius;

  // Fill
  if (data.fills) {
    star.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      star.fills = [createSolidPaint(data.fill)];
    } else {
      star.fills = [data.fill];
    }
  }

  return star;
}

/**
 * Create a line from data
 * @param data Line configuration data
 * @returns Created line node
 */
export function createLineFromData(data: any): LineNode {
  const line = figma.createLine();
  
  // Set line length (width)
  line.resize(data.width || 100, 0); // Line height is always 0
  
  // Set rotation if provided
  if (data.rotation !== undefined) line.rotation = data.rotation;

  // Stroke properties
  if (data.strokeWeight) line.strokeWeight = data.strokeWeight;
  if (data.strokeAlign) line.strokeAlign = data.strokeAlign;
  if (data.strokeCap) line.strokeCap = data.strokeCap;
  if (data.strokeJoin) line.strokeJoin = data.strokeJoin;
  if (data.dashPattern) line.dashPattern = data.dashPattern;

  // Stroke color
  if (data.strokes) {
    line.strokes = data.strokes;
  } else if (data.stroke) {
    if (typeof data.stroke === "string") {
      line.strokes = [createSolidPaint(data.stroke)];
    } else {
      line.strokes = [data.stroke];
    }
  } else if (data.color) {
    // For consistency with other shape creation functions
    line.strokes = [createSolidPaint(data.color)];
  }

  return line;
}

/**
 * Create a simple line
 * @param x X coordinate
 * @param y Y coordinate
 * @param length Length of the line (width)
 * @param color Stroke color as hex string
 * @param rotation Rotation in degrees
 * @param strokeWeight Stroke thickness
 * @returns Created line node
 */
export function createLine(
  x: number,
  y: number,
  length: number,
  color: string,
  rotation: number = 0,
  strokeWeight: number = 1
): LineNode {
  // Use the data-driven function
  const line = createLineFromData({
    width: length,
    stroke: color,
    strokeWeight: strokeWeight,
    rotation: rotation
  });

  // Set position
  line.x = x;
  line.y = y;

  // Select and focus
  selectAndFocusNodes(line);

  return line;
}

/**
 * Create a vector from data
 * @param data Vector configuration data
 * @returns Created vector node
 */
export function createVectorFromData(data: any): VectorNode {
  const vector = figma.createVector();
  vector.resize(data.width || 100, data.height || 100);

  // More complex vector operations would go here

  return vector;
}
