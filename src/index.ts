/**
 * Figma MCP Server - Main entry point
 *
 * This server provides a Model Context Protocol (MCP) implementation
 * for interacting with the Figma API.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";
import * as dotenv from "dotenv";
import { env } from "./config/env.js";
import { registerAllResources } from "./resources.js";
import { initializeWebSocketServer } from "./services/websocket.js";
import { registerAllTools } from "./tools/index.js";
import { log } from "./utils.js";

// Load environment variables
dotenv.config();

// Check for and kill any existing processes using the same port
function killExistingProcesses() {
  try {
    const wsPort = env.WEBSOCKET_PORT || 3001;
    log(`Checking for processes using port ${wsPort}...`);

    // Find processes using the websocket port
    const findCmd =
      process.platform === "win32"
        ? `netstat -ano | findstr :${wsPort}`
        : `lsof -i:${wsPort} | grep LISTEN`;

    let output;
    try {
      output = execSync(findCmd, { encoding: "utf8" });
    } catch (e) {
      // No process found, which is fine
      log("No existing processes found.");
      return;
    }

    // Extract PIDs and kill them
    if (output) {
      if (process.platform === "win32") {
        // Windows: extract PID from last column
        const pids = output
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid, index, self) => pid && self.indexOf(pid) === index);

        pids.forEach((pid) => {
          if (pid && parseInt(pid) !== process.pid) {
            try {
              execSync(`taskkill /F /PID ${pid}`);
              log(`Killed process with PID: ${pid}`);
            } catch (e) {
              log(`Failed to kill process with PID: ${pid}`);
            }
          }
        });
      } else {
        // Unix-like: extract PID from second column
        const pids = output
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const parts = line.trim().split(/\s+/);
            return parts[1];
          })
          .filter((pid, index, self) => pid && self.indexOf(pid) === index);

        pids.forEach((pid) => {
          if (pid && parseInt(pid) !== process.pid) {
            try {
              execSync(`kill -9 ${pid}`);
              log(`Killed process with PID: ${pid}`);
            } catch (e) {
              log(`Failed to kill process with PID: ${pid}`);
            }
          }
        });
      }
    }
  } catch (error) {
    log(`Error checking for existing processes: ${error}`);
  }
}

// Kill any existing processes before starting
killExistingProcesses();

// Create an MCP server
const server = new McpServer({
  name: "Figma API",
  version: "1.0.0",
});

// Register all tools and resources
registerAllTools(server);
registerAllResources(server);

// Initialize WebSocket server for Figma plugin communication
const wsPort = env.WEBSOCKET_PORT || 3001;
initializeWebSocketServer(wsPort);

// Start the MCP server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport);

// Use logger utility to avoid interfering with stdout used by MCP
log("Figma MCP Server started");

export { server };
