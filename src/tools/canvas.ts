/**
 * Canvas Tools - MCP server tools for interacting with Figma canvas elements
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log, logError } from "../utils.js";
import { sendCommandToPlugin, isPluginConnected } from "../services/websocket.js";

/**
 * Register canvas-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerCanvasTools(server: McpServer) {
  // Create a rectangle in Figma
  server.tool(
    "create_rectangle",
    {
      x: z.number().default(100).describe("The X position of the rectangle"),
      y: z.number().default(100).describe("The Y position of the rectangle"),
      width: z
        .number()
        .min(1)
        .default(150)
        .describe("The width of the rectangle in pixels"),
      height: z
        .number()
        .min(1)
        .default(150)
        .describe("The height of the rectangle in pixels"),
      color: z
        .string()
        .default("#ff0000")
        .describe("The fill color (hex code)"),
    },
    async ({ x, y, width, height, color }) => {
      try {
        // Send command to Figma plugin
        const response = await sendCommandToPlugin("create-rectangle", {
          x,
          y,
          width,
          height,
          color,
        }).catch((error: Error) => {
          throw error;
        });

        if (!response.success) {
          throw new Error(response.error || "Unknown error");
        }

        return {
          content: [
            { type: "text", text: `# Rectangle Created Successfully` },
            {
              type: "text",
              text: `A new rectangle has been created in your Figma canvas.`,
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Size: ${width}×${height}px\n- Color: ${color}`,
            },
            {
              type: "text",
              text:
                response.result && response.result.id
                  ? `Node ID: ${response.result.id}`
                  : `Creation successful`,
            },
          ],
        };
      } catch (error: unknown) {
        logError("Error creating rectangle in Figma", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating rectangle: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`,
            },
          ],
        };
      }
    }
  );

  // Create a circle in Figma
  server.tool(
    "create_circle",
    {
      x: z.number().default(100).describe("The X position of the center"),
      y: z.number().default(100).describe("The Y position of the center"),
      width: z
        .number()
        .min(1)
        .default(150)
        .describe("The width of the circle in pixels"),
      height: z
        .number()
        .min(1)
        .default(150)
        .describe("The height of the circle in pixels"),
      color: z
        .string()
        .default("#0000ff")
        .describe("The fill color (hex code)"),
    },
    async ({ x, y, width, height, color }) => {
      try {
        // Send command to Figma plugin
        const response = await sendCommandToPlugin("create-circle", {
          x,
          y,
          width,
          height,
          color,
        }).catch((error: Error) => {
          throw error;
        });

        if (!response.success) {
          throw new Error(response.error || "Unknown error");
        }

        return {
          content: [
            { type: "text", text: `# Circle Created Successfully` },
            {
              type: "text",
              text: `A new circle has been created in your Figma canvas.`,
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Size: ${width}×${height}px\n- Color: ${color}`,
            },
            {
              type: "text",
              text:
                response.result && response.result.id
                  ? `Node ID: ${response.result.id}`
                  : `Creation successful`,
            },
          ],
        };
      } catch (error: unknown) {
        logError("Error creating circle in Figma", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating circle: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`,
            },
          ],
        };
      }
    }
  );

  // Create text in Figma
  server.tool(
    "create_text",
    {
      x: z.number().default(100).describe("The X position of the text"),
      y: z.number().default(100).describe("The Y position of the text"),
      text: z
        .string()
        .min(1)
        .default("Hello Figma!")
        .describe("The text content"),
      fontSize: z
        .number()
        .min(1)
        .default(24)
        .describe("The font size in pixels"),
    },
    async ({ x, y, text, fontSize }) => {
      try {
        // Send command to Figma plugin
        const response = await sendCommandToPlugin("create-text", {
          x,
          y,
          text,
          fontSize,
        }).catch((error: Error) => {
          throw error;
        });

        if (!response.success) {
          throw new Error(response.error || "Unknown error");
        }

        return {
          content: [
            { type: "text", text: `# Text Created Successfully` },
            {
              type: "text",
              text: `New text has been created in your Figma canvas.`,
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Font Size: ${fontSize}px\n- Content: "${text}"`,
            },
            {
              type: "text",
              text:
                response.result && response.result.id
                  ? `Node ID: ${response.result.id}`
                  : `Creation successful`,
            },
          ],
        };
      } catch (error: unknown) {
        logError("Error creating text in Figma", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating text: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`,
            },
          ],
        };
      }
    }
  );

  // Get current selection in Figma
  server.tool("get_selection", {}, async () => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("get-selection", {}).catch(
        (error: Error) => {
          throw error;
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Current Selection` },
          {
            type: "text",
            text: `Information about currently selected elements in Figma:`,
          },
          {
            type: "text",
            text: response.result
              ? JSON.stringify(response.result, null, 2)
              : "No selection information available",
          },
        ],
      };
    } catch (error: unknown) {
      logError("Error getting selection in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting selection: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
          {
            type: "text",
            text: `Make sure the Figma plugin is running and connected to the MCP server.`,
          },
        ],
      };
    }
  });

  // Check plugin connection status
  server.tool("check_connection", {}, async () => {
    return {
      content: [
        { type: "text", text: `# Figma Plugin Connection Status` },
        {
          type: "text",
          text: isPluginConnected()
            ? `✅ Figma plugin is connected to MCP server`
            : `❌ No Figma plugin is currently connected`,
        },
        {
          type: "text",
          text: isPluginConnected()
            ? `You can now use MCP tools to interact with the Figma canvas.`
            : `Please make sure the Figma plugin is running and connected to the MCP server.`,
        },
      ],
    };
  });
}
