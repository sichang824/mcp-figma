/**
 * Image and media element creation functions for Figma plugin
 */

import { applyCommonProperties } from '../utils/nodeUtils';

/**
 * Create an image node from data
 * @param data Image configuration data
 * @returns Created image node
 */
export function createImageFromData(data: any): SceneNode | null {
  try {
    // Image creation requires a hash
    if (!data.hash) {
      console.error('Image creation requires an image hash');
      return null;
    }
    
    const image = figma.createImage(data.hash);
    
    // Create a rectangle to display the image
    const rect = figma.createRectangle();
    
    // Set size
    if (data.width && data.height) {
      rect.resize(data.width, data.height);
    }
    
    // Apply image as fill
    rect.fills = [{
      type: 'IMAGE',
      scaleMode: data.scaleMode || 'FILL',
      imageHash: image.hash
    }];
    
    // Apply common properties
    applyCommonProperties(rect, data);
    
    return rect;
  } catch (error) {
    console.error('Failed to create image:', error);
    return null;
  }
}

/**
 * Create an image node asynchronously from data
 * @param data Image configuration data with bytes or file
 * @returns Promise resolving to created image node
 */
export async function createImageFromBytesAsync(data: any): Promise<SceneNode | null> {
  try {
    // Image creation requires bytes or a file
    if (!data.bytes && !data.file) {
      console.error('Image creation requires image bytes or file');
      return null;
    }
    
    let image;
    if (data.bytes) {
      image = await figma.createImageAsync(data.bytes);
    } else if (data.file) {
      // Note: file would need to be provided through some UI interaction
      // as plugins cannot directly access the file system
      image = await figma.createImageAsync(data.file);
    } else {
      return null;
    }
    
    // Create a rectangle to display the image
    const rect = figma.createRectangle();
    
    // Set size
    if (data.width && data.height) {
      rect.resize(data.width, data.height);
    }
    
    // Apply image as fill
    rect.fills = [{
      type: 'IMAGE',
      scaleMode: data.scaleMode || 'FILL',
      imageHash: image.hash
    }];
    
    // Apply common properties
    applyCommonProperties(rect, data);
    
    return rect;
  } catch (error) {
    console.error('Failed to create image asynchronously:', error);
    return null;
  }
}

/**
 * Create a GIF node from data
 * @param data GIF configuration data
 * @returns Created gif node
 */
export function createGifFromData(data: any): SceneNode | null {
  // As of my knowledge, there isn't a direct createGif API
  // Even though it's in the list of methods
  // For now, return null and log an error
  console.error('createGif API is not directly available or implemented');
  return null;
}

/**
 * Create a video node asynchronously from data
 * This depends on figma.createVideoAsync which may not be available in all versions
 * 
 * @param data Video configuration data
 * @returns Promise resolving to created video node
 */
export async function createVideoFromDataAsync(data: any): Promise<SceneNode | null> {
  // Check if video creation is supported
  if (!('createVideoAsync' in figma)) {
    console.error('Video creation is not supported in this Figma version');
    return null;
  }
  
  try {
    // Video creation requires bytes
    if (!data.bytes) {
      console.error('Video creation requires video bytes');
      return null;
    }
    
    // Using type assertion since createVideoAsync may not be recognized by TypeScript
    const video = await (figma as any).createVideoAsync(data.bytes);
    
    // Apply common properties
    applyCommonProperties(video, data);
    
    return video;
  } catch (error) {
    console.error('Failed to create video:', error);
    return null;
  }
}

/**
 * Create a link preview node asynchronously from data
 * This depends on figma.createLinkPreviewAsync which may not be available in all versions
 * 
 * @param data Link preview configuration data
 * @returns Promise resolving to created link preview node
 */
export async function createLinkPreviewFromDataAsync(data: any): Promise<SceneNode | null> {
  // Check if link preview creation is supported
  if (!('createLinkPreviewAsync' in figma)) {
    console.error('Link preview creation is not supported in this Figma version');
    return null;
  }
  
  try {
    // Link preview creation requires a URL
    if (!data.url) {
      console.error('Link preview creation requires a URL');
      return null;
    }
    
    // Using type assertion since createLinkPreviewAsync may not be recognized by TypeScript
    const linkPreview = await (figma as any).createLinkPreviewAsync(data.url);
    
    // Apply common properties
    applyCommonProperties(linkPreview, data);
    
    return linkPreview;
  } catch (error) {
    console.error('Failed to create link preview:', error);
    return null;
  }
} 