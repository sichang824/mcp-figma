/**
 * Universal element creator for Figma plugin
 * Acts as a central entry point for creating any type of Figma element
 */

import { 
  createRectangleFromData, 
  createEllipseFromData,
  createPolygonFromData,
  createStarFromData,
  createLineFromData,
  createVectorFromData
} from './shapeCreators';

import {
  createFrameFromData,
  createComponentFromData,
  createInstanceFromData,
  createGroupFromData,
  createSectionFromData
} from './containerCreators';

import { createTextFromData } from './textCreator';

import {
  createBooleanOperationFromData,
  createConnectorFromData,
  createShapeWithTextFromData,
  createCodeBlockFromData,
  createTableFromData,
  createWidgetFromData,
  createMediaFromData
} from './specialCreators';

import {
  createImageFromData,
  createImageFromBytesAsync,
  createGifFromData,
  createVideoFromDataAsync,
  createLinkPreviewFromDataAsync
} from './imageCreators';

import {
  createSliceFromData,
  createPageFromData,
  createPageDividerFromData,
  createSlideFromData,
  createSlideRowFromData
} from './sliceCreators';

import {
  createComponentFromNodeData,
  createComponentSetFromData
} from './componentCreators';

import { applyCommonProperties, selectAndFocusNodes } from '../utils/nodeUtils';

/**
 * Unified create element function that works with structured data
 * Detects the type of element to create based on the data.type property
 * 
 * @param data Configuration data with type and other properties
 * @returns Created Figma node or null if creation failed
 */
export async function createElementFromData(data: any): Promise<SceneNode | null> {
  if (!data || !data.type) {
    console.error('Invalid element data: missing type');
    return null;
  }
  
  let element: SceneNode | null = null;
  
  try {
    // Create the element based on its type
    switch (data.type.toLowerCase()) {
      // Basic shapes
      case 'rectangle':
        element = createRectangleFromData(data);
        break;
        
      case 'ellipse':
      case 'circle':
        element = createEllipseFromData(data);
        break;
        
      case 'polygon':
        element = createPolygonFromData(data);
        break;
        
      case 'star':
        element = createStarFromData(data);
        break;
        
      case 'line':
        element = createLineFromData(data);
        break;
        
      case 'vector':
        element = createVectorFromData(data);
        break;
      
      // Container elements
      case 'frame':
        element = createFrameFromData(data);
        break;
        
      case 'component':
        element = createComponentFromData(data);
        break;
        
      case 'componentfromnode':
        element = createComponentFromNodeData(data);
        break;
        
      case 'componentset':
        element = createComponentSetFromData(data);
        break;
        
      case 'instance':
        element = createInstanceFromData(data);
        break;
        
      case 'section':
        element = createSectionFromData(data);
        break;
        
      // Text
      case 'text':
        element = await createTextFromData(data);
        break;
        
      // Special types
      case 'boolean':
      case 'booleanoperation':
        element = createBooleanOperationFromData(data);
        break;
        
      case 'connector':
        element = createConnectorFromData(data);
        break;
        
      case 'shapewithtext':
        element = createShapeWithTextFromData(data);
        break;
        
      case 'codeblock':
        element = createCodeBlockFromData(data);
        break;
        
      case 'table':
        element = createTableFromData(data);
        break;
        
      case 'widget':
        element = createWidgetFromData(data);
        break;
        
      case 'media':
        element = createMediaFromData(data);
        break;
        
      // Image and media types
      case 'image':
        if (data.bytes || data.file) {
          element = await createImageFromBytesAsync(data);
        } else {
          element = createImageFromData(data);
        }
        break;
        
      case 'gif':
        element = createGifFromData(data);
        break;
        
      case 'video':
        element = await createVideoFromDataAsync(data);
        break;
        
      case 'linkpreview':
        element = await createLinkPreviewFromDataAsync(data);
        break;
        
      // Page and slice types
      case 'slice':
        element = createSliceFromData(data);
        break;
        
      case 'page':
        // PageNode is not a SceneNode in Figma's type system
        // So we create it but don't return it through the same path
        const page = createPageFromData(data);
        console.log(`Created page: ${page.name}`);
        // We return null as we can't return a PageNode as SceneNode
        return null;
        
      case 'pagedivider':
        element = createPageDividerFromData(data);
        break;
        
      case 'slide':
        element = createSlideFromData(data);
        break;
        
      case 'sliderow':
        element = createSlideRowFromData(data);
        break;
        
      // Special cases
      case 'group':
        if (!data.children || !Array.isArray(data.children) || data.children.length < 1) {
          console.error('Cannot create group: children array is required');
          return null;
        }
        
        // Create all child elements first
        const childNodes: SceneNode[] = [];
        for (const childData of data.children) {
          const child = await createElementFromData(childData);
          if (child) childNodes.push(child);
        }
        
        if (childNodes.length > 0) {
          element = createGroupFromData(data, childNodes);
        } else {
          console.error('Cannot create group: no valid children were created');
          return null;
        }
        break;
        
      default:
        console.error(`Unsupported element type: ${data.type}`);
        return null;
    }
    
    // Apply common properties if element was created
    if (element) {
      applyCommonProperties(element, data);
      
      // Select and focus on the element if requested
      if (data.select !== false) {
        selectAndFocusNodes(element);
      }
    }
    
    return element;
  } catch (error) {
    console.error(`Error creating element: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Create multiple elements from an array of data objects
 * @param dataArray Array of element configuration data
 * @returns Array of created nodes
 */
export async function createElementsFromDataArray(dataArray: any[]): Promise<SceneNode[]> {
  const createdNodes: SceneNode[] = [];
  
  for (const data of dataArray) {
    const node = await createElementFromData(data);
    if (node) createdNodes.push(node);
  }
  
  // If there are created nodes, select them all at the end
  if (createdNodes.length > 0) {
    selectAndFocusNodes(createdNodes);
  }
  
  return createdNodes;
} 