/**
 * Node tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getNodeTool = (server: McpServer) => {
  server.tool(
    "get_node",
    {
      file_key: z.string().min(1).describe("The Figma file key to retrieve from"),
      node_id: z.string().min(1).describe("The ID of the node to retrieve")
    },
    async ({ file_key, node_id }) => {
      try {
        const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
        const nodeData = fileNodes.nodes[node_id];
        
        if (!nodeData) {
          return {
            content: [
              { type: "text", text: `Node ${node_id} not found in file ${file_key}` }
            ]
          };
        }
        
        return {
          content: [
            { type: "text", text: `# Node: ${nodeData.document.name}` },
            { type: "text", text: `Type: ${nodeData.document.type}` },
            { type: "text", text: `ID: ${nodeData.document.id}` },
            { type: "text", text: `Children: ${nodeData.document.children?.length || 0}` },
            { type: "text", text: "```json\n" + JSON.stringify(nodeData.document, null, 2) + "\n```" }
          ]
        };
      } catch (error) {
        console.error('Error fetching node:', error);
        return {
          content: [
            { type: "text", text: `Error getting node: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all node-related tools with the MCP server
 */
export const registerNodeTools = (server: McpServer): void => {
  getNodeTool(server);
};
