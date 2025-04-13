/**
 * Figma MCP Server - Main entry point
 * 
 * This server provides a Model Context Protocol (MCP) implementation
 * for interacting with the Figma API.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";
import { registerAllResources } from "./resources.js";

// Create an MCP server
const server = new McpServer({
  name: "Figma API",
  version: "1.0.0"
});

// Register all tools and resources
registerAllTools(server);
registerAllResources(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Figma MCP Server started");
