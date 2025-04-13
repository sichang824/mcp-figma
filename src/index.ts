/**
 * Figma MCP Server - Main entry point
 *
 * This server provides a Model Context Protocol (MCP) implementation
 * for interacting with the Figma API.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as dotenv from "dotenv";
import { registerAllResources } from "./resources.js";
import { initializeWebSocketServer } from "./tools/canvas.js";
import { registerAllTools } from "./tools/index.js";
import { log } from "./utils.js";
import { env } from "./config/env.js";

// Load environment variables
dotenv.config();

// Create an MCP server
const server = new McpServer({
  name: "Figma API",
  version: "1.0.0",
});

// Register all tools and resources
registerAllTools(server);
registerAllResources(server);

// Initialize WebSocket server for Figma plugin communication
const wsPort = env.PORT || 3001;
initializeWebSocketServer(wsPort);

// Start the MCP server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport);

// Use logger utility to avoid interfering with stdout used by MCP
log("Figma MCP Server started");
