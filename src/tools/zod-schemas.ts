/**
 * Figma Zod Schemas
 * Zod schemas for validating Figma API parameters
 */

import { z } from "zod";

// Base types
export const colorSchema = z.object({
  r: z.number().min(0).max(1).describe("Red channel (0-1)"),
  g: z.number().min(0).max(1).describe("Green channel (0-1)"),
  b: z.number().min(0).max(1).describe("Blue channel (0-1)"),
});

// Position and size base params
const positionParams = {
  x: z.number().default(0).describe("X position of the element"),
  y: z.number().default(0).describe("Y position of the element"),
};

const sizeParams = {
  width: z.number().min(1).default(100).describe("Width of the element in pixels"),
  height: z.number().min(1).default(100).describe("Height of the element in pixels"),
};

// Base node properties
const baseNodeParams = {
  name: z.string().optional().describe("Name of the node"),
};

// Scene node properties
const sceneNodeParams = {
  visible: z.boolean().optional().describe("Whether the node is visible"),
  locked: z.boolean().optional().describe("Whether the node is locked"),
};

// Blend-related properties
const blendParams = {
  opacity: z.number().min(0).max(1).optional().describe("Opacity of the node (0-1)"),
  blendMode: z.enum([
    "NORMAL", "DARKEN", "MULTIPLY", "LINEAR_BURN", "COLOR_BURN", 
    "LIGHTEN", "SCREEN", "LINEAR_DODGE", "COLOR_DODGE", 
    "OVERLAY", "SOFT_LIGHT", "HARD_LIGHT", 
    "DIFFERENCE", "EXCLUSION", "SUBTRACT", "DIVIDE", 
    "HUE", "SATURATION", "COLOR", "LUMINOSITY",
    "PASS_THROUGH"
  ]).optional().describe("Blend mode of the node"),
  isMask: z.boolean().optional().describe("Whether this node is a mask"),
  maskType: z.enum(["ALPHA", "LUMINANCE"]).optional().describe("Type of masking to use if this node is a mask"),
  effects: z.array(z.any()).optional().describe("Array of effects"),
  effectStyleId: z.string().optional().describe("The id of the EffectStyle object"),
};

// Corner-related properties
const cornerParams = {
  cornerRadius: z.number().min(0).optional().describe("Rounds all corners by this amount"),
  cornerSmoothing: z.number().min(0).max(1).optional().describe("Corner smoothing between 0 and 1"),
  topLeftRadius: z.number().min(0).optional().describe("Top left corner radius override"),
  topRightRadius: z.number().min(0).optional().describe("Top right corner radius override"),
  bottomLeftRadius: z.number().min(0).optional().describe("Bottom left corner radius override"),
  bottomRightRadius: z.number().min(0).optional().describe("Bottom right corner radius override"),
};

