# Figma MCP Server

A Figma API server implementation based on Model Context Protocol (MCP), supporting Figma plugin and widget integration.

## Features

- Interact with Figma API through MCP
- WebSocket server for Figma plugin communication
- Support for Figma widget development
- Environment variable configuration via command line arguments
- Rich set of Figma operation tools

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd figma-mcp
```

2. Install dependencies:

```bash
bun install
```

## Configuration

### Environment Variables

Create a `.env` file and set the following environment variables:

```
FIGMA_PERSONAL_ACCESS_TOKEN=your_figma_token
PORT=3001
NODE_ENV=development
```

### Getting a Figma Access Token

1. Log in to [Figma](https://www.figma.com/)
2. Go to Account Settings > Personal Access Tokens
3. Create a new access token
4. Copy the token to your `.env` file or pass it via command line arguments

## Usage

### Build the Project

```bash
bun run build
```

### Run the Development Server

```bash
bun run dev
```

### Using Command Line Arguments

Support for setting environment variables via the `-e` parameter:

```bash
bun --watch src/index.ts -e FIGMA_PERSONAL_ACCESS_TOKEN=your_token -e PORT=6000
```

You can also use a dedicated token parameter:

```bash
bun --watch src/index.ts --token your_token
```

Or its shorthand:

```bash
bun --watch src/index.ts -t your_token
```

## Configuring MCP in Cursor

Add to the `.cursor/mcp.json` file:

```json
{
  "Figma MCP": {
    "command": "bun",
    "args": [
      "--watch",
      "/path/to/figma-mcp/src/index.ts",
      "-e",
      "FIGMA_PERSONAL_ACCESS_TOKEN=your_token_here",
      "-e",
      "PORT=6000"
    ]
  }
}
```

## Available Tools

The server provides the following Figma operation tools:

- File operations: Get files, versions, etc.
- Node operations: Get and manipulate Figma nodes
- Comment operations: Manage comments in Figma files
- Image operations: Export Figma elements as images
- Search functionality: Search content in Figma files
- Component operations: Manage Figma components
- Canvas operations: Create rectangles, circles, text, etc.
- Widget operations: Manage Figma widgets

## Figma Plugin Development

### Plugin Introduction

Figma plugins are customized tools that extend Figma's functionality, enabling workflow automation, adding new features, or integrating with external services. This MCP server provides a convenient way to develop, test, and deploy Figma plugins.

### Building and Testing

Build the plugin:

```bash
bun run build:plugin
```

Run in development mode:

```bash
bun run dev:plugin
```

### Loading the Plugin in Figma

![image](./docs/image.png)

1. Right-click in Figma to open the menu -> Plugins -> Development -> Import plugin from manifest...
2. Select the plugin's `manifest.json` file
3. Your plugin will now appear in Figma's plugin menu

### Plugin Interaction with MCP Server

Plugins can communicate with the MCP server via WebSocket to achieve:

- Complex data processing
- External API integration
- Cross-session data persistence
- AI functionality integration

## Development

### Build Widget

```bash
bun run build:widget
```

### Build Plugin

```bash
bun run build:plugin
```

### Development Mode

```bash
bun run dev:widget  # Widget development mode
bun run dev:plugin  # Plugin development mode
```

## License

MIT
