/**
 * Figma MCP Plugin
 * Allows manipulating elements on canvas through MCP tools
 */

// Import modules
import {
  createElementFromData,
  createElementsFromDataArray,
} from "./creators/elementCreator";
import {
  createEllipseFromData,
  createLineFromData,
  createPolygonFromData,
  createRectangleFromData,
  createStarFromData,
  createVectorFromData
} from "./creators/shapeCreators";
import { createTextFromData } from "./creators/textCreator";
import { hexToRgb } from "./utils/colorUtils";
import { buildResultObject, selectAndFocusNodes } from "./utils/nodeUtils";

// Show plugin UI
figma.showUI(__html__, { width: 320, height: 500 });

// Log that the plugin has loaded
console.log("Figma MCP Plugin loaded");

// Element creator mapping
type ElementCreator = (params: any) => SceneNode | Promise<SceneNode>;

const elementCreators: Record<string, ElementCreator> = {
  "create-rectangle": createRectangleFromData,
  "create-circle": createEllipseFromData,
  "create-ellipse": createEllipseFromData,
  "create-polygon": createPolygonFromData,
  "create-line": createLineFromData,
  "create-text": createTextFromData,
  "create-star": createStarFromData,
  "create-vector": createVectorFromData,
  "create-arc": (params: any) => {
    const ellipse = createEllipseFromData(params);
    if (params.arcData || (params.startAngle !== undefined && params.endAngle !== undefined)) {
      ellipse.arcData = {
        startingAngle: params.startAngle || params.arcData.startingAngle || 0,
        endingAngle: params.endAngle || params.arcData.endingAngle || 360,
        innerRadius: params.innerRadius || params.arcData.innerRadius || 0
      };
    }
    return ellipse;
  }
};

// Generic element creation function
async function createElement(type: string, params: any): Promise<SceneNode | null> {
  console.log(`Creating ${type} with params:`, params);
  
  // Get the creator function
  const creator = elementCreators[type];
  if (!creator) {
    console.error(`Unknown element type: ${type}`);
    return null;
  }
  
  try {
    // Create the element (handle both synchronous and asynchronous creators)
    const element = await Promise.resolve(creator(params));
    
    // Set position if provided
    if (element && params) {
      if (params.x !== undefined) element.x = params.x;
      if (params.y !== undefined) element.y = params.y;
    }
    
    // Select and focus the element
    if (element) {
      selectAndFocusNodes(element);
    }
    
    return element;
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return null;
  }
}

