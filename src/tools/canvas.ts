/**
 * Canvas Tools - MCP server tools for interacting with Figma canvas elements
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import WebSocket from "ws";

// 用于存储活动插件连接的 WebSocket
let activePluginConnection = null;

// 用于处理响应的回调
const pendingCommands = new Map();

/**
 * 创建 WebSocket 服务器
 */
export function initializeWebSocketServer(port = 3001) {
  const wss = new WebSocket.Server({ port });
  console.log(`WebSocket server started on port ${port}`);

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        if (data.type === 'figma-plugin-connected') {
          // 存储活动连接
          activePluginConnection = ws;
          console.log(`Figma plugin connected: ${data.pluginId || 'unknown'}`);
        }
        else if (data.type === 'figma-plugin-response') {
          // 处理来自插件的响应
          const { command, success, result, error } = data;
          const callback = pendingCommands.get(command);
          
          if (callback) {
            callback({ success, result, error });
            pendingCommands.delete(command);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (activePluginConnection === ws) {
        activePluginConnection = null;
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return wss;
}

/**
 * 发送命令到 Figma 插件
 */
async function sendCommandToPlugin(command, params) {
  return new Promise((resolve, reject) => {
    if (!activePluginConnection) {
      reject(new Error('No active Figma plugin connection'));
      return;
    }
    
    try {
      // 存储回调
      pendingCommands.set(command, resolve);
      
      // 发送命令
      activePluginConnection.send(JSON.stringify({
        command,
        params
      }));
      
      // 设置超时
      setTimeout(() => {
        if (pendingCommands.has(command)) {
          pendingCommands.delete(command);
          reject(new Error(`Command ${command} timed out`));
        }
      }, 10000); // 10秒超时
      
    } catch (error) {
      pendingCommands.delete(command);
      reject(error);
    }
  });
}

/**
 * Register canvas-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerCanvasTools(server: McpServer) {
  
  // Create a rectangle in Figma
  server.tool(
    "create_rectangle",
    {
      x: z.number().default(100).describe("The X position of the rectangle"),
      y: z.number().default(100).describe("The Y position of the rectangle"),
      width: z.number().min(1).default(150).describe("The width of the rectangle in pixels"),
      height: z.number().min(1).default(150).describe("The height of the rectangle in pixels"),
      color: z.string().default("#ff0000").describe("The fill color (hex code)")
    },
    async ({ x, y, width, height, color }) => {
      try {
        // 发送命令到 Figma 插件
        const response = await sendCommandToPlugin('create-rectangle', {
          x, y, width, height, color
        }).catch(error => {
          throw error;
        });
        
        if (!response.success) {
          throw new Error(response.error || 'Unknown error');
        }
        
        return {
          content: [
            { type: "text", text: `# Rectangle Created Successfully` },
            { 
              type: "text", 
              text: `A new rectangle has been created in your Figma canvas.` 
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Size: ${width}×${height}px\n- Color: ${color}`
            },
            {
              type: "text",
              text: response.result && response.result.id ? 
                `Node ID: ${response.result.id}` : 
                `Creation successful`
            }
          ],
        };
      } catch (error) {
        console.error("Error creating rectangle in Figma:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating rectangle: ${error.message}`
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`
            }
          ],
        };
      }
    }
  );

  // Create a circle in Figma
  server.tool(
    "create_circle",
    {
      x: z.number().default(100).describe("The X position of the center"),
      y: z.number().default(100).describe("The Y position of the center"),
      width: z.number().min(1).default(150).describe("The width of the circle in pixels"),
      height: z.number().min(1).default(150).describe("The height of the circle in pixels"),
      color: z.string().default("#0000ff").describe("The fill color (hex code)")
    },
    async ({ x, y, width, height, color }) => {
      try {
        // 发送命令到 Figma 插件
        const response = await sendCommandToPlugin('create-circle', {
          x, y, width, height, color
        }).catch(error => {
          throw error;
        });
        
        if (!response.success) {
          throw new Error(response.error || 'Unknown error');
        }
        
        return {
          content: [
            { type: "text", text: `# Circle Created Successfully` },
            { 
              type: "text", 
              text: `A new circle has been created in your Figma canvas.` 
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Size: ${width}×${height}px\n- Color: ${color}`
            },
            {
              type: "text",
              text: response.result && response.result.id ? 
                `Node ID: ${response.result.id}` : 
                `Creation successful`
            }
          ],
        };
      } catch (error) {
        console.error("Error creating circle in Figma:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating circle: ${error.message}`
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`
            }
          ],
        };
      }
    }
  );

  // Create text in Figma
  server.tool(
    "create_text",
    {
      x: z.number().default(100).describe("The X position of the text"),
      y: z.number().default(100).describe("The Y position of the text"),
      text: z.string().min(1).default("Hello Figma!").describe("The text content"),
      fontSize: z.number().min(1).default(24).describe("The font size in pixels")
    },
    async ({ x, y, text, fontSize }) => {
      try {
        // 发送命令到 Figma 插件
        const response = await sendCommandToPlugin('create-text', {
          x, y, text, fontSize
        }).catch(error => {
          throw error;
        });
        
        if (!response.success) {
          throw new Error(response.error || 'Unknown error');
        }
        
        return {
          content: [
            { type: "text", text: `# Text Created Successfully` },
            { 
              type: "text", 
              text: `New text has been created in your Figma canvas.` 
            },
            {
              type: "text",
              text: `- Position: (${x}, ${y})\n- Font Size: ${fontSize}px\n- Content: "${text}"`
            },
            {
              type: "text",
              text: response.result && response.result.id ? 
                `Node ID: ${response.result.id}` : 
                `Creation successful`
            }
          ],
        };
      } catch (error) {
        console.error("Error creating text in Figma:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating text: ${error.message}`
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`
            }
          ],
        };
      }
    }
  );

  // Get current selection in Figma
  server.tool(
    "get_selection",
    {},
    async () => {
      try {
        // 发送命令到 Figma 插件
        const response = await sendCommandToPlugin('get-selection', {}).catch(error => {
          throw error;
        });
        
        if (!response.success) {
          throw new Error(response.error || 'Unknown error');
        }
        
        return {
          content: [
            { type: "text", text: `# Current Selection` },
            { 
              type: "text", 
              text: `Information about currently selected elements in Figma:` 
            },
            {
              type: "text",
              text: response.result ? 
                JSON.stringify(response.result, null, 2) : 
                "No selection information available"
            }
          ],
        };
      } catch (error) {
        console.error("Error getting selection in Figma:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error getting selection: ${error.message}`
            },
            {
              type: "text",
              text: `Make sure the Figma plugin is running and connected to the MCP server.`
            }
          ],
        };
      }
    }
  );
  
  // Check plugin connection status
  server.tool(
    "check_connection",
    {},
    async () => {
      return {
        content: [
          { type: "text", text: `# Figma Plugin Connection Status` },
          { 
            type: "text", 
            text: activePluginConnection ? 
              `✅ Figma plugin is connected to MCP server` : 
              `❌ No Figma plugin is currently connected` 
          },
          {
            type: "text",
            text: activePluginConnection ? 
              `You can now use MCP tools to interact with the Figma canvas.` :
              `Please make sure the Figma plugin is running and connected to the MCP server.`
          }
        ],
      };
    }
  );
} 