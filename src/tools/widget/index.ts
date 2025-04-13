/**
 * Widget Tools - Index file to export all widget-related tools
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getWidgetsTool } from "./get-widgets.js";
import { getWidgetTool } from "./get-widget.js";
import { getWidgetSyncDataTool } from "./get-widget-sync-data.js";
import { searchWidgetsTool } from "./search-widgets.js";
import { analyzeWidgetStructureTool } from "./analyze-widget-structure.js";

/**
 * Registers all widget-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerWidgetTools(server: McpServer): void {
  // Register all widget tools
  getWidgetsTool(server);
  getWidgetTool(server);
  getWidgetSyncDataTool(server);
  searchWidgetsTool(server);
  analyzeWidgetStructureTool(server);
}
