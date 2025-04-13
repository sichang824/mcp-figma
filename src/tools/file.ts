/**
 * File tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getFileTool = (server: McpServer) => {
  server.tool(
    "get_file",
    {
      file_key: z.string().min(1).describe("The Figma file key to retrieve"),
      return_full_file: z.boolean().default(false).describe("Whether to return the full file contents or just a summary")
    },
    async ({ file_key, return_full_file }) => {
      try {
        const file = await figmaApi.getFile(file_key);
        
        if (return_full_file) {
          return {
            content: [
              { type: "text", text: `Retrieved Figma file: ${file.name}` },
              { type: "text", text: JSON.stringify(file, null, 2) }
            ]
          };
        } else {
          return {
            content: [
              { type: "text", text: `# Figma File: ${file.name}` },
              { type: "text", text: `Last modified: ${file.lastModified}` },
              { type: "text", text: `Document contains ${file.document.children?.length || 0} top-level nodes.` },
              { type: "text", text: `Components: ${Object.keys(file.components).length || 0}` },
              { type: "text", text: `Component sets: ${Object.keys(file.componentSets).length || 0}` },
              { type: "text", text: `Styles: ${Object.keys(file.styles).length || 0}` }
            ]
          };
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        return {
          content: [
            { type: "text", text: `Error getting Figma file: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all file-related tools with the MCP server
 */
export const registerFileTools = (server: McpServer): void => {
  getFileTool(server);
};