// Geometry-related properties
const geometryParams = {
  fills: z.array(z.any()).optional().describe("The paints used to fill the area of the shape"),
  fillStyleId: z.string().optional().describe("The id of the PaintStyle object linked to fills"),
  strokes: z.array(z.any()).optional().describe("The paints used to fill the area of the shape's strokes"),
  strokeStyleId: z.string().optional().describe("The id of the PaintStyle object linked to strokes"),
  strokeWeight: z.number().min(0).optional().describe("The thickness of the stroke, in pixels"),
  strokeJoin: z.enum(["MITER", "BEVEL", "ROUND"]).optional().describe("The decoration applied to vertices"),
  strokeAlign: z.enum(["CENTER", "INSIDE", "OUTSIDE"]).optional().describe("The alignment of the stroke"),
  dashPattern: z.array(z.number().min(0)).optional().describe("Array of numbers for dash pattern"),
  strokeCap: z.enum(["NONE", "ROUND", "SQUARE", "ARROW_LINES", "ARROW_EQUILATERAL"]).optional().describe("The decoration applied to vertices"),
  strokeMiterLimit: z.number().min(0).optional().describe("The miter limit on the stroke"),
  color: z.string().regex(/^#([0-9A-F]{6}|[0-9A-F]{8})$/i).default("#ff0000").describe("Fill color as hex code (#RRGGBB or #RRGGBBAA)"),
};

// Individual strokes-related properties
const rectangleStrokeParams = {
  strokeTopWeight: z.number().min(0).optional().describe("Top stroke weight"),
  strokeBottomWeight: z.number().min(0).optional().describe("Bottom stroke weight"),
  strokeLeftWeight: z.number().min(0).optional().describe("Left stroke weight"),
  strokeRightWeight: z.number().min(0).optional().describe("Right stroke weight"),
};

// Layout-related properties
const layoutParams = {
  minWidth: z.number().nullable().optional().describe("Minimum width constraint"),
  maxWidth: z.number().nullable().optional().describe("Maximum width constraint"),
  minHeight: z.number().nullable().optional().describe("Minimum height constraint"),
  maxHeight: z.number().nullable().optional().describe("Maximum height constraint"),
  layoutAlign: z.enum(["MIN", "CENTER", "MAX", "STRETCH", "INHERIT"]).optional().describe("Alignment within parent"),
  layoutGrow: z.number().min(0).default(0).optional().describe("Stretch along parent's primary axis"),
  layoutPositioning: z.enum(["AUTO", "ABSOLUTE"]).optional().describe("Layout positioning mode"),
  constrainProportions: z.boolean().optional().describe("Whether to keep proportions when resizing"),
  rotation: z.number().min(-180).max(180).optional().describe("Rotation in degrees (-180 to 180)"),
  layoutSizingHorizontal: z.enum(["FIXED", "HUG", "FILL"]).optional().describe("Horizontal sizing mode"),
  layoutSizingVertical: z.enum(["FIXED", "HUG", "FILL"]).optional().describe("Vertical sizing mode"),
  constraints: z.any().optional().describe("Constraints relative to containing frame"),
};

// Common properties for all export settings
const commonExportSettingsProps = {
  contentsOnly: z.boolean().optional().describe("Whether only the contents of the node are exported. Defaults to true."),
  useAbsoluteBounds: z.boolean().optional().describe("Use full dimensions regardless of cropping. Defaults to false."),
  suffix: z.string().optional().describe("Suffix appended to the file name when exporting."),
  colorProfile: z.enum(["DOCUMENT", "SRGB", "DISPLAY_P3_V4"]).optional().describe("Color profile of the export."),
};

// Common SVG export properties
const commonSvgExportProps = {
  ...commonExportSettingsProps,
  svgOutlineText: z.boolean().optional().describe("Whether text elements are rendered as outlines. Defaults to true."),
  svgIdAttribute: z.boolean().optional().describe("Whether to include layer names as ID attributes. Defaults to false."),
  svgSimplifyStroke: z.boolean().optional().describe("Whether to simplify inside and outside strokes. Defaults to true."),
};

// Export constraints
const exportConstraintsSchema = z.object({
  type: z.enum(["SCALE", "WIDTH", "HEIGHT"]).describe("Type of constraint for the export"),
  value: z.number().positive().describe("Value for the constraint")
});

// Export Settings Image (JPG/PNG)
const exportSettingsImageSchema = z.object({
  format: z.enum(["JPG", "PNG"]).describe("The export format (JPG or PNG)"),
  constraint: exportConstraintsSchema.optional().describe("Constraint on the image size when exporting"),
  ...commonExportSettingsProps
});

// Export Settings SVG
const exportSettingsSvgSchema = z.object({
  format: z.literal("SVG").describe("The export format (SVG)"),
  ...commonSvgExportProps
});

// Export Settings SVG String (for exportAsync only)
const exportSettingsSvgStringSchema = z.object({
  format: z.literal("SVG_STRING").describe("The export format (SVG_STRING)"),
  ...commonSvgExportProps
});

// Export Settings PDF
const exportSettingsPdfSchema = z.object({
  format: z.literal("PDF").describe("The export format (PDF)"),
  ...commonExportSettingsProps
});

// Export Settings REST
const exportSettingsRestSchema = z.object({
  format: z.literal("JSON_REST_V1").describe("The export format (JSON_REST_V1)"),
  ...commonExportSettingsProps
});

// Combined Export Settings type
const exportSettingsSchema = z.discriminatedUnion("format", [
  exportSettingsImageSchema,
  exportSettingsSvgSchema,
  exportSettingsSvgStringSchema,
  exportSettingsPdfSchema,
  exportSettingsRestSchema
]);

// Export-related properties
const exportParams = {
  exportSettings: z.array(exportSettingsSchema).optional().describe("Export settings stored on the node"),
};

// Prototyping - Trigger and Action types
const triggerSchema = z.enum([
  "ON_CLICK",
  "ON_HOVER",
  "ON_PRESS",
  "ON_DRAG",
  "AFTER_TIMEOUT",
  "MOUSE_ENTER",
  "MOUSE_LEAVE",
  "MOUSE_UP",
  "MOUSE_DOWN",
  "ON_KEY_DOWN"
]).nullable().describe("The trigger that initiates the prototype interaction");

// Action represents what happens when a trigger is activated
const actionSchema = z.object({
  type: z.enum([
    "BACK",
    "CLOSE",
    "URL",
    "NODE",
    "SWAP",
    "OVERLAY",
    "SCROLL_TO",
    "OPEN_LINK"
  ]).describe("The type of action to perform"),
  url: z.string().optional().describe("URL to navigate to if action type is URL"),
  nodeID: z.string().optional().describe("ID of the node if action type is NODE"),
  destinationID: z.string().optional().describe("Destination node ID"),
  navigation: z.enum(["NAVIGATE", "SWAP", "OVERLAY", "SCROLL_TO"]).optional().describe("Navigation type"),
  transitionNode: z.string().optional().describe("ID of the node to use for transition"),
  preserveScrollPosition: z.boolean().optional().describe("Whether to preserve scroll position"),
  overlayRelativePosition: z.object({
    x: z.number(),
    y: z.number()
  }).optional().describe("Relative position for overlay"),
  // Additional properties can be added as needed based on Figma API
});

// Reaction combines a trigger with actions for prototyping
const reactionSchema = z.object({
  action: actionSchema.optional().describe("DEPRECATED: The action triggered by this reaction"),
  actions: z.array(actionSchema).optional().describe("The actions triggered by this reaction"),
  trigger: triggerSchema.describe("The trigger that initiates this reaction")
});

// Reaction properties
const reactionParams = {
  reactions: z.array(reactionSchema).optional().describe("List of reactions for prototyping"),
};

// Annotation properties
const annotationPropertySchema = z.object({
  type: z.enum([
    "width",
    "height",
    "fills",
    "strokes",
    "strokeWeight",
    "cornerRadius",
    "opacity",
    "blendMode",
    "effects",
    "layoutConstraints",
    "padding",
    "itemSpacing",
    "layoutMode",
    "primaryAxisAlignment",
    "counterAxisAlignment",
    "fontName",
    "fontSize",
    "letterSpacing",
    "lineHeight",
    "textCase",
    "textDecoration",
    "textAlignHorizontal",
    "textAlignVertical",
    "characters"
  ]).describe("The type of property being annotated"),
  value: z.any().optional().describe("The value of the property (if applicable)")
});

// Annotation schema
const annotationSchema = z.object({
  label: z.string().optional().describe("Text label for the annotation"),
  labelMarkdown: z.string().optional().describe("Markdown-formatted text label"),
  properties: z.array(annotationPropertySchema).optional().describe("Properties pinned in this annotation"),
  categoryId: z.string().optional().describe("ID of the annotation category")
});

// Annotation properties
const annotationParams = {
  annotations: z.array(annotationSchema).optional().describe("Annotations on the node"),
};

// Line parameters (width represents length, height is always 0)
const lineParams = {
  ...positionParams,
  width: z.number().min(1).default(100).describe("Length of the line in pixels"),
  ...baseNodeParams,
  ...sceneNodeParams,
  ...blendParams,
  ...geometryParams,
  ...layoutParams,
  ...exportParams,
  ...reactionParams,
  ...annotationParams,
};

// Combined parameters for rectangles
export const rectangleParams = {
  ...positionParams,
  ...sizeParams,
  ...baseNodeParams,
  ...sceneNodeParams,
  ...blendParams,
  ...cornerParams,
  ...geometryParams,
  ...rectangleStrokeParams,
  ...layoutParams,
  ...exportParams,
  ...reactionParams,
  ...annotationParams,
};

// Ellipse Arc data for creating arcs and donuts
const arcDataSchema = z.object({
  startingAngle: z.number().describe("Starting angle in degrees from 0 to 360"),
  endingAngle: z.number().describe("Ending angle in degrees from 0 to 360"),
  innerRadius: z.number().min(0).max(1).describe("Inner radius ratio from 0 to 1")
});



// Circle/Ellipse parameters
export const ellipseParams = {
  ...positionParams,
  ...sizeParams,
  ...baseNodeParams,
  ...sceneNodeParams,
  ...blendParams,
  ...geometryParams,
  ...layoutParams,
  ...exportParams,
  ...reactionParams,
  ...annotationParams,
  arcData: arcDataSchema.optional().describe("Arc data for creating partial ellipses and donuts")
};

// Text parameters
export const textParams = {
  ...positionParams,
  ...baseNodeParams,
  ...sceneNodeParams,
  ...blendParams,
  ...layoutParams,
  ...exportParams,
  ...reactionParams,
  ...annotationParams,
  text: z.string().default("Hello Figma!").describe("The text content"),
  fontSize: z.number().min(1).default(24).describe("The font size in pixels"),
  fontName: z.object({
    family: z.string().optional().describe("Font family name"),
    style: z.string().optional().describe("Font style (e.g., 'Regular', 'Bold')"),
  }).optional().describe("Font family and style"),
  textAlignHorizontal: z.enum(["LEFT", "CENTER", "RIGHT", "JUSTIFIED"]).optional().describe("Horizontal text alignment"),
  textAlignVertical: z.enum(["TOP", "CENTER", "BOTTOM"]).optional().describe("Vertical text alignment"),
  letterSpacing: z.number().optional().describe("Letter spacing in pixels"),
  lineHeight: z.union([z.number(), z.object({ value: z.number(), unit: z.enum(["PIXELS", "PERCENT"]) })]).optional().describe("Line height"),
  textDecoration: z.enum(["NONE", "UNDERLINE", "STRIKETHROUGH"]).optional().describe("Text decoration"),
  textCase: z.enum(["ORIGINAL", "UPPER", "LOWER", "TITLE"]).optional().describe("Text case transformation"),
};

// Frame parameters
export const frameParams = {
  ...positionParams,
  ...sizeParams,
  ...baseNodeParams,
  ...sceneNodeParams,
  ...blendParams,
  ...cornerParams,
  ...geometryParams,
  ...layoutParams,
  ...exportParams,
  ...reactionParams,
  ...annotationParams,
  itemSpacing: z.number().min(0).optional().describe("Space between children in auto-layout"),
  layoutMode: z.enum(["NONE", "HORIZONTAL", "VERTICAL"]).optional().describe("Auto-layout direction"),
  primaryAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional().describe("How frame sizes along primary axis"),
  counterAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional().describe("How frame sizes along counter axis"),
  primaryAxisAlignItems: z.enum(["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]).optional().describe("Alignment along primary axis"),
  counterAxisAlignItems: z.enum(["MIN", "CENTER", "MAX"]).optional().describe("Alignment along counter axis"),
  paddingLeft: z.number().min(0).optional().describe("Padding on left side"),
  paddingRight: z.number().min(0).optional().describe("Padding on right side"),
  paddingTop: z.number().min(0).optional().describe("Padding on top side"),
  paddingBottom: z.number().min(0).optional().describe("Padding on bottom side"),
};


// Arc parameters (based on ellipse parameters with added angle parameters)
export const arcParams = {
  ...ellipseParams,
  startAngle: z.number().default(0).describe("Starting angle in degrees"),
  endAngle: z.number().default(180).describe("Ending angle in degrees"),
  innerRadius: z.number().min(0).max(1).default(0).describe("Inner radius ratio (0-1) for donut shapes")
};

// Complete schema definitions
export const createRectangleSchema = z.object({
  ...rectangleParams
});

export const createEllipseSchema = z.object({
  ...ellipseParams
});

export const createTextSchema = z.object({
  ...textParams
});

export const createFrameSchema = z.object({
  ...frameParams
});

// Add export for lineParams
export { lineParams };

// Line schema (a one-dimensional object with width representing length)
export const createLineSchema = z.object({
  ...lineParams
}); 