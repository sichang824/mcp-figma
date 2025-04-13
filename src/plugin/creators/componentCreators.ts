/**
 * Component-related creation functions for Figma plugin
 */

import { applyCommonProperties } from '../utils/nodeUtils';

/**
 * Create a component from another node
 * @param data Configuration data with sourceNode reference
 * @returns Created component node
 */
export function createComponentFromNodeData(data: any): ComponentNode | null {
  // We need a sourceNode to create a component from
  if (!data.sourceNode) {
    console.error('createComponentFromNode requires a sourceNode');
    return null;
  }
  
  try {
    // If sourceNode is a string, try to find it by ID
    let sourceNode;
    if (typeof data.sourceNode === 'string') {
      sourceNode = figma.getNodeById(data.sourceNode);
      if (!sourceNode || !('type' in sourceNode)) {
        console.error(`Node with ID ${data.sourceNode} not found or is not a valid node`);
        return null;
      }
    } else {
      sourceNode = data.sourceNode;
    }
    
    // Create the component from the source node
    const component = figma.createComponentFromNode(sourceNode as SceneNode);
    
    // Apply component-specific properties
    if (data.description) component.description = data.description;
    
    // Apply common properties
    applyCommonProperties(component, data);
    
    return component;
  } catch (error) {
    console.error('Failed to create component from node:', error);
    return null;
  }
}

/**
 * Create a component set (variant container)
 * @param data Configuration data for component set
 * @returns Created component set node
 */
export function createComponentSetFromData(data: any): ComponentSetNode | null {
  try {
    // Create an empty component set
    // In practice, component sets are usually created by combining variants
    // using figma.combineAsVariants, not directly created
    
    // Get the components to combine
    if (!data.components || !Array.isArray(data.components) || data.components.length === 0) {
      console.error('Component set creation requires component nodes');
      return null;
    }
    
    const componentNodes: ComponentNode[] = [];
    
    // Collect the component nodes (could be IDs or actual nodes)
    for (const component of data.components) {
      let node;
      
      if (typeof component === 'string') {
        // If it's a string, assume it's a node ID
        node = figma.getNodeById(component);
      } else {
        node = component;
      }
      
      if (node && node.type === 'COMPONENT') {
        componentNodes.push(node as ComponentNode);
      }
    }
    
    if (componentNodes.length === 0) {
      console.error('No valid component nodes provided');
      return null;
    }
    
    // Combine the components as variants
    const componentSet = figma.combineAsVariants(componentNodes, figma.currentPage);
    
    // Apply component set properties
    if (data.name) componentSet.name = data.name;
    
    // Apply common properties
    applyCommonProperties(componentSet, data);
    
    return componentSet;
  } catch (error) {
    console.error('Failed to create component set:', error);
    return null;
  }
} 