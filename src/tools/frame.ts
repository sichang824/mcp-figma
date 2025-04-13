/**
 * Frame Tools - MCP server tools for working with Figma Frame components
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";
import { FigmaUtils } from "../utils/figma-utils.js";

/**
 * Register frame-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerFrameTools(server: McpServer) {
  // Get Frame component documentation
  server.tool("get_frame_documentation", {}, async () => {
    try {
      // Frame component documentation based on the provided text
      return {
        content: [
          { type: "text", text: "# Frame Component Documentation" },
          {
            type: "text",
            text: "Frame acts exactly like a non-autolayout Frame within Figma, where children are positioned using x and y constraints. This component is useful to define a layout hierarchy.",
          },
          {
            type: "text",
            text: "If you want to use autolayout, use AutoLayout instead.",
          },
          { type: "text", text: "## BaseProps" },
          {
            type: "text",
            text: "- **name**: string - The name of the component",
          },
          {
            type: "text",
            text: "- **hidden**: boolean - Toggles whether to show the component",
          },
          {
            type: "text",
            text: "- **onClick**: (event: WidgetClickEvent) => Promise<any> | void - Attach a click handler",
          },
          {
            type: "text",
            text: "- **key**: string | number - The key of the component",
          },
          {
            type: "text",
            text: "- **hoverStyle**: HoverStyle - The style to be applied when hovering",
          },
          {
            type: "text",
            text: "- **tooltip**: string - The tooltip shown when hovering",
          },
          {
            type: "text",
            text: "- **positioning**: 'auto' | 'absolute' - How to position the node inside an AutoLayout parent",
          },
          { type: "text", text: "## BlendProps" },
          {
            type: "text",
            text: "- **blendMode**: BlendMode - The blendMode of the component",
          },
          {
            type: "text",
            text: "- **opacity**: number - The opacity of the component",
          },
          {
            type: "text",
            text: "- **effect**: Effect | Effect[] - The effect of the component",
          },
          { type: "text", text: "## ConstraintProps" },
          {
            type: "text",
            text: "- **x**: number | HorizontalConstraint - The x position of the node",
          },
          {
            type: "text",
            text: "- **y**: number | VerticalConstraint - The y position of the node",
          },
          {
            type: "text",
            text: "- **overflow**: 'visible' | 'hidden' | 'scroll' - The overflow behavior",
          },
          { type: "text", text: "## SizeProps (Required)" },
          {
            type: "text",
            text: "- **width**: Size - The width of the component (required)",
          },
          {
            type: "text",
            text: "- **height**: Size - The height of the component (required)",
          },
          { type: "text", text: "- **minWidth**: number - The minimum width" },
          { type: "text", text: "- **maxWidth**: number - The maximum width" },
          {
            type: "text",
            text: "- **minHeight**: number - The minimum height",
          },
          {
            type: "text",
            text: "- **maxHeight**: number - The maximum height",
          },
          {
            type: "text",
            text: "- **rotation**: number - The rotation in degrees (-180 to 180)",
          },
          { type: "text", text: "## CornerProps" },
          {
            type: "text",
            text: "- **cornerRadius**: CornerRadius - The corner radius in pixels",
          },
          { type: "text", text: "## GeometryProps" },
          {
            type: "text",
            text: "- **fill**: HexCode | Color | Paint | (SolidPaint | GradientPaint)[] - The fill paints",
          },
          {
            type: "text",
            text: "- **stroke**: HexCode | Color | SolidPaint | GradientPaint | (SolidPaint | GradientPaint)[] - The stroke paints",
          },
          {
            type: "text",
            text: "- **strokeWidth**: number - The stroke thickness in pixels",
          },
          {
            type: "text",
            text: "- **strokeAlign**: StrokeAlign - The stroke alignment",
          },
          {
            type: "text",
            text: "- **strokeDashPattern**: number[] - The stroke dash pattern",
          },
        ],
      };
    } catch (error) {
      console.error("Error retrieving Frame documentation:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting Frame documentation: ${
              (error as Error).message
            }`,
          },
        ],
      };
    }
  });

  // Create a new frame widget
  server.tool(
    "create_frame_widget",
    {
      name: z
        .string()
        .min(1)
        .describe("The name for the widget containing frames"),
      width: z.number().min(1).describe("The width of the frame"),
      height: z.number().min(1).describe("The height of the frame"),
      fill: z.string().optional().describe("The fill color (hex code)"),
    },
    async ({ name, width, height, fill }) => {
      try {
        // Create a sample widget code with Frame component
        const widgetCode = `
// ${name} - Figma Widget with Frame Component
const { widget } = figma;
const { Frame, Text } = widget;

function ${name.replace(/\\s+/g, "")}Widget() {
  return (
    <Frame
      name="${name}"
      width={${width}}
      height={${height}}
      fill={${fill ? `"${fill}"` : "[]"}}
      stroke="#E0E0E0"
      strokeWidth={1}
      cornerRadius={8}
    >
      <Text
        x={20}
        y={20}
        width={${width - 40}}
        horizontalAlignText="center"
        fill="#000000"
      >
        Frame Widget Example
      </Text>
    </Frame>
  );
}

widget.register(${name.replace(/\\s+/g, "")}Widget);
`;

        return {
          content: [
            { type: "text", text: `# Frame Widget Code` },
            {
              type: "text",
              text: `The following code creates a widget using the Frame component:`,
            },
            { type: "text", text: "```jsx\n" + widgetCode + "\n```" },
            { type: "text", text: `## Instructions` },
            { type: "text", text: `1. Create a new widget in Figma` },
            {
              type: "text",
              text: `2. Copy and paste this code into the widget code editor`,
            },
            {
              type: "text",
              text: `3. Customize the content inside the Frame as needed`,
            },
          ],
        };
      } catch (error) {
        console.error("Error generating frame widget code:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error generating frame widget code: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Create a frame directly in Figma file
  server.tool(
    "create_frame_in_figma",
    {
      file_key: z
        .string()
        .min(1)
        .describe("The Figma file key where the frame will be created"),
      page_id: z
        .string()
        .optional()
        .describe("The page ID where the frame will be created (optional)"),
      name: z
        .string()
        .min(1)
        .describe("The name for the new frame"),
      width: z.number().min(1).describe("The width of the frame in pixels"),
      height: z.number().min(1).describe("The height of the frame in pixels"),
      x: z.number().default(0).describe("The X position of the frame (default: 0)"),
      y: z.number().default(0).describe("The Y position of the frame (default: 0)"),
      fill_color: z.string().optional().describe("The fill color (hex code)"),
    },
    async ({ file_key, page_id, name, width, height, x, y, fill_color }) => {
      try {
        // Create a frame in Figma using the Figma API
        const createFrameResponse = await figmaApi.createFrame(file_key, {
          name,
          width,
          height, 
          x,
          y,
          fills: fill_color ? [{ type: "SOLID", color: hexToRgb(fill_color), opacity: 1 }] : [],
          pageId: page_id
        });
        
        return {
          content: [
            { type: "text", text: `# Frame Created Successfully` },
            { 
              type: "text", 
              text: `A new frame named "${name}" has been created in your Figma file.` 
            },
            {
              type: "text",
              text: `- Width: ${width}px\n- Height: ${height}px\n- Position: (${x}, ${y})`
            },
            {
              type: "text",
              text: `Frame ID: ${createFrameResponse.frame.id}`
            },
            { 
              type: "text", 
              text: `You can now view and edit this frame in your Figma file.` 
            }
          ],
        };
      } catch (error) {
        console.error("Error creating frame in Figma:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating frame in Figma: ${
                (error as Error).message
              }`,
            },
            {
              type: "text",
              text: "Please make sure you have write access to the file and the file key is correct."
            }
          ],
        };
      }
    }
  );

  // Get all frames in a file
  server.tool(
    "get_frames",
    {
      file_key: z
        .string()
        .min(1)
        .describe("The Figma file key to retrieve frames from"),
    },
    async ({ file_key }) => {
      try {
        const file = await figmaApi.getFile(file_key);

        // Find all frame nodes in the file
        const frameNodes = FigmaUtils.getNodesByType(file, "FRAME");

        if (frameNodes.length === 0) {
          return {
            content: [
              { type: "text", text: `No frames found in file ${file_key}` },
            ],
          };
        }

        const framesList = frameNodes
          .map((node, index) => {
            // Add type assertion for frame nodes
            const frameNode = node as {
              id: string;
              name: string; 
              width?: number;
              height?: number;
              children?: Array<any>;
            };
            
            return `${index + 1}. **${frameNode.name}** (ID: ${frameNode.id})
   - Width: ${frameNode.width || "Unknown"}, Height: ${frameNode.height || "Unknown"}
   - Children: ${frameNode.children?.length || 0}`;
          })
          .join("\n\n");

        return {
          content: [
            { type: "text", text: `# Frames in file ${file_key}` },
            { type: "text", text: `Found ${frameNodes.length} frames:` },
            { type: "text", text: framesList },
          ],
        };
      } catch (error) {
        console.error("Error fetching frames:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error getting frames: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
}

/**
 * Convert hex color code to RGB values
 * @param hex Hex color code (e.g., #RRGGBB or #RGB)
 * @returns RGB color object with r, g, b values between 0 and 1
 */
function hexToRgb(hex: string) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  let r, g, b;
  if (hex.length === 3) {
    // Convert 3-digit hex to 6-digit
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  
  return { r, g, b };
}
