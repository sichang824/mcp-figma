/**
 * Canvas Tools - MCP server tools for interacting with Figma canvas elements
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  isPluginConnected,
  sendCommandToPlugin,
} from "../services/websocket.js";
import { logError } from "../utils.js";
import {
  arcParams,
  elementParams,
  elementsParams,
  ellipseParams,
  lineParams,
  polygonParams,
  rectangleParams,
  starParams,
  textParams,
  vectorParams,
} from "./zod-schemas.js";

/**
 * Register canvas-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerCanvasTools(server: McpServer) {
  // Create a rectangle in Figma
  server.tool("create_rectangle", rectangleParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin(
        "create-rectangle",
        params
      ).catch((error: Error) => {
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
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Color: ${params.color}`,
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
  });

  // Create a circle in Figma
  server.tool("create_circle", ellipseParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("create-circle", params).catch(
        (error: Error) => {
          throw error;
        }
      );

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
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Color: ${params.color}`,
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
  });

  // Create an arc (partial ellipse) in Figma
  server.tool("create_arc", arcParams, async (params) => {
    try {
      // Prepare parameters for the plugin
      const arcParams = {
        ...params,
        startAngle: params.startAngle,
        endAngle: params.endAngle,
        innerRadius: params.innerRadius,
      };

      // Send command to Figma plugin
      const response = await sendCommandToPlugin("create-arc", arcParams).catch(
        (error: Error) => {
          throw error;
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Arc Created Successfully` },
          {
            type: "text",
            text: `A new arc has been created in your Figma canvas.`,
          },
          {
            type: "text",
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Angles: ${params.startAngle}° to ${params.endAngle}°\n- Inner radius: ${params.innerRadius}\n- Color: ${params.color}`,
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
      logError("Error creating arc in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating arc: ${
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

  // Create a polygon in Figma
  server.tool("create_polygon", polygonParams, async (params) => {
    try {
      // Prepare parameters for the plugin
      const polygonParams = {
        ...params,
        pointCount: params.pointCount,
      };

      // Send command to Figma plugin
      const response = await sendCommandToPlugin(
        "create-polygon",
        polygonParams
      ).catch((error: Error) => {
        throw error;
      });

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Polygon Created Successfully` },
          {
            type: "text",
            text: `A new polygon has been created in your Figma canvas.`,
          },
          {
            type: "text",
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Sides: ${params.pointCount}\n- Color: ${params.color}`,
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
      logError("Error creating polygon in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating polygon: ${
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

  // Create a star in Figma
  server.tool("create_star", starParams, async (params) => {
    try {
      // Prepare parameters for the plugin
      const starParams = {
        ...params,
        pointCount: params.pointCount,
        innerRadius: params.innerRadius,
      };

      // Send command to Figma plugin
      const response = await sendCommandToPlugin(
        "create-star",
        starParams
      ).catch((error: Error) => {
        throw error;
      });

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Star Created Successfully` },
          {
            type: "text",
            text: `A new star has been created in your Figma canvas.`,
          },
          {
            type: "text",
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Points: ${params.pointCount}\n- Inner Radius: ${params.innerRadius}\n- Color: ${params.color}`,
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
      logError("Error creating star in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating star: ${
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

  // Create a vector in Figma
  server.tool("create_vector", vectorParams, async (params) => {
    try {
      // Prepare parameters for the plugin
      const vectorParams = {
        ...params,
        vectorNetwork: params.vectorNetwork,
        vectorPaths: params.vectorPaths,
        handleMirroring: params.handleMirroring,
      };

      // Send command to Figma plugin
      const response = await sendCommandToPlugin(
        "create-vector",
        vectorParams
      ).catch((error: Error) => {
        throw error;
      });

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Vector Created Successfully` },
          {
            type: "text",
            text: `A new vector has been created in your Figma canvas.`,
          },
          {
            type: "text",
            text: `- Position: (${params.x}, ${params.y})\n- Size: ${params.width}×${params.height}px\n- Color: ${params.color}`,
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
      logError("Error creating vector in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating vector: ${
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

  // Create a line in Figma
  server.tool("create_line", lineParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("create-line", params).catch(
        (error: Error) => {
          throw error;
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      return {
        content: [
          { type: "text", text: `# Line Created Successfully` },
          {
            type: "text",
            text: `A new line has been created in your Figma canvas.`,
          },
          {
            type: "text",
            text: `- Position: (${params.x}, ${params.y})\n- Length: ${params.width}px\n- Color: ${params.color}`,
          },
          {
            type: "text",
            text: `- Rotation: ${params.rotation || 0}°`,
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
      logError("Error creating line in Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating line: ${
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

  // Create text in Figma
  server.tool("create_text", textParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("create-text", params).catch(
        (error: Error) => {
          throw error;
        }
      );

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
            text: `- Position: (${params.x}, ${params.y})\n- Font Size: ${params.fontSize}px\n- Content: "${params.text}"`,
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
  });

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

  // Get all elements from current page or specified page
  server.tool("get_elements", elementsParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("get-elements", params).catch(
        (error: Error) => {
          throw error;
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      const elements = response.result;
      const count = Array.isArray(elements) ? elements.length : 0;
      const typeValue = params.type || "ALL";
      const pageName = params.page_id ? `specified page` : "current page";

      return {
        content: [
          { type: "text", text: `# Elements Retrieved` },
          {
            type: "text",
            text: `Found ${count} element${
              count !== 1 ? "s" : ""
            } of type ${typeValue} on ${pageName}.`,
          },
          {
            type: "text",
            text:
              count > 0
                ? `Element information: ${JSON.stringify(elements, null, 2)}`
                : "No elements matched your criteria.",
          },
        ],
      };
    } catch (error: unknown) {
      logError("Error getting elements from Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving elements: ${
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

  // Get a specific element by ID
  server.tool("get_element", elementParams, async (params) => {
    try {
      // Send command to Figma plugin
      const response = await sendCommandToPlugin("get-element", params).catch(
        (error: Error) => {
          throw error;
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      const element = response.result;
      const isArray = Array.isArray(element);
      const hasChildren = isArray && element.length > 1;

      return {
        content: [
          { type: "text", text: `# Element Retrieved` },
          {
            type: "text",
            text: `Successfully retrieved element with ID: ${params.node_id}`,
          },
          {
            type: "text",
            text: hasChildren
              ? `Element and ${element.length - 1} children retrieved.`
              : `Element information:`,
          },
          {
            type: "text",
            text: JSON.stringify(element, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      logError("Error getting element from Figma", error);
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving element: ${
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
}
