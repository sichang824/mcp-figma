/**
 * Search tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";
import { FigmaUtils } from "../utils/figma-utils.js";

export const searchTextTool = (server: McpServer) => {
  server.tool(
    "search_text",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      search_text: z.string().min(1).describe("The text to search for in the file")
    },
    async ({ file_key, search_text }) => {
      try {
        const file = await figmaApi.getFile(file_key);
        
        // Find all TEXT nodes
        const textNodes = FigmaUtils.getNodesByType(file, 'TEXT');
        
        // Filter for nodes containing the search text
        const matchingNodes = textNodes.filter(node => 
          node.characters && node.characters.toLowerCase().includes(search_text.toLowerCase())
        );
        
        if (matchingNodes.length === 0) {
          return {
            content: [
              { type: "text", text: `No text matching "${search_text}" found in file ${file_key}` }
            ]
          };
        }
        
        const matchesList = matchingNodes.map(node => {
          const path = FigmaUtils.getNodePath(file, node.id);
          return `- **${node.name}** (ID: ${node.id})\n  Path: ${path.join(' > ')}\n  Text: "${node.characters}"`;
        }).join('\n\n');
        
        return {
          content: [
            { type: "text", text: `# Text Search Results for "${search_text}"` },
            { type: "text", text: `Found ${matchingNodes.length} matching text nodes:` },
            { type: "text", text: matchesList }
          ]
        };
      } catch (error) {
        console.error('Error searching text:', error);
        return {
          content: [
            { type: "text", text: `Error searching text: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all search-related tools with the MCP server
 */
export const registerSearchTools = (server: McpServer): void => {
  searchTextTool(server);
};
