/**
 * Tool: analyze_widget_structure
 * 
 * Provides a detailed analysis of a widget's structure and properties
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../../services/figma-api.js";

export const analyzeWidgetStructureTool = (server: McpServer) => {
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
};
