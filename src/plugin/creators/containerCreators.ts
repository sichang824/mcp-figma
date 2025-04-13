/**
 * Container element creation functions for Figma plugin
 * Including Frame, Component, and other container-like nodes
 */

import { createSolidPaint } from '../utils/colorUtils';
import { applyCommonProperties } from '../utils/nodeUtils';

/**
 * Create a frame from data
 * @param data Frame configuration data
 * @returns Created frame node
 */
export function createFrameFromData(data: any): FrameNode {
  const frame = figma.createFrame();
  
  // Size
  frame.resize(data.width || 100, data.height || 100);
  
  // Background
  if (data.fills) {
    frame.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === 'string') {
      frame.fills = [createSolidPaint(data.fill)];
    } else {
      frame.fills = [data.fill];
    }
  }
  
  // Auto layout properties
  if (data.layoutMode) frame.layoutMode = data.layoutMode;
  if (data.primaryAxisSizingMode) frame.primaryAxisSizingMode = data.primaryAxisSizingMode;
  if (data.counterAxisSizingMode) frame.counterAxisSizingMode = data.counterAxisSizingMode;
  if (data.primaryAxisAlignItems) frame.primaryAxisAlignItems = data.primaryAxisAlignItems;
  if (data.counterAxisAlignItems) frame.counterAxisAlignItems = data.counterAxisAlignItems;
  if (data.paddingLeft !== undefined) frame.paddingLeft = data.paddingLeft;
  if (data.paddingRight !== undefined) frame.paddingRight = data.paddingRight;
  if (data.paddingTop !== undefined) frame.paddingTop = data.paddingTop;
  if (data.paddingBottom !== undefined) frame.paddingBottom = data.paddingBottom;
  if (data.itemSpacing !== undefined) frame.itemSpacing = data.itemSpacing;
  
  // Corner radius
  if (data.cornerRadius !== undefined) frame.cornerRadius = data.cornerRadius;
  if (data.topLeftRadius !== undefined) frame.topLeftRadius = data.topLeftRadius;
  if (data.topRightRadius !== undefined) frame.topRightRadius = data.topRightRadius;
  if (data.bottomLeftRadius !== undefined) frame.bottomLeftRadius = data.bottomLeftRadius;
  if (data.bottomRightRadius !== undefined) frame.bottomRightRadius = data.bottomRightRadius;
  
  return frame;
}

/**
 * Create a component from data
 * @param data Component configuration data
 * @returns Created component node
 */
export function createComponentFromData(data: any): ComponentNode {
  const component = figma.createComponent();
  
  // Size
  component.resize(data.width || 100, data.height || 100);
  
  // Background
  if (data.fills) {
    component.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === 'string') {
      component.fills = [createSolidPaint(data.fill)];
    } else {
      component.fills = [data.fill];
    }
  }
  
  // Auto layout properties (components support same auto layout as frames)
  if (data.layoutMode) component.layoutMode = data.layoutMode;
  if (data.primaryAxisSizingMode) component.primaryAxisSizingMode = data.primaryAxisSizingMode;
  if (data.counterAxisSizingMode) component.counterAxisSizingMode = data.counterAxisSizingMode;
  if (data.primaryAxisAlignItems) component.primaryAxisAlignItems = data.primaryAxisAlignItems;
  if (data.counterAxisAlignItems) component.counterAxisAlignItems = data.counterAxisAlignItems;
  if (data.paddingLeft !== undefined) component.paddingLeft = data.paddingLeft;
  if (data.paddingRight !== undefined) component.paddingRight = data.paddingRight;
  if (data.paddingTop !== undefined) component.paddingTop = data.paddingTop;
  if (data.paddingBottom !== undefined) component.paddingBottom = data.paddingBottom;
  if (data.itemSpacing !== undefined) component.itemSpacing = data.itemSpacing;
  
  // Component properties
  if (data.description) component.description = data.description;
  
  return component;
}

/**
 * Create a group from data
 * Note: Groups require children, so this typically needs to be used after creating child nodes
 * 
 * @param data Group configuration data
 * @param children Child nodes to include in the group
 * @returns Created group node
 */
export function createGroupFromData(data: any, children: SceneNode[]): GroupNode {
  // Create group with the provided children
  const group = figma.group(children, figma.currentPage);
  
  // Apply common properties
  applyCommonProperties(group, data);
  
  return group;
}

/**
 * Create an instance from data
 * @param data Instance configuration data (must include componentId)
 * @returns Created instance node
 */
export function createInstanceFromData(data: any): InstanceNode | null {
  if (!data.componentId) {
    console.error('Cannot create instance: componentId is required');
    return null;
  }
  
  // Try to find the component
  const component = figma.getNodeById(data.componentId) as ComponentNode;
  if (!component || component.type !== 'COMPONENT') {
    console.error(`Cannot create instance: component with id ${data.componentId} not found`);
    return null;
  }
  
  // Create instance
  const instance = component.createInstance();
  
  // Apply common properties
  applyCommonProperties(instance, data);
  
  // Handle instance-specific properties
  if (data.componentProperties) {
    for (const [key, value] of Object.entries(data.componentProperties)) {
      if (key in instance.componentProperties) {
        // Handle different types of component properties
        const prop = instance.componentProperties[key];
        if (prop.type === 'BOOLEAN') {
          instance.setProperties({ [key]: !!value });
        } else if (prop.type === 'TEXT') {
          instance.setProperties({ [key]: String(value) });
        } else if (prop.type === 'INSTANCE_SWAP') {
          instance.setProperties({ [key]: String(value) });
        } else if (prop.type === 'VARIANT') {
          instance.setProperties({ [key]: String(value) });
        }
      }
    }
  }
  
  return instance;
}

/**
 * Create a section from data
 * Sections are a special type of node used to organize frames in Figma
 * 
 * @param data Section configuration data
 * @returns Created section node
 */
export function createSectionFromData(data: any): SectionNode {
  const section = figma.createSection();
  
  // Section-specific properties
  if (data.name) section.name = data.name;
  if (data.sectionContentsHidden !== undefined) section.sectionContentsHidden = data.sectionContentsHidden;
  
  // Apply common properties that apply to sections
  if (data.x !== undefined) section.x = data.x;
  if (data.y !== undefined) section.y = data.y;
  
  return section;
} 