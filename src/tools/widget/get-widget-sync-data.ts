/**
 * Tool: get_widget_sync_data
 * 
 * Retrieves the synchronized state data for a specific widget
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";

export const getWidgetSyncDataTool = (server: McpServer) => {
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
};
