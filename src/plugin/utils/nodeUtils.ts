/**
 * Utility functions for handling Figma nodes
 */

/**
 * Apply common properties to any node type
 * Safely handles properties that might not be available on all node types
 * 
 * @param node The target node to apply properties to
 * @param data Object containing the properties to apply
 */
export function applyCommonProperties(node: SceneNode, data: any): void {
  // Position
  if (data.x !== undefined) node.x = data.x;
  if (data.y !== undefined) node.y = data.y;
  
  // Name
  if (data.name) node.name = data.name;
  
  // Properties that aren't available on all node types
  // We need to check if they exist before setting them
  
  // Opacity
  if (data.opacity !== undefined && 'opacity' in node) {
    (node as any).opacity = data.opacity;
  }
  
  // Blend mode
  if (data.blendMode && 'blendMode' in node) {
    (node as any).blendMode = data.blendMode;
  }
  
  // Effects
  if (data.effects && 'effects' in node) {
    (node as any).effects = data.effects;
  }
  
  // Constraint
  if (data.constraints && 'constraints' in node) {
    (node as any).constraints = data.constraints;
  }
  
  // Is Mask
  if (data.isMask !== undefined && 'isMask' in node) {
    (node as any).isMask = data.isMask;
  }
  
  // Visible
  if (data.visible !== undefined) node.visible = data.visible;
  
  // Locked
  if (data.locked !== undefined) node.locked = data.locked;
}

/**
 * Select and focus on a node or set of nodes
 * @param nodes Node or array of nodes to focus on
 */
export function selectAndFocusNodes(nodes: SceneNode | SceneNode[]): void {
  const nodesToFocus = Array.isArray(nodes) ? nodes : [nodes];
  figma.currentPage.selection = nodesToFocus;
  figma.viewport.scrollAndZoomIntoView(nodesToFocus);
}

/**
 * Build a result object from a node or array of nodes
 * @param result Node or array of nodes to create a result object from
 * @returns Object containing node information in a consistent format
 */
export function buildResultObject(result: SceneNode | readonly SceneNode[] | null): {[key: string]: any} {
  let resultObject: {[key: string]: any} = {};
  
  if (!result) return resultObject;
  
  if (Array.isArray(result)) {
    // Handle array result (like from get-selection)
    resultObject.count = result.length;
    if (result.length > 0) {
      resultObject.items = result.map(node => ({
        id: node.id,
        type: node.type,
        name: node.name
      }));
    }
  } else {
    // Handle single node result - we know it's a SceneNode at this point
    const node = result as SceneNode;
    resultObject.id = node.id;
    resultObject.type = node.type;
    resultObject.name = node.name;
  }
  
  return resultObject;
} 