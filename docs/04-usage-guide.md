# Usage Guide

This document provides detailed instructions for setting up, running, and using the Figma MCP server.

## 1. Setup Instructions

### Prerequisites

Before you begin, ensure you have the following:
- [Bun](https://bun.sh/) v1.0.0 or higher installed
- A Figma account with API access
- A personal access token from Figma

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd figma-mcp-server
   ```

2. Install dependencies:
   ```bash
   make install
   ```
   or
   ```bash
   bun install
   ```

3. Configure environment variables:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Figma personal access token:
     ```
     FIGMA_PERSONAL_ACCESS_TOKEN=your_figma_token_here
     PORT=3001
     NODE_ENV=development
     ```

## 2. Running the Server

### Development Mode

Run the server in development mode with auto-reload:
```bash
make mcp
```
or
```bash
bun run mcp
```

### Production Mode

1. Build the server:
   ```bash
   make build-mcp
   ```
   or
   ```bash
   bun run build:mcp
   ```

2. Run the built server:
   ```bash
   make start
   ```
   or
   ```bash
   bun run start
   ```

## 3. Using the MCP Tools

To use the MCP tools, you'll need an MCP client that can communicate with the server. This could be an AI assistant or another application that implements the MCP protocol.

### Example: Retrieving a Figma File

Using the `get_file` tool:

```json
{
  "tool": "get_file",
  "parameters": {
    "file_key": "abc123xyz789",
    "return_full_file": false
  }
}
```

Expected response:
```json
{
  "content": [
    { "type": "text", "text": "# Figma File: My Design" },
    { "type": "text", "text": "Last modified: 2025-04-10T15:30:45Z" },
    { "type": "text", "text": "Document contains 5 top-level nodes." },
    { "type": "text", "text": "Components: 12" },
    { "type": "text", "text": "Component sets: 3" },
    { "type": "text", "text": "Styles: 8" }
  ]
}
```

### Example: Searching for Text

Using the `search_text` tool:

```json
{
  "tool": "search_text",
  "parameters": {
    "file_key": "abc123xyz789",
    "search_text": "Welcome"
  }
}
```

Expected response:
```json
{
  "content": [
    { "type": "text", "text": "# Text Search Results for \"Welcome\"" },
    { "type": "text", "text": "Found 2 matching text nodes:" },
    { "type": "text", "text": "- **Header Text** (ID: 123:456)\n  Path: Page 1 > Header > Text\n  Text: \"Welcome to our application\"" }
  ]
}
```

### Example: Adding a Comment

Using the `add_comment` tool:

```json
{
  "tool": "add_comment",
  "parameters": {
    "file_key": "abc123xyz789",
    "message": "This design looks great! Consider adjusting the contrast on the buttons.",
    "node_id": "123:456"
  }
}
```

Expected response:
```json
{
  "content": [
    { "type": "text", "text": "Comment added successfully!" },
    { "type": "text", "text": "Comment ID: 987654" },
    { "type": "text", "text": "By user: John Doe" },
    { "type": "text", "text": "Added at: 4/13/2025, 12:34:56 PM" }
  ]
}
```

## 4. Using Resource Templates

Resource templates provide a consistent way to access Figma resources.

### Example: Accessing a File

Resource URI: `figma-file://abc123xyz789`

Expected response:
```json
{
  "contents": [{
    "uri": "figma-file://abc123xyz789",
    "title": "My Design",
    "description": "Last modified: 2025-04-10T15:30:45Z",
    "text": "# My Design\n\nLast modified: 2025-04-10T15:30:45Z\n\nDocument contains 5 top-level nodes.\nComponents: 12\nStyles: 8"
  }]
}
```

### Example: Listing Nodes in a File

Resource URI: `figma-node://abc123xyz789`

Expected response:
```json
{
  "contents": [
    {
      "uri": "figma-node://abc123xyz789/1:1",
      "title": "Page 1",
      "description": "Type: CANVAS",
      "text": "# Page 1\n\nType: CANVAS\nID: 1:1"
    },
    {
      "uri": "figma-node://abc123xyz789/1:2",
      "title": "Page 2",
      "description": "Type: CANVAS",
      "text": "# Page 2\n\nType: CANVAS\nID: 1:2"
    }
  ]
}
```

### Example: Accessing a Specific Node

Resource URI: `figma-node://abc123xyz789/123:456`

Expected response:
```json
{
  "contents": [{
    "uri": "figma-node://abc123xyz789/123:456",
    "title": "Header Text",
    "description": "Type: TEXT",
    "text": "# Header Text\n\nType: TEXT\nID: 123:456\nChildren: 0"
  }]
}
```

## 5. Error Handling Examples

### Example: File Not Found

```json
{
  "content": [
    { "type": "text", "text": "Error getting Figma file: File not found" }
  ]
}
```

### Example: Node Not Found

```json
{
  "content": [
    { "type": "text", "text": "Node 123:456 not found in file abc123xyz789" }
  ]
}
```

### Example: Authentication Error

```json
{
  "content": [
    { "type": "text", "text": "Error getting Figma file: Authentication failed. Please check your personal access token." }
  ]
}
```

## 6. Tips and Best Practices

1. **File Keys**: Obtain file keys from Figma file URLs. The format is typically `https://www.figma.com/file/FILE_KEY/FILE_NAME`.

2. **Node IDs**: Node IDs can be found in Figma by right-clicking a layer and selecting "Copy/Paste as > Copy link". The node ID is the part after `?node-id=` in the URL.

3. **Performance**: For large files, use targeted queries with specific node IDs rather than retrieving the entire file.

4. **Image Export**: When exporting images, use appropriate scale factors: 1 for normal resolution, 2 for @2x, etc.

5. **Comments**: When adding comments, provide node IDs to attach comments to specific elements.

6. **Error Handling**: Always handle potential errors in your client application.

7. **Resource Caching**: Consider caching resource responses for improved performance in your client application.
