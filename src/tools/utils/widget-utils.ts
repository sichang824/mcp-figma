/**
 * Widget Utils - Helper functions for widget tools
 */
import type { Node } from '@figma/rest-api-spec';

/**
 * Parses the widget sync data from a widget node
 * @param node A Figma node of type WIDGET
 * @returns The parsed sync data object or null if not available/invalid
 */
export function parseWidgetSyncData(node: Node): Record<string, any> | null {
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
 * Formats widget sync data as a string
 * @param syncData The widget sync data object
 * @returns A formatted string representation of the sync data
 */
export function formatWidgetSyncData(syncData: Record<string, any> | null): string {
  if (!syncData) {
    return 'No sync data available';
  }
  
  return JSON.stringify(syncData, null, 2);
}

/**
 * Gets a summary of the widget's properties
 * @param node A Figma node of type WIDGET
 * @returns A summary object with key widget properties
 */
export function getWidgetSummary(node: Node): Record<string, any> {
  if (node.type !== 'WIDGET') {
    return { error: 'Not a widget node' };
  }
  
  const summary: Record<string, any> = {
    id: node.id,
    name: node.name,
    type: 'WIDGET',
    widgetId: node.widgetId || 'Unknown',
  };
  
  // If there's widget sync data, analyze it
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
 * Creates a human-readable description of the widget
 * @param node A Figma node of type WIDGET
 * @returns A detailed text description of the widget
 */
export function createWidgetDescription(node: Node): string {
  if (node.type !== 'WIDGET') {
    return 'Not a widget node';
  }
  
  let description = `Widget "${node.name}" (ID: ${node.id})`;
  
  if (node.widgetId) {
    description += `\nWidget ID: ${node.widgetId}`;
  }
  
  if (node.widgetSync) {
    try {
      const syncData = JSON.parse(node.widgetSync);
      const syncKeys = Object.keys(syncData);
      
      description += `\nSync Data Keys: ${syncKeys.join(', ')}`;
    } catch (error) {
      description += '\nSync Data: [Invalid format]';
    }
  } else {
    description += '\nSync Data: None';
  }
  
  return description;
}
