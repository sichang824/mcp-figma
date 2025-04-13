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
figma.showUI(__html__, { width: 320, height: 500 });

// Log that the plugin has loaded
console.log("Figma MCP Plugin loaded");

// Handle messages from UI
figma.ui.onmessage = function (msg) {
  console.log("Received message from UI:", msg);
  
  // Handle different types of messages
  if (msg.type === "create-rectangle") {
    console.log("Creating rectangle with params:", msg);
    createRectangle(
      msg.x || 100,
      msg.y || 100,
      msg.width || 150,
      msg.height || 150,
      msg.color || "#ff0000"
    );
  } else if (msg.type === "create-circle") {
    console.log("Creating circle with params:", msg);
    createCircle(
      msg.x || 100,
      msg.y || 100,
      msg.width || 150,
      msg.height || 150,
      msg.color || "#0000ff"
    );
  } else if (msg.type === "create-text") {
    console.log("Creating text with params:", msg);
    createText(
      msg.x || 100,
      msg.y || 100,
      msg.text || "Hello Figma!",
      msg.fontSize || 24
    );
  } else if (msg.type === "create-element") {
    // Unified create element method
    console.log("Creating element with data:", msg.data);
    createElementFromData(msg.data);
  } else if (msg.type === "create-elements") {
    // Create multiple elements at once
    console.log("Creating multiple elements with data:", msg.data);
    createElementsFromDataArray(msg.data);
  } else if (msg.type === "mcp-command") {
    // Handle commands from MCP tool via UI
    console.log("Received MCP command:", msg.command, "with params:", msg.params);
    handleMcpCommand(msg.command, msg.params);
  } else if (msg.type === "cancel") {
    console.log("Closing plugin");
    figma.closePlugin();
  } else {
    console.log("Unknown message type:", msg.type);
  }
};

// Handle MCP commands
async function handleMcpCommand(command: string, params: any) {
  let result: SceneNode | readonly SceneNode[] | null = null;

  try {
    switch (command) {
      case "create-rectangle":
        console.log("MCP command: Creating rectangle with params:", params);
        result = createRectangle(
          params.x || 100,
          params.y || 100,
          params.width || 150,
          params.height || 150,
          params.color || "#ff0000"
        );
        break;

      case "create-circle":
        console.log("MCP command: Creating circle with params:", params);
        result = createCircle(
          params.x || 100,
          params.y || 100,
          params.width || 150,
          params.height || 150,
          params.color || "#0000ff"
        );
        break;

      case "create-text":
        console.log("MCP command: Creating text with params:", params);
        result = await createText(
          params.x || 100,
          params.y || 100,
          params.text || "Hello from MCP!",
          params.fontSize || 24
        );
        break;

      case "create-element":
        console.log("MCP command: Creating element with params:", params);
        result = await createElementFromData(params);
        break;

      case "create-elements":
        console.log("MCP command: Creating multiple elements with params:", params);
        result = await createElementsFromDataArray(params);
        break;

      case "get-selection":
        console.log("MCP command: Getting current selection");
        result = figma.currentPage.selection;
        break;

      case "modify-rectangle":
        console.log("MCP command: Modifying rectangle with ID:", params.id);
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
        console.log("Unknown MCP command:", command);
        throw new Error("Unknown command: " + command);
    }

    // Build result object, avoiding possible null values
    const resultObject = buildResultObject(result);
    console.log("Command result:", resultObject);

    // Send success response to UI
    figma.ui.postMessage({
      type: "mcp-response",
      success: true,
      command: command,
      result: resultObject,
    });
    console.log("Response sent to UI");

    return resultObject;
  } catch (error) {
    console.error("Error handling MCP command:", error);
    
    // Send error response to UI
    figma.ui.postMessage({
      type: "mcp-response",
      success: false,
      command: command,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    console.log("Error response sent to UI");

    throw error;
  }
}
