# Figma MCP Server

A Model Context Protocol (MCP) server for Figma that allows AI assistants to interact with Figma files.

## Features

- Fetch Figma file data and node information
- Download images and assets from Figma files
- Simplified response format for easier processing by AI models

## Requirements

- Node.js v18+ or Bun runtime
- Figma Personal Access Token

## Installation

1. Clone the repository
2. Install dependencies: `bun install`
3. Copy `.env.example` to `.env` and add your Figma Personal Access Token

## Usage

### Start the MCP Server



The server will start on port 3001 by default (configurable via the PORT environment variable).

### MCP Endpoints

- SSE Connection: `http://localhost:3001/sse`
- Messages: `http://localhost:3001/messages`

## Available Tools

The MCP server provides the following tools:

### get_figma_data

Fetch data from a Figma file or specific node.

Parameters:
- `fileKey` (string): The Figma file key
- `nodeId` (string, optional): The specific node to fetch
- `depth` (number, optional): How many levels deep to traverse

### download_figma_images

Download images from a Figma file.

Parameters:
- `fileKey` (string): The Figma file key
- `nodes` (array): Array of node objects to download
  - `nodeId` (string): The ID of the Figma image node
  - `imageRef` (string, optional): For image fill references
  - `fileName` (string): Local filename to save as
- `localPath` (string): Directory path to save images

## Environment Variables

- `FIGMA_PERSONAL_ACCESS_TOKEN`: Your Figma Personal Access Token
- `PORT`: The port to run the server on (default: 3001)
- `NODE_ENV`: Set to "development" for more detailed logs

## License

MIT
:

```bash
make test
```

## License

MIT
