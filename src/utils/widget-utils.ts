/**
 * Utility functions for working with Figma Widgets
 */
import type { GetFileResponse, Node } from '@figma/rest-api-spec';
import type { WidgetNode, WidgetSyncData } from '../services/widget-api.js';

/**
 * Utility functions for working with Figma Widgets
 */
export class WidgetUtils {
  /**
   * Find all widget nodes in a file
   */
  static findAllWidgetNodes(file: GetFileResponse): Node[] {
    const widgetNodes: Node[] = [];
    
    // Helper function to recursively search for widget nodes
    const findWidgets = (node: Node) => {
      if (node.type === 'WIDGET') {
        widgetNodes.push(node);
      }
      
      if (node.children) {
        for (const child of node.children) {
          findWidgets(child);
        }
      }
    };
    
    findWidgets(file.document);
    return widgetNodes;
  }
  
  /**
   * Extract widget sync data from a widget node
   */
  static extractWidgetSyncData(node: Node): WidgetSyncData | null {
    if (node.type !== 'WIDGET' || !node.widgetSync) {
      return null;
    }
    
    try {
      return JSON.parse(node.widgetSync);
    } catch (error) {
      console.error('Error parsing widget sync data:', error);
      return null;
    }
  }
  
  /**
   * Format widget sync data for display
   */
  static formatWidgetSyncData(syncData: WidgetSyncData | null): string {
    if (!syncData) {
      return 'No sync data available';
    }
    
    return JSON.stringify(syncData, null, 2);
  }
  
  /**
   * Get a summary of a widget node
   */
  static getWidgetSummary(node: WidgetNode): Record<string, any> {
    const { id, name, widgetId } = node;
    
    const summary: Record<string, any> = {
      id,
      name,
      type: 'WIDGET',
      widgetId: widgetId || 'Unknown',
    };
    
    // If there's widget sync data, add a summary
    if (node.widgetSync) {
      try {
        const syncData = JSON.parse(node.widgetSync);
        const syncKeys = Object.keys(syncData);
        
        summary.syncDataKeys = syncKeys;
        summary.hasSyncData = syncKeys.length > 0;
      } catch (error) {
        summary.hasSyncData = false;
        summary.syncDataError = 'Invalid sync data format';
      }
    } else {
      summary.hasSyncData = false;
    }
    
    return summary;
  }
  
  /**
   * Check if a node is a widget
   */
  static isWidgetNode(node: Node): boolean {
    return node.type === 'WIDGET';
  }
  
  /**
   * Create a human-readable description of a widget
   */
  static createWidgetDescription(widget: WidgetNode): string {
    let description = ;
    
    if (widget.widgetId) {
      description += ;
    }
    
    if (widget.widgetSync) {
      try {
        const syncData = JSON.parse(widget.widgetSync);
        const syncKeys = Object.keys(syncData);
        
        description += ;
      } catch (error) {
        description += '\nSync Data: [Invalid format]';
      }
    } else {
      description += '\nSync Data: None';
    }
    
    return description;
  }
}
