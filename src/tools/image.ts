/**
 * Image tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getImagesTool = (server: McpServer) => {
  server.tool(
    "get_images",
    {
      file_key: z.string().min(1).describe("The Figma file key"),
      node_ids: z.array(z.string()).min(1).describe("The IDs of nodes to export as images"),
      format: z.enum(["jpg", "png", "svg", "pdf"]).default("png").describe("Image format to export"),
      scale: z.number().min(0.01).max(4).default(1).describe("Scale factor for the image (0.01 to 4)")
    },
    async ({ file_key, node_ids, format, scale }) => {
      try {
        const imagesResponse = await figmaApi.getImages(file_key, node_ids, {
          format,
          scale
        });
        
        if (imagesResponse.err) {
          return {
            content: [
              { type: "text", text: `Error getting images: ${imagesResponse.err}` }
            ]
          };
        }
        
        const imageUrls = Object.entries(imagesResponse.images)
          .map(([nodeId, url]) => {
            if (!url) {
              return `- ${nodeId}: Error generating image`;
            }
            return `- ${nodeId}: [Image URL](${url})`;
          })
          .join('\n');
        
        return {
          content: [
            { type: "text", text: `# Images for file ${file_key}` },
            { type: "text", text: `Format: ${format}, Scale: ${scale}` },
            { type: "text", text: imageUrls }
          ]
        };
      } catch (error) {
        console.error('Error fetching images:', error);
        return {
          content: [
            { type: "text", text: `Error getting images: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};

/**
 * Registers all image-related tools with the MCP server
 */
export const registerImageTools = (server: McpServer): void => {
  getImagesTool(server);
};
