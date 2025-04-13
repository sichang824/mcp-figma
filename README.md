# Figma MCP Server

An MCP (Model Context Protocol) server for interacting with the Figma API. This server allows AI assistants and other applications to access and manipulate Figma files through the MCP protocol.

## Features

- Access Figma files and nodes
- Search for text in Figma files
- Get comments and add new comments
- Export images from Figma files
- View file versions and history
- Access components and styles
- Use resource templates for consistent access patterns

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- Figma API personal access token

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   make install
   ```
3. Create a `.env` file based on `.env.example` and add your Figma API token:
   ```
   FIGMA_PERSONAL_ACCESS_TOKEN=your_figma_token_here
   ```

## Usage

### Start the MCP Server

```bash
make mcp
```

This will start the MCP server in development mode with auto-reload.

### Build for Production

```bash
make build-mcp
```

Then start the server:

```bash
make start
```

## Available Tools

- `get_file` - Retrieve a Figma file by key
- `get_node` - Get a specific node from a Figma file
- `get_comments` - Get all comments from a file
- `get_images` - Export images from file nodes
- `get_file_versions` - Get version history for a file
- `search_text` - Search for text in a Figma file
- `get_components` - Get components from a file
- `add_comment` - Add a new comment to a file

## Resource Templates

- `figma-file://{file_key}` - Access Figma files
- `figma-node://{file_key}/{node_id}` - Access nodes within Figma files

## Development

For development with auto-reload:

```bash
make dev
```

Run tests:

```bash
make test
```

## License

MIT
