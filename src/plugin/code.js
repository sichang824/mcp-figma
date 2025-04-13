// src/plugin/code.ts
figma.showUI(__html__, { width: 300, height: 450 });
figma.ui.onmessage = function(msg) {
  if (msg.type === "create-rectangle") {
    createRectangle(msg.x || 100, msg.y || 100, msg.width || 150, msg.height || 150, msg.color || "#ff0000");
  } else if (msg.type === "create-circle") {
    createCircle(msg.x || 100, msg.y || 100, msg.width || 150, msg.height || 150, msg.color || "#0000ff");
  } else if (msg.type === "create-text") {
    createText(msg.x || 100, msg.y || 100, msg.text || "Hello Figma!", msg.fontSize || 24);
  } else if (msg.type === "mcp-command") {
    handleMcpCommand(msg.command, msg.params);
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
function createRectangle(x, y, width, height, color) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{ type: "SOLID", color: hexToRgb(color) }];
  figma.currentPage.selection = [rect];
  figma.viewport.scrollAndZoomIntoView([rect]);
  return rect;
}
function createCircle(x, y, width, height, color) {
  const ellipse = figma.createEllipse();
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(width, height);
  ellipse.fills = [{ type: "SOLID", color: hexToRgb(color) }];
  figma.currentPage.selection = [ellipse];
  figma.viewport.scrollAndZoomIntoView([ellipse]);
  return ellipse;
}
async function createText(x, y, content, fontSize) {
  const text = figma.createText();
  text.x = x;
  text.y = y;
  text.characters = content;
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  text.fontSize = fontSize;
  figma.currentPage.selection = [text];
  figma.viewport.scrollAndZoomIntoView([text]);
  return text;
}
async function handleMcpCommand(command, params) {
  let result = null;
  try {
    switch (command) {
      case "create-rectangle":
        result = createRectangle(params.x || 100, params.y || 100, params.width || 150, params.height || 150, params.color || "#ff0000");
        break;
      case "create-circle":
        result = createCircle(params.x || 100, params.y || 100, params.width || 150, params.height || 150, params.color || "#0000ff");
        break;
      case "create-text":
        result = await createText(params.x || 100, params.y || 100, params.text || "Hello from MCP!", params.fontSize || 24);
        break;
      case "get-selection":
        result = figma.currentPage.selection;
        break;
      default:
        throw new Error("Unknown command: " + command);
    }
    let resultObject = {};
    if (result) {
      if (result.id)
        resultObject.id = result.id;
      if (result.type)
        resultObject.type = result.type;
      if (result.name)
        resultObject.name = result.name;
    }
    figma.ui.postMessage({
      type: "mcp-response",
      success: true,
      command,
      result: resultObject
    });
  } catch (error) {
    figma.ui.postMessage({
      type: "mcp-response",
      success: false,
      command,
      error: error.message || "Unknown error"
    });
  }
}
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}
