/**
 * Resources for the Figma MCP server
 */
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import figmaApi from "./services/figma-api.js";

/**
 * Resource template for Figma files
 */
export const figmaFileResource = (server: McpServer): void => {
  server.resource(
    "figma-file",
    new ResourceTemplate("figma-file://{file_key}", {
      // Define listCallback instead of just providing a string for 'list'
      listCallback: async () => {
        try {
          // Here we would typically get a list of files
          // For now, return an empty list since we don't have access to "all files"
          return {
            contents: [{
              uri: "figma-file://",
              title: "Figma Files",
              description: "List of Figma files you have access to",
              text: "# Figma Files\n\nTo access a specific file, you need to provide its file key."
            }]
          };
        } catch (error) {
          console.error('Error listing files:', error);
          return {
            contents: [{
              uri: "figma-file://",
              title: "Error listing files",
              text: `Error: ${(error as Error).message}`
            }]
          };
        }
      }
    }),
    async (uri, { file_key }) => {
      try {
        const file = await figmaApi.getFile(file_key);
        
        return {
          contents: [{
            uri: uri.href,
            title: file.name,
            description: `Last modified: ${file.lastModified}`,
            text: `# ${file.name}\n\nLast modified: ${file.lastModified}\n\nDocument contains ${file.document.children?.length || 0} top-level nodes.\nComponents: ${Object.keys(file.components).length}\nStyles: ${Object.keys(file.styles).length}`
          }]
        };
      } catch (error) {
        console.error('Error fetching file for resource:', error);
        return {
          contents: [{
            uri: uri.href,
            title: `File not found: ${file_key}`,
            text: `Error: ${(error as Error).message}`
          }]
        };
      }
    }
  );
};

/**
 * Resource template for Figma nodes
 */
export const figmaNodeResource = (server: McpServer): void => {
  server.resource(
    "figma-node",
    new ResourceTemplate("figma-node://{file_key}/{node_id}", {
      // Define listCallback instead of just providing a string for 'list'
      listCallback: async (uri, { file_key }) => {
        try {
          // If only file_key is provided, list all top-level nodes
          const file = await figmaApi.getFile(file_key);
          
          return {
            contents: file.document.children?.map(node => ({
              uri: `figma-node://${file_key}/${node.id}`,
              title: node.name,
              description: `Type: ${node.type}`,
              text: `# ${node.name}\n\nType: ${node.type}\nID: ${node.id}`
            })) || []
          };
        } catch (error) {
          console.error('Error listing nodes:', error);
          return {
            contents: [{
              uri: `figma-node://${file_key}`,
              title: "Error listing nodes",
              text: `Error: ${(error as Error).message}`
            }]
          };
        }
      }
    }),
    async (uri, { file_key, node_id }) => {
      try {
        // Get specific node
        const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
        const nodeData = fileNodes.nodes[node_id];
        
        if (!nodeData) {
          return {
            contents: [{
              uri: uri.href,
              title: `Node not found: ${node_id}`,
              text: `Node ${node_id} not found in file ${file_key}`
            }]
          };
        }
        
        return {
          contents: [{
            uri: uri.href,
            title: nodeData.document.name,
            description: `Type: ${nodeData.document.type}`,
            text: `# ${nodeData.document.name}\n\nType: ${nodeData.document.type}\nID: ${nodeData.document.id}\nChildren: ${nodeData.document.children?.length || 0}`
          }]
        };
      } catch (error) {
        console.error('Error fetching node for resource:', error);
        return {
          contents: [{
            uri: uri.href,
            title: `Error`,
            text: `Error: ${(error as Error).message}`
          }]
        };
      }
    }
  );
};

/**
 * Registers all resources with the MCP server
 */
export function registerAllResources(server: McpServer): void {
  figmaFileResource(server);
  figmaNodeResource(server);
}