// Handle messages from UI
figma.ui.onmessage = async function (msg) {
  console.log("Received message from UI:", msg);

  // Handle different types of messages
  if (elementCreators[msg.type]) {
    // Element creation messages
    await createElement(msg.type, msg);
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
    console.log(
      "Received MCP command:",
      msg.command,
      "with params:",
      msg.params
    );
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
  let result:
    | SceneNode
    | PageNode
    | readonly SceneNode[]
    | readonly PageNode[]
    | null = null;

  try {
    // Convert command format from mcp (create_rectangle) to plugin (create-rectangle)
    const pluginCommand = command.replace(/_/g, '-');
    
    switch (pluginCommand) {
      case "create-rectangle":
      case "create-circle":
      case "create-polygon":
      case "create-line":
      case "create-arc":
      case "create-vector":
        console.log(`MCP command: Creating ${pluginCommand.substring(7)} with params:`, params);
        result = await createElement(pluginCommand, params);
        break;

      case "create-text":
        console.log("MCP command: Creating text with params:", params);
        result = await createElement(pluginCommand, params);
        break;

      case "create-element":
        console.log("MCP command: Creating element with params:", params);
        result = await createElementFromData(params);
        break;

      case "create-elements":
        console.log(
          "MCP command: Creating multiple elements with params:",
          params
        );
        result = await createElementsFromDataArray(params);
        break;

      case "get-selection":
        console.log("MCP command: Getting current selection");
        result = figma.currentPage.selection;
        break;

      case "get-elements":
        console.log("MCP command: Getting elements with params:", params);
        const page = params.page_id 
          ? (figma.getNodeById(params.page_id) as PageNode) 
          : figma.currentPage;
          
        if (!page || page.type !== "PAGE") {
          throw new Error("Invalid page ID or node is not a page");
        }
        
        const nodeType = params.type || "ALL";
        const limit = params.limit || 100;
        const includeHidden = params.include_hidden || false;
        
        if (nodeType === "ALL") {
          // Get all nodes, filtered by visibility if needed
          result = includeHidden 
            ? page.children.slice(0, limit) 
            : page.children.filter(node => node.visible).slice(0, limit);
        } else {
          // Filter by node type and visibility
          result = page.findAll(node => {
            const typeMatch = node.type === nodeType;
            const visibilityMatch = includeHidden || node.visible;
            return typeMatch && visibilityMatch;
          }).slice(0, limit);
        }
        break;
        
      case "get-element":
        console.log("MCP command: Getting element with ID:", params.node_id);
        const node = figma.getNodeById(params.node_id);
        
        if (!node) {
          throw new Error("Element not found with ID: " + params.node_id);
        }
        
        // Check if the node is a valid type for our result
        if (!['DOCUMENT', 'PAGE'].includes(node.type)) {
          // For scene nodes with children, include children if requested
          if (params.include_children && 'children' in node) {
            result = [node as SceneNode, ...((node as any).children || [])];
          } else {
            result = node as SceneNode;
          }
        } else if (node.type === 'PAGE') {
          // Handle page nodes specially
          result = node as PageNode;
        } else {
          // For document or other unsupported node types
          throw new Error("Unsupported node type: " + node.type);
        }
        break;

      case "get-pages":
        console.log("MCP command: Getting all pages");
        result = figma.root.children;
        break;

      case "get-page":
        console.log("MCP command: Getting page with ID:", params.page_id);
        if (!params.page_id) {
          // If no page_id is provided, use the current page
          console.log("No page_id provided, using current page");
          result = figma.currentPage;
        } else {
          // If page_id is provided, find the page by ID
          const pageNode = figma.getNodeById(params.page_id);
          if (!pageNode || pageNode.type !== "PAGE")
            throw new Error("Invalid page ID or node is not a page");
          result = pageNode;
        }
        break;

      case "create-page":
        console.log("MCP command: Creating new page with name:", params.name);
        const newPage = figma.createPage();
        newPage.name = params.name || "New Page";
        result = newPage;
        break;

      case "switch-page":
        console.log("MCP command: Switching to page with ID:", params.id);
        if (!params.id) throw new Error("Page ID is required");
        const switchPageNode = figma.getNodeById(params.id);
        if (!switchPageNode || switchPageNode.type !== "PAGE")
          throw new Error("Invalid page ID");

        figma.currentPage = switchPageNode as PageNode;
        result = switchPageNode;
        break;

      case "modify-rectangle":
        console.log("MCP command: Modifying rectangle with ID:", params.id);
        if (!params.id) throw new Error("Rectangle ID is required");
        const modifyNode = figma.getNodeById(params.id);
        if (!modifyNode || modifyNode.type !== "RECTANGLE")
          throw new Error("Invalid rectangle ID");

        const rect = modifyNode as RectangleNode;
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

    // Convert PageNode to a compatible format for buildResultObject if needed
    let resultForBuilder: SceneNode | readonly SceneNode[] | null = null;

    if (result === null) {
      resultForBuilder = null;
    } else if (Array.isArray(result)) {
      // For arrays, we rely on duck typing - both PageNode[] and SceneNode[] have id, name, type
      resultForBuilder = result as unknown as readonly SceneNode[];
    } else if ("type" in result && result.type === "PAGE") {
      // For individual PageNode, we rely on duck typing - PageNode has id, name, type like SceneNode
      resultForBuilder = result as unknown as SceneNode;
    } else {
      resultForBuilder = result as SceneNode;
    }

    // Build result object, avoiding possible null values
    const resultObject = buildResultObject(resultForBuilder);
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
