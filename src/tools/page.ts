/**
 * Page tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  isPluginConnected,
  sendCommandToPlugin,
} from "../services/websocket.js";

// Define interfaces for page data
interface PageData {
  id: string;
  name: string;
  children?: any[];
  [key: string]: any;
}

export const getPagesTool = (server: McpServer) => {
  server.tool("get_pages", {}, async () => {
    try {
      // Get pages using WebSocket only if plugin is connected
      if (!isPluginConnected()) {
        return {
          content: [
            {
              type: "text",
              text: "No Figma plugin is connected. Please make sure the Figma plugin is running and connected to the MCP server.",
            },
          ],
        };
      }

      const response = await sendCommandToPlugin("get-pages", {});

      if (!response.success) {
        throw new Error(response.error || "Failed to get pages");
      }

      // Process the response to handle different result formats
      const result = response.result || {};
      const pages = result.items || [];
      const pagesCount = result.count || 0;

      // Check if we have pages to display
      if (pagesCount === 0 && !pages.length) {
        return {
          content: [
            { type: "text", text: `# Pages in Figma File` },
            { type: "text", text: `No pages found in the current Figma file.` },
          ],
        };
      }

      return {
        content: [
          { type: "text", text: `# Pages in Figma File` },
          { type: "text", text: `Found ${pagesCount || pages.length} pages:` },
          {
            type: "text",
            text: pages
              .map((page: PageData) => `- ${page.name} (ID: ${page.id})`)
              .join("\n"),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting pages: ${(error as Error).message}`,
          },
        ],
      };
    }
  });
};

export const getPageTool = (server: McpServer) => {
  server.tool(
    "get_page",
    {
      page_id: z.string().min(1).describe("The ID of the page to retrieve").optional(),
    },
    async ({ page_id }) => {
      try {
        // Get page using WebSocket only if plugin is connected
        if (!isPluginConnected()) {
          return {
            content: [
              {
                type: "text",
                text: "No Figma plugin is connected. Please make sure the Figma plugin is running and connected to the MCP server.",
              },
            ],
          };
        }

        // If page_id is not provided, get the current page
        const response = await sendCommandToPlugin("get-page", {
          page_id,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to get page");
        }

        const pageNode = response.result;

        return {
          content: [
            { type: "text", text: `# Page: ${pageNode.name}` },
            { type: "text", text: `ID: ${pageNode.id}` },
            { type: "text", text: `Type: ${pageNode.type}` },
            {
              type: "text",
              text: `Elements: ${pageNode.children?.length || 0}`,
            },
            {
              type: "text",
              text: "```json\n" + JSON.stringify(pageNode, null, 2) + "\n```",
            },
          ],
        };
      } catch (error) {
        console.error("Error fetching page:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error getting page: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
};

export const createPageTool = (server: McpServer) => {
  server.tool(
    "create_page",
    {
      page_name: z.string().min(1).describe("Name for the new page"),
    },
    async ({ page_name }) => {
      try {
        if (!isPluginConnected()) {
          return {
            content: [
              {
                type: "text",
                text: "No Figma plugin is connected. Please make sure the Figma plugin is running and connected to the MCP server.",
              },
            ],
          };
        }

        // Use WebSocket to send command to plugin
        const response = await sendCommandToPlugin("create-page", {
          name: page_name,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to create page");
        }

        return {
          content: [
            {
              type: "text",
              text: `# Page Created Successfully`,
            },
            {
              type: "text",
              text: `A new page named "${page_name}" has been created.`,
            },
            {
              type: "text",
              text:
                response.result && response.result.id
                  ? `Page ID: ${response.result.id}`
                  : `Creation successful`,
            },
          ],
        };
      } catch (error) {
        console.error("Error creating page:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating page: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
};

export const switchPageTool = (server: McpServer) => {
  server.tool(
    "switch_page",
    {
      page_id: z.string().min(1).describe("The ID of the page to switch to"),
    },
    async ({ page_id }) => {
      try {
        if (!isPluginConnected()) {
          return {
            content: [
              {
                type: "text",
                text: "No Figma plugin is connected. Please make sure the Figma plugin is running and connected to the MCP server.",
              },
            ],
          };
        }

        // Use WebSocket to send command to plugin
        const response = await sendCommandToPlugin("switch-page", {
          id: page_id, // Note: plugin expects 'id', not 'page_id'
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to switch page");
        }

        return {
          content: [
            {
              type: "text",
              text: `# Page Switched Successfully`,
            },
            {
              type: "text",
              text: `Successfully switched to page with ID: ${page_id}`,
            },
            {
              type: "text",
              text:
                response.result && response.result.name
                  ? `Current page: ${response.result.name}`
                  : `Switch successful`,
            },
          ],
        };
      } catch (error) {
        console.error("Error switching page:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error switching page: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
};

/**
 * Registers all page-related tools with the MCP server
 */
export const registerPageTools = (server: McpServer): void => {
  getPagesTool(server);
  getPageTool(server);
  createPageTool(server);
  switchPageTool(server);
};
