# Components and Features

This document provides detailed information about the key components and features of the Figma MCP server.

## 1. Core Components

### Environment Configuration (`src/config/env.ts`)

The environment configuration component:

- Loads variables from `.env` file using dotenv
- Validates environment variables using Zod schema
- Provides type-safe access to configuration values
- Ensures required variables are present
- Sets sensible defaults for optional variables

```typescript
// Example of environment validation
const envSchema = z.object({
  FIGMA_PERSONAL_ACCESS_TOKEN: z.string().min(1),
  PORT: z.string().default("3001").transform(Number),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});
```

### Figma API Service (`src/services/figma-api.ts`)

A comprehensive service for interacting with the Figma API:

- Uses official Figma API TypeScript definitions
- Provides methods for all relevant API endpoints
- Handles authentication and request formatting
- Processes responses and errors consistently
- Supports all Figma resource types:
  - Files and nodes
  - Comments
  - Images
  - Components and styles
  - Versions
  - Teams and projects

```typescript
// Example method for retrieving a Figma file
async getFile(fileKey: string, params: {
  ids?: string;
  depth?: number;
  geometry?: string
} = {}): Promise<GetFileResponse> {
  const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}`, {
    headers: this.headers,
    params,
  });
  return response.data;
}
```

### Figma Utilities (`src/utils/figma-utils.ts`)

Utility functions for working with Figma data:

- Node search and traversal
- Text extraction
- Property formatting
- Path calculation
- Type-specific operations

```typescript
// Example utility for finding a node by ID
static findNodeById(file: GetFileResponse, nodeId: string): Node | null {
  // Implementation details...
}
```

### MCP Server Implementation (`src/index.ts`)

The main MCP server implementation:

- Configures the MCP server
- Defines tools and resources
- Handles communication via standard I/O
- Manages error handling and response formatting

```typescript
// Example of MCP server configuration
const server = new McpServer({
  name: "Figma API",
  version: "1.0.0",
});
```

## 2. MCP Tools

The server provides the following tools:

### `get_file`

Retrieves a Figma file by key:

- Parameters:
  - `file_key`: The Figma file key
  - `return_full_file`: Whether to return the full file structure
- Returns:
  - File name, modification date
  - Document structure summary
  - Component and style counts
  - Full file contents (if requested)

### `get_node`

Retrieves a specific node from a Figma file:

- Parameters:
  - `file_key`: The Figma file key
  - `node_id`: The ID of the node to retrieve
- Returns:
  - Node name, type, and ID
  - Node properties and attributes
  - Child node count

### `get_comments`

Retrieves comments from a Figma file:

- Parameters:
  - `file_key`: The Figma file key
- Returns:
  - Comment count
  - Comment text
  - Author information
  - Timestamps

### `get_images`

Exports nodes as images:

- Parameters:
  - `file_key`: The Figma file key
  - `node_ids`: Array of node IDs to export
  - `format`: Image format (jpg, png, svg, pdf)
  - `scale`: Scale factor for the image
- Returns:
  - Image URLs for each node
  - Error information for failed exports

### `get_file_versions`

Retrieves version history for a file:

- Parameters:
  - `file_key`: The Figma file key
- Returns:
  - Version list
  - Version labels and descriptions
  - Author information
  - Timestamps

### `search_text`

Searches for text within a Figma file:

- Parameters:
  - `file_key`: The Figma file key
  - `search_text`: The text to search for
- Returns:
  - Matching text nodes
  - Node paths in document hierarchy
  - Matching text content

### `get_components`

Retrieves components from a Figma file:

- Parameters:
  - `file_key`: The Figma file key
- Returns:
  - Component list
  - Component names and keys
  - Component descriptions
  - Remote status

### `add_comment`

Adds a comment to a Figma file:

- Parameters:
  - `file_key`: The Figma file key
  - `message`: The comment text
  - `node_id`: Optional node ID to attach the comment to
- Returns:
  - Comment ID
  - Author information
  - Timestamp

## 3. Resource Templates

The server provides the following resource templates:

### `figma-file://{file_key}`

Provides access to Figma files:

- URI format: `figma-file://{file_key}`
- List URI: `figma-file://`
- Returns:
  - File name
  - Last modified date
  - Document structure summary

### `figma-node://{file_key}/{node_id}`

Provides access to nodes within Figma files:

- URI format: `figma-node://{file_key}/{node_id}`
- List URI: `figma-node://{file_key}`
- Returns:
  - Node name and type
  - Node properties
  - Child node count

## 4. Error Handling

The server implements comprehensive error handling:

- API request errors
- Authentication failures
- Invalid parameters
- Resource not found errors
- Server errors

Each error is properly formatted and returned to the client with:

- Error message
- Error type
- Context information (when available)

## 5. Response Formatting

Responses are formatted for optimal consumption by AI assistants:

- Clear headings
- Structured information
- Formatted lists
- Contextual descriptions
- Links and references where appropriate
