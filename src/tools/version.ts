/**
 * Version tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getFileVersionsTool = (server: McpServer) => {
  server.tool(
    "get_file_versions",
    {
      file_key: z.string().min(1).describe("The Figma file key")
    },
    async ({ file_key }) => {
      try {
        const versionsResponse = await figmaApi.getFileVersions(file_key);
        
        if (!versionsResponse.versions || versionsResponse.versions.length === 0) {
          return {
            content: [
              { type: "text", text: `No versions found for file ${file_key}` }
            ]
          };
        }
        
        const versionsList = versionsResponse.versions.map((version, index) => {
          return `${index + 1}. **${version.label || 'Unnamed version'}** - ${new Date(version.created_at).toLocaleString()} by ${version.user.handle}\n   ${version.description || 'No description'}`;
        }).join('\n\n');
        
        return {
          content: [
            { type: "text", text: `# File Versions for ${file_key}` },
            { type: "text", text: `Found ${versionsResponse.versions.length} versions:` },
            { type: "text", text: versionsList }
          ]
        };
      } catch (error) {
        console.error('Error fetching file versions:', error);
        return {
          content: [
            { type: "text", text: `Error getting file versions: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all version-related tools with the MCP server
 */
export const registerVersionTools = (server: McpServer): void => {
  getFileVersionsTool(server);
};
