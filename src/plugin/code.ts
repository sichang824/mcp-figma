/**
 * Figma MCP Plugin
 * Allows manipulating elements on canvas through MCP tools
 */

// Import modules
import {
  createElementFromData,
  createElementsFromDataArray,
} from "./creators/elementCreator";
import { createCircle, createRectangle } from "./creators/shapeCreators";
import { createText } from "./creators/textCreator";
import { hexToRgb } from "./utils/colorUtils";
import { buildResultObject } from "./utils/nodeUtils";

// Show plugin UI
figma.showUI(__html__, { width: 300, height: 450 });

// Handle messages from UI
figma.ui.onmessage = function (msg) {
  // Handle different types of messages
  if (msg.type === "create-rectangle") {
    createRectangle(
      msg.x || 100,
      msg.y || 100,
      msg.width || 150,
      msg.height || 150,
      msg.color || "#ff0000"
    );
  } else if (msg.type === "create-circle") {
    createCircle(
      msg.x || 100,
      msg.y || 100,
      msg.width || 150,
      msg.height || 150,
      msg.color || "#0000ff"
    );
  } else if (msg.type === "create-text") {
    createText(
      msg.x || 100,
      msg.y || 100,
      msg.text || "Hello Figma!",
      msg.fontSize || 24
    );
  } else if (msg.type === "create-element") {
    // Unified create element method
    createElementFromData(msg.data);
  } else if (msg.type === "create-elements") {
    // Create multiple elements at once
    createElementsFromDataArray(msg.data);
  } else if (msg.type === "mcp-command") {
    // Handle commands from MCP tool via UI
    handleMcpCommand(msg.command, msg.params);
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

// Handle MCP commands
async function handleMcpCommand(command: string, params: any) {
  let result: SceneNode | readonly SceneNode[] | null = null;

  try {
    switch (command) {
      case "create-rectangle":
        result = createRectangle(
          params.x || 100,
          params.y || 100,
          params.width || 150,
          params.height || 150,
          params.color || "#ff0000"
        );
        break;

      case "create-circle":
        result = createCircle(
          params.x || 100,
          params.y || 100,
          params.width || 150,
          params.height || 150,
          params.color || "#0000ff"
        );
        break;

      case "create-text":
        result = await createText(
          params.x || 100,
          params.y || 100,
          params.text || "Hello from MCP!",
          params.fontSize || 24
        );
        break;

      case "create-element":
        result = await createElementFromData(params);
        break;

      case "create-elements":
        result = await createElementsFromDataArray(params);
        break;

      case "get-selection":
        result = figma.currentPage.selection;
        break;

      case "modify-rectangle":
        if (!params.id) throw new Error("Rectangle ID is required");
        const node = figma.getNodeById(params.id);
        if (!node || node.type !== "RECTANGLE")
          throw new Error("Invalid rectangle ID");

        const rect = node as RectangleNode;
        if (params.x !== undefined) rect.x = params.x;
        if (params.y !== undefined) rect.y = params.y;
        if (params.width !== undefined && params.height !== undefined)
          rect.resize(params.width, params.height);
        if (params.cornerRadius !== undefined)
          rect.cornerRadius = params.cornerRadius;
        if (params.color)
          rect.fills = [{ type: "SOLID", color: hexToRgb(params.color) }];

        result = rect;
        break;

      default:
        throw new Error("Unknown command: " + command);
    }

    // Build result object, avoiding possible null values
    const resultObject = buildResultObject(result);

    // Send success response to UI
    figma.ui.postMessage({
      type: "mcp-response",
      success: true,
      command: command,
      result: resultObject,
    });

    return resultObject;
  } catch (error) {
    // Send error response to UI
    figma.ui.postMessage({
      type: "mcp-response",
      success: false,
      command: command,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
}
