/**
 * Slice and page-related element creation functions
 */

import { applyCommonProperties } from "../utils/nodeUtils";

/**
 * Create a slice node from data
 * @param data Slice configuration data
 * @returns Created slice node
 */
export function createSliceFromData(data: any): SliceNode {
  const slice = figma.createSlice();

  // Set size and position
  if (data.width && data.height) {
    slice.resize(data.width, data.height);
  }

  if (data.x !== undefined) slice.x = data.x;
  if (data.y !== undefined) slice.y = data.y;

  // Apply export settings
  if (data.exportSettings && Array.isArray(data.exportSettings)) {
    slice.exportSettings = data.exportSettings;
  }

  // Apply common properties that apply to slices
  if (data.name) slice.name = data.name;
  if (data.visible !== undefined) slice.visible = data.visible;

  return slice;
}

/**
 * Create a page node from data
 * @param data Page configuration data
 * @returns Created page node
 */
export function createPageFromData(data: any): PageNode {
  const page = figma.createPage();

  // Set page name
  if (data.name) page.name = data.name;

  // Set background color if provided
  if (data.backgrounds) page.backgrounds = data.backgrounds;

  return page;
}

/**
 * Create a page divider (used for sections)
 * @param data Page divider configuration data
 * @returns Created page divider node
 */
export function createPageDividerFromData(data: any) {
  // Check if this method is available in the current Figma version
  if (!("createPageDivider" in figma)) {
    console.error("createPageDivider is not supported in this Figma version");
    return null;
  }

  try {
    // Using type assertion since API might not be recognized in all Figma versions
    const pageDivider = (figma as any).createPageDivider();

    // Set properties
    if (data.name) pageDivider.name = data.name;

    return pageDivider;
  } catch (error) {
    console.error("Failed to create page divider:", error);
    return null;
  }
}

/**
 * Create a slide node (for Figma Slides)
 * @param data Slide configuration data
 * @returns Created slide node
 */
export function createSlideFromData(data: any): SlideNode | null {
  // Check if this method is available in the current Figma version
  if (!("createSlide" in figma)) {
    console.error("createSlide is not supported in this Figma version");
    return null;
  }

  try {
    // Using type assertion since API might not be recognized
    const slide = (figma as any).createSlide();

    // Set slide properties
    if (data.name) slide.name = data.name;

    // Apply common properties
    applyCommonProperties(slide, data);

    return slide;
  } catch (error) {
    console.error("Failed to create slide:", error);
    return null;
  }
}

/**
 * Create a slide row node (for Figma Slides)
 * @param data Slide row configuration data
 * @returns Created slide row node
 */
export function createSlideRowFromData(data: any): SlideRowNode | null {
  // Check if this method is available in the current Figma version
  if (!("createSlideRow" in figma)) {
    console.error("createSlideRow is not supported in this Figma version");
    return null;
  }

  try {
    // Using type assertion since API might not be recognized
    const slideRow = (figma as any).createSlideRow();

    // Set slide row properties
    if (data.name) slideRow.name = data.name;

    // Apply common properties
    applyCommonProperties(slideRow, data);

    return slideRow;
  } catch (error) {
    console.error("Failed to create slide row:", error);
    return null;
  }
}
