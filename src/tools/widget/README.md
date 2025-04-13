# Widget Tools for Figma MCP

This directory contains tools for interacting with Figma widgets through the MCP server.

## Directory Structure

Each tool is organized in its own directory:

- `get-widgets`: Lists all widgets in a file
- `get-widget`: Gets detailed information about a specific widget
- `get-widget-sync-data`: Retrieves a widget's synchronized state data
- `search-widgets`: Searches for widgets with specific properties
- `analyze-widget-structure`: Provides detailed analysis of a widget's structure

## Adding New Widget Tools

To add a new widget tool:

1. Create a new directory for your tool under `src/tools/widget/`
2. Create an `index.ts` file with your tool implementation
3. Update the main `index.ts` to import and register your tool

## Using Shared Utilities

Common widget utilities can be found in `src/tools/utils/widget-utils.ts`.

## Widget Tool Pattern

Each widget tool follows this pattern:

```typescript
export const yourToolName = (server: McpServer) => {
  server.tool(
    "tool_name",
    {
      // Parameter schema using zod
      param1: z.string().describe("Description"),
      param2: z.number().describe("Description")
    },
    async ({ param1, param2 }) => {
      try {
        // Tool implementation
        return {
          content: [
            { type: "text", text: "Response content" }
          ]
        };
      } catch (error) {
        console.error('Error message:', error);
        return {
          content: [
            { type: "text", text: `Error: ${(error as Error).message}` }
          ]
        };
      }
    }
  );
};
```

For more information, see the [Widget Tools Guide](/docs/widget-tools-guide.md).
