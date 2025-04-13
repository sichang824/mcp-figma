/**
 * Component tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getComponentsTool = (server: McpServer) => {
  server.tool(
    "get_components",
    {
      file_key: z.string().min(1).describe("The Figma file key")
    },
    async ({ file_key }) => {
      try {
        const componentsResponse = await figmaApi.getFileComponents(file_key);
        
        if (!componentsResponse.meta?.components || componentsResponse.meta.components.length === 0) {
          return {
            content: [
              { type: "text", text: `No components found in file ${file_key}` }
            ]
          };
        }
        
        const componentsList = componentsResponse.meta.components.map(component => {
          return `- **${component.name}** (Key: ${component.key})\n  Description: ${component.description || 'No description'}\n  ${component.remote ? '(Remote component)' : '(Local component)'}`;
        }).join('\n\n');
        
        return {
          content: [
            { type: "text", text: `# Components in file ${file_key}` },
            { type: "text", text: `Found ${componentsResponse.meta.components.length} components:` },
            { type: "text", text: componentsList }
          ]
        };
      } catch (error) {
        console.error('Error fetching components:', error);
        return {
          content: [
            { type: "text", text: `Error getting components: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all component-related tools with the MCP server
 */
export const registerComponentTools = (server: McpServer): void => {
  getComponentsTool(server);
};
