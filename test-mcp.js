// Simple test script for the MCP server

// MCP initialization message
const initMsg = {
  type: "initialize",
  protocol: "mcp",
  version: "0.3.1"
};

// Helper to send a message to the MCP server
function sendMcpMessage(message) {
  console.log(JSON.stringify(message));
}

// Helper to send a tool invocation
function invokeTool(name, arguments) {
  sendMcpMessage({
    type: "invoke_tool",
    id: "test-" + Date.now(),
    name,
    arguments
  });
}

// Start by sending initialization
sendMcpMessage(initMsg);

// Wait for a moment and then invoke a tool
setTimeout(() => {
  // This will fail without a real token, but it shows how to invoke
  invokeTool("get_widgets", {
    file_key: "sample_file_key"
  });
}, 1000);
