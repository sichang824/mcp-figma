/**
 * Tool: search_widgets
 * 
 * Searches for widgets that have specific sync data properties and values
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";
import { FigmaUtils } from "../../utils/figma-utils.js";

export const searchWidgetsTool = (server: McpServer) => {
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
};
