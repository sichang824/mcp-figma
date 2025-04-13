import type { GetFileResponse, Node } from '@figma/rest-api-spec';

/**
 * Utility functions for working with Figma files and nodes
 */
export class FigmaUtils {
  /**
   * Find a node by ID in a Figma file
   */
  static findNodeById(file: GetFileResponse, nodeId: string): Node | null {
    // If node ID is the document itself
    if (nodeId === file.document.id) {
      return file.document;
    }

    // Helper function to recursively search for node
    const findNode = (node: Node): Node | null => {
      if (node.id === nodeId) {
        return node;
      }

      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }

      return null;
    };

    return findNode(file.document);
  }

  /**
   * Get all nodes of a specific type from a Figma file
   */
  static getNodesByType(file: GetFileResponse, type: string): Node[] {
    const nodes: Node[] = [];

    // Helper function to recursively search for nodes
    const findNodes = (node: Node) => {
      if (node.type === type) {
        nodes.push(node);
      }

      if (node.children) {
        for (const child of node.children) {
          findNodes(child);
        }
      }
    };

    findNodes(file.document);
    return nodes;
  }

  /**
   * Format a node ID for display (e.g., "1:2" -> "Node 1:2")
   */
  static formatNodeId(nodeId: string): string {
    return `Node ${nodeId}`;
  }

  /**
   * Extract text content from a TEXT node
   */
  static extractTextFromNode(node: Node): string {
    return node.type === 'TEXT' ? node.characters || '' : '';
  }

  /**
   * Get a simple representation of a node's properties
   */
  static getNodeProperties(node: Node): Record<string, any> {
    const { id, name, type } = node;
    let properties: Record<string, any> = { id, name, type };

    // Add type-specific properties
    switch (node.type) {
      case 'TEXT':
        properties.text = node.characters;
        break;
      case 'RECTANGLE':
      case 'ELLIPSE':
      case 'POLYGON':
      case 'STAR':
      case 'VECTOR':
        if (node.fills) {
          properties.fills = node.fills.map(fill => ({
            type: fill.type,
            visible: fill.visible,
          }));
        }
        break;
      case 'FRAME':
      case 'GROUP':
      case 'INSTANCE':
      case 'COMPONENT':
        properties.childCount = node.children?.length || 0;
        break;
    }

    return properties;
  }

  /**
   * Get the path to a node in the document
   */
  static getNodePath(file: GetFileResponse, nodeId: string): string[] {
    const path: string[] = [];
    
    const findPath = (node: Node, target: string): boolean => {
      if (node.id === target) {
        path.unshift(node.name);
        return true;
      }
      
      if (node.children) {
        for (const child of node.children) {
          if (findPath(child, target)) {
            path.unshift(node.name);
            return true;
          }
        }
      }
      
      return false;
    };
    
    findPath(file.document, nodeId);
    return path;
  }
}
