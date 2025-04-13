/**
 * Tool: get_widget
 * 
 * Retrieves detailed information about a specific widget node
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";

export const getWidgetTool = (server: McpServer) => {
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
};
