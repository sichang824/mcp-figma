/**
 * Tool: get_widgets
 * 
 * Retrieves all widget nodes from a Figma file
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";
import { FigmaUtils } from "../../utils/figma-utils.js";

export const getWidgetsTool = (server: McpServer) => {
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
};
