/**
 * Widget Tools - MCP server tools for interacting with Figma widgets
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";
import { FigmaUtils } from "../../utils/figma-utils.js";

/**
 * Register widget-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerWidgetTools(server: McpServer) {
  // Get all widget nodes in a file
  server.tool(
    "get_widgets",
    {
      file_key: z.string().min(1).describe("The Figma file key to retrieve widgets from")
    },
    async ({ file_key }) => {
      try {
        const file = await figmaApi.getFile(file_key);
        
        // Find all widget nodes in the file
        const widgetNodes = FigmaUtils.getNodesByType(file, 'WIDGET');
        
        if (widgetNodes.length === 0) {
          return {
            content: [
              { type: "text", text: `No widgets found in file ${file_key}` }
            ]
          };
        }
        
        const widgetsList = widgetNodes.map((node, index) => {
          const widgetSyncData = node.widgetSync ? 
            `\n   - Widget Sync Data: Available` : 
            `\n   - Widget Sync Data: None`;
            
          return `${index + 1}. **${node.name}** (ID: ${node.id})
   - Widget ID: ${node.widgetId || 'Unknown'}${widgetSyncData}`;
        }).join('\n\n');
        
        return {
          content: [
            { type: "text", text: `# Widgets in file ${file_key}` },
            { type: "text", text: `Found ${widgetNodes.length} widgets:` },
            { type: "text", text: widgetsList }
          ]
        };
      } catch (error) {
        console.error('Error fetching widgets:', error);
        return {
          content: [
            { type: "text", text: `Error getting widgets: ${(error as Error).message}` }
          ]
        };
      }
    }
  );

  // Get a specific widget node
  server.tool(
    "get_widget",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      node_id: z.string().min(1).describe("The ID of the widget node")
    },
    async ({ file_key, node_id }) => {
      try {
        const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
        const nodeData = fileNodes.nodes[node_id];
        
        if (!nodeData || nodeData.document.type !== 'WIDGET') {
          return {
            content: [
              { type: "text", text: `Node ${node_id} not found in file ${file_key} or is not a widget` }
            ]
          };
        }
        
        const widgetNode = nodeData.document;
        
        // Get the sync data if available
        let syncDataContent = '';
        if (widgetNode.widgetSync) {
          try {
            const syncData = JSON.parse(widgetNode.widgetSync);
            syncDataContent = `\n\n## Widget Sync Data\n\`\`\`json\n${JSON.stringify(syncData, null, 2)}\n\`\`\``;
          } catch (error) {
            syncDataContent = '\n\n## Widget Sync Data\nError parsing widget sync data';
          }
        }
        
        return {
          content: [
            { type: "text", text: `# Widget: ${widgetNode.name}` },
            { type: "text", text: `ID: ${widgetNode.id}` },
            { type: "text", text: `Widget ID: ${widgetNode.widgetId || 'Unknown'}` },
            { type: "text", text: `Has Sync Data: ${widgetNode.widgetSync ? 'Yes' : 'No'}${syncDataContent}` }
          ]
        };
      } catch (error) {
        console.error('Error fetching widget node:', error);
        return {
          content: [
            { type: "text", text: `Error getting widget: ${(error as Error).message}` }
          ]
        };
      }
    }
  );

  // Get widget sync data
  server.tool(
    "get_widget_sync_data",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      node_id: z.string().min(1).describe("The ID of the widget node")
    },
    async ({ file_key, node_id }) => {
      try {
        const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
        const nodeData = fileNodes.nodes[node_id];
        
        if (!nodeData || nodeData.document.type !== 'WIDGET') {
          return {
            content: [
              { type: "text", text: `Node ${node_id} not found in file ${file_key} or is not a widget` }
            ]
          };
        }
        
        const widgetNode = nodeData.document;
        
        if (!widgetNode.widgetSync) {
          return {
            content: [
              { type: "text", text: `Widget ${node_id} does not have any sync data` }
            ]
          };
        }
        
        try {
          const syncData = JSON.parse(widgetNode.widgetSync);
          
          return {
            content: [
              { type: "text", text: `# Widget Sync Data for "${widgetNode.name}"` },
              { type: "text", text: `Widget ID: ${widgetNode.id}` },
              { type: "text", text: "```json\n" + JSON.stringify(syncData, null, 2) + "\n```" }
            ]
          };
        } catch (error) {
          console.error('Error parsing widget sync data:', error);
          return {
            content: [
              { type: "text", text: `Error parsing widget sync data: ${(error as Error).message}` }
            ]
          };
        }
      } catch (error) {
        console.error('Error fetching widget sync data:', error);
        return {
          content: [
            { type: "text", text: `Error getting widget sync data: ${(error as Error).message}` }
          ]
        };
      }
    }
  );

  // Search widgets by property values
  server.tool(
    "search_widgets",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      property_key: z.string().min(1).describe("The sync data property key to search for"),
      property_value: z.string().optional().describe("Optional property value to match (if not provided, returns all widgets with the property)")
    },
    async ({ file_key, property_key, property_value }) => {
      try {
        const file = await figmaApi.getFile(file_key);
        
        // Find all widget nodes
        const allWidgetNodes = FigmaUtils.getNodesByType(file, 'WIDGET');
        
        // Filter widgets that have the specified property
        const matchingWidgets = allWidgetNodes.filter(node => {
          if (!node.widgetSync) return false;
          
          try {
            const syncData = JSON.parse(node.widgetSync);
            
            // If property_value is provided, check for exact match
            if (property_value !== undefined) {
              // Handle different types of values (string, number, boolean)
              const propValue = syncData[property_key];
              
              if (typeof propValue === 'string') {
                return propValue === property_value;
              } else if (typeof propValue === 'number') {
                return propValue.toString() === property_value;
              } else if (typeof propValue === 'boolean') {
                return propValue.toString() === property_value;
              } else if (propValue !== null && typeof propValue === 'object') {
                return JSON.stringify(propValue) === property_value;
              }
              
              return false;
            }
            
            // If no value provided, just check if the property exists
            return property_key in syncData;
          } catch (error) {
            return false;
          }
        });
        
        if (matchingWidgets.length === 0) {
          return {
            content: [
              { type: "text", text: property_value ? 
                `No widgets found with property "${property_key}" = "${property_value}"` : 
                `No widgets found with property "${property_key}"` 
              }
            ]
          };
        }
        
        const widgetsList = matchingWidgets.map((node, index) => {
          let syncDataValue = '';
          try {
            const syncData = JSON.parse(node.widgetSync!);
            const value = syncData[property_key];
            syncDataValue = typeof value === 'object' ? 
              JSON.stringify(value) : 
              String(value);
          } catch (error) {
            syncDataValue = 'Error parsing sync data';
          }
          
          return `${index + 1}. **${node.name}** (ID: ${node.id})
   - Property "${property_key}": ${syncDataValue}`;
        }).join('\n\n');
        
        return {
          content: [
            { type: "text", text: property_value ? 
              `# Widgets with property "${property_key}" = "${property_value}"` : 
              `# Widgets with property "${property_key}"` 
            },
            { type: "text", text: `Found ${matchingWidgets.length} matching widgets:` },
            { type: "text", text: widgetsList }
          ]
        };
      } catch (error) {
        console.error('Error searching widgets:', error);
        return {
          content: [
            { type: "text", text: `Error searching widgets: ${(error as Error).message}` }
          ]
        };
      }
    }
  );

  // Get widget properties for modification
  server.tool(
    "analyze_widget_structure",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      node_id: z.string().min(1).describe("The ID of the widget node")
    },
    async ({ file_key, node_id }) => {
      try {
        const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
        const nodeData = fileNodes.nodes[node_id];
        
        if (!nodeData || nodeData.document.type !== 'WIDGET') {
          return {
            content: [
              { type: "text", text: `Node ${node_id} not found in file ${file_key} or is not a widget` }
            ]
          };
        }
        
        const widgetNode = nodeData.document;
        
        // Create a full analysis of the widget
        const widgetAnalysis = {
          basic: {
            id: widgetNode.id,
            name: widgetNode.name,
            type: widgetNode.type,
            widgetId: widgetNode.widgetId || 'Unknown'
          },
          placement: {
            x: widgetNode.x || 0,
            y: widgetNode.y || 0,
            width: widgetNode.width || 0,
            height: widgetNode.height || 0,
            rotation: widgetNode.rotation || 0
          },
          syncData: null as any
        };
        
        // Parse the widget sync data if available
        if (widgetNode.widgetSync) {
          try {
            widgetAnalysis.syncData = JSON.parse(widgetNode.widgetSync);
          } catch (error) {
            widgetAnalysis.syncData = { error: 'Invalid sync data format' };
          }
        }
        
        return {
          content: [
            { type: "text", text: `# Widget Analysis: ${widgetNode.name}` },
            { type: "text", text: `## Basic Information` },
            { type: "text", text: "```json\n" + JSON.stringify(widgetAnalysis.basic, null, 2) + "\n```" },
            { type: "text", text: `## Placement` },
            { type: "text", text: "```json\n" + JSON.stringify(widgetAnalysis.placement, null, 2) + "\n```" },
            { type: "text", text: `## Sync Data` },
            { type: "text", text: widgetAnalysis.syncData ? 
              "```json\n" + JSON.stringify(widgetAnalysis.syncData, null, 2) + "\n```" : 
              "No sync data available" 
            }
          ]
        };
      } catch (error) {
        console.error('Error analyzing widget:', error);
        return {
          content: [
            { type: "text", text: `Error analyzing widget: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
}
