/**
 * WebSocket Service - Handles communication with Figma plugin
 */
import { WebSocketServer, WebSocket as WSWebSocket } from "ws";
import { log, logError } from "../utils.js";

// Store active plugin connection WebSocket
let activePluginConnection: WSWebSocket | null = null;

// Callbacks for handling responses
const pendingCommands = new Map<string, (response: any) => void>();

interface PluginResponse {
  success: boolean;
  result?: any;
  error?: string;
}

/**
 * Create WebSocket server
 */
export function initializeWebSocketServer(port = 3001) {
  const wss = new WebSocketServer({ port });
  log(`WebSocket server started on port ${port}`);

  wss.on("connection", (ws: WSWebSocket) => {
    log("New WebSocket connection");

    ws.on("message", (message: WSWebSocket.Data) => {
      try {
        const data = JSON.parse(message.toString());
        log(`Received WebSocket message: ${JSON.stringify(data)}`);

        if (data.type === "figma-plugin-connected") {
          // Store active connection
          activePluginConnection = ws;
          log(`Figma plugin connected: ${data.pluginId || "unknown"}`);
        } else if (data.type === "figma-plugin-response") {
          // Handle response from plugin
          const { command, success, result, error } = data;
          const callback = pendingCommands.get(command);

          if (callback) {
            callback({ success, result, error });
            pendingCommands.delete(command);
          }
        }
      } catch (error) {
        logError("Error processing WebSocket message", error);
      }
    });

    ws.on("close", () => {
      log("WebSocket connection closed");
      if (activePluginConnection === ws) {
        activePluginConnection = null;
      }
    });

    ws.on("error", (error: Error) => {
      logError("WebSocket error", error);
    });
  });

  return wss;
}

/**
 * Send command to Figma plugin
 */
export async function sendCommandToPlugin(
  command: string,
  params: any
): Promise<PluginResponse> {
  return new Promise((resolve, reject) => {
    if (!activePluginConnection) {
      reject(new Error("No active Figma plugin connection"));
      return;
    }

    try {
      // Store callback
      pendingCommands.set(command, resolve);

      // Send command
      activePluginConnection.send(
        JSON.stringify({
          type: "mcp-command",
          command,
          params,
        })
      );

      // Set timeout
      setTimeout(() => {
        if (pendingCommands.has(command)) {
          pendingCommands.delete(command);
          reject(new Error(`Command ${command} timed out`));
        }
      }, 10000); // 10 second timeout
    } catch (error) {
      pendingCommands.delete(command);
      reject(error);
    }
  });
}

/**
 * Check if a Figma plugin is connected
 */
export function isPluginConnected(): boolean {
  return activePluginConnection !== null;
} 