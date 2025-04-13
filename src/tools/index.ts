/**
 * Tools - Main index file for all MCP tools
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerWidgetTools } from "./widget/index.js";
import { registerFileTools } from "./file.js";
import { registerNodeTools } from "./node.js";
import { registerCommentTools } from "./comment.js";
import { registerImageTools } from "./image.js";
import { registerVersionTools } from "./version.js";
import { registerSearchTools } from "./search.js";
import { registerComponentTools } from "./component.js";
import { registerFrameTools } from "./frame.js";
import { registerCanvasTools } from "./canvas.js";
import { registerPageTools } from "./page.js";

/**
 * Registers all tools with the MCP server
 * @param server The MCP server instance
 */
export function registerAllTools(server: McpServer): void {
  // Register all tool categories
  registerFileTools(server);
  registerNodeTools(server);
  registerCommentTools(server);
  registerImageTools(server);
  registerVersionTools(server);
  registerSearchTools(server);
  registerComponentTools(server);
  registerWidgetTools(server);
  registerFrameTools(server);
  registerCanvasTools(server);
  registerPageTools(server);
}
