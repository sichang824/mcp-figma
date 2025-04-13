/**
 * Service for interacting with Figma Widget API
 */
import axios from 'axios';
import { env } from '../config/env.js';
import { z } from 'zod';

const FIGMA_API_BASE_URL = 'https://api.figma.com/v1';

// Widget data schemas
export const WidgetNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('WIDGET'),
  widgetId: z.string().optional(),
  widgetSync: z.string().optional(),
  pluginData: z.record(z.unknown()).optional(),
  sharedPluginData: z.record(z.record(z.unknown())).optional(),
});

export type WidgetNode = z.infer<typeof WidgetNodeSchema>;

export const WidgetSyncDataSchema = z.record(z.unknown());
export type WidgetSyncData = z.infer<typeof WidgetSyncDataSchema>;

/**
 * Service for interacting with Figma Widget API
 */
export class WidgetApiService {
  private readonly headers: Record<string, string>;

  constructor(accessToken: string = env.FIGMA_PERSONAL_ACCESS_TOKEN) {
    this.headers = {
      'X-Figma-Token': accessToken,
    };
  }

  /**
   * Get all widget nodes in a file
   */
  async getWidgetNodes(fileKey: string): Promise<WidgetNode[]> {
    try {
      const response = await axios.get(, {
        headers: this.headers,
      });
      
      const file = response.data;
      return this.findAllWidgetNodes(file.document);
    } catch (error) {
      console.error('Error fetching widget nodes:', error);
      throw error;
    }
  }

  /**
   * Get a specific widget node by ID
   */
  async getWidgetNode(fileKey: string, nodeId: string): Promise<WidgetNode | null> {
    try {
      const response = await axios.get(, {
        headers: this.headers,
      });
      
      const node = response.data.nodes[nodeId]?.document;
      if (!node || node.type !== 'WIDGET') {
        return null;
      }
      
      return WidgetNodeSchema.parse(node);
    } catch (error) {
      console.error('Error fetching widget node:', error);
      throw error;
    }
  }

  /**
   * Get the widget sync data (state) for a specific widget
   */
  async getWidgetSyncData(fileKey: string, nodeId: string): Promise<WidgetSyncData | null> {
    try {
      const widgetNode = await this.getWidgetNode(fileKey, nodeId);
      
      if (!widgetNode || !widgetNode.widgetSync) {
        return null;
      }
      
      // Parse the widgetSync data string (it's stored as a JSON string)
      try {
        return JSON.parse(widgetNode.widgetSync);
      } catch (parseError) {
        console.error('Error parsing widget sync data:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error fetching widget sync data:', error);
      throw error;
    }
  }

  /**
   * Create a widget instance in a file (requires special access)
   * Note: This is only available to Figma widget developers or partners.
   */
  async createWidget(fileKey: string, options: {
    name: string,
    widgetId: string,
    x: number,
    y: number,
    initialSyncData?: Record<string, any>,
    parentNodeId?: string,
  }): Promise<{ widgetNodeId: string } | null> {
    try {
      // This endpoint might not be publicly available
      const response = await axios.post(
        ,
        options,
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating widget:', error);
      throw error;
    }
  }

  /**
   * Update a widget's properties (requires widget developer access)
   * Note: This functionality is limited to Figma widget developers.
   */
  async updateWidgetProperties(fileKey: string, nodeId: string, properties: Record<string, any>): Promise<boolean> {
    try {
      // This endpoint might not be publicly available
      await axios.patch(
        ,
        { properties },
        { headers: this.headers }
      );
      
      return true;
    } catch (error) {
      console.error('Error updating widget properties:', error);
      throw error;
    }
  }

  /**
   * Helper method to recursively find all widget nodes in a file
   */
  private findAllWidgetNodes(node: any): WidgetNode[] {
    let widgets: WidgetNode[] = [];
    
    if (node.type === 'WIDGET') {
      try {
        widgets.push(WidgetNodeSchema.parse(node));
      } catch (error) {
        console.error('Error parsing widget node:', error);
      }
    }
    
    if (node.children) {
      for (const child of node.children) {
        widgets = widgets.concat(this.findAllWidgetNodes(child));
      }
    }
    
    return widgets;
  }
}

export default new WidgetApiService();
