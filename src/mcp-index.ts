import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import figmaApi from "./services/figma-api.js";
import { FigmaUtils } from "./utils/figma-utils.js";

// Create an MCP server
const server = new McpServer({
  name: "Figma API",
  version: "1.0.0"
});

// Get a Figma file
server.tool(
  "get_file",
  {
    file_key: z.string().min(1).describe("The Figma file key to retrieve"),
    return_full_file: z.boolean().default(false).describe("Whether to return the full file contents or just a summary")
  },
  async ({ file_key, return_full_file }) => {
    try {
      const file = await figmaApi.getFile(file_key);
      
      if (return_full_file) {
        return {
          content: [
            { type: "text", text: `Retrieved Figma file: ${file.name}` },
            { type: "text", text: JSON.stringify(file, null, 2) }
          ]
        };
      } else {
        return {
          content: [
            { type: "text", text: `# Figma File: ${file.name}` },
            { type: "text", text: `Last modified: ${file.lastModified}` },
            { type: "text", text: `Document contains ${file.document.children?.length || 0} top-level nodes.` },
            { type: "text", text: `Components: ${Object.keys(file.components).length || 0}` },
            { type: "text", text: `Component sets: ${Object.keys(file.componentSets).length || 0}` },
            { type: "text", text: `Styles: ${Object.keys(file.styles).length || 0}` }
          ]
        };
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      return {
        content: [
          { type: "text", text: `Error getting Figma file: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Get a node from a Figma file
server.tool(
  "get_node",
  {
    file_key: z.string().min(1).describe("The Figma file key to retrieve from"),
    node_id: z.string().min(1).describe("The ID of the node to retrieve")
  },
  async ({ file_key, node_id }) => {
    try {
      const fileNodes = await figmaApi.getFileNodes(file_key, [node_id]);
      const nodeData = fileNodes.nodes[node_id];
      
      if (!nodeData) {
        return {
          content: [
            { type: "text", text: `Node ${node_id} not found in file ${file_key}` }
          ]
        };
      }
      
      return {
        content: [
          { type: "text", text: `# Node: ${nodeData.document.name}` },
          { type: "text", text: `Type: ${nodeData.document.type}` },
          { type: "text", text: `ID: ${nodeData.document.id}` },
          { type: "text", text: `Children: ${nodeData.document.children?.length || 0}` },
          { type: "text", text: "```json\n" + JSON.stringify(nodeData.document, null, 2) + "\n```" }
        ]
      };
    } catch (error) {
      console.error('Error fetching node:', error);
      return {
        content: [
          { type: "text", text: `Error getting node: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Get comments from a Figma file
server.tool(
  "get_comments",
  {
    file_key: z.string().min(1).describe("The Figma file key to retrieve comments from")
  },
  async ({ file_key }) => {
    try {
      const commentsResponse = await figmaApi.getComments(file_key, { as_md: true });
      
      if (!commentsResponse.comments || commentsResponse.comments.length === 0) {
        return {
          content: [
            { type: "text", text: `No comments found in file ${file_key}` }
          ]
        };
      }
      
      const commentsList = commentsResponse.comments.map(comment => {
        return `- **${comment.user.handle}** (${new Date(comment.created_at).toLocaleString()}): ${comment.message}`;
      }).join('\n');
      
      return {
        content: [
          { type: "text", text: `# Comments for file ${file_key}` },
          { type: "text", text: `Found ${commentsResponse.comments.length} comments:` },
          { type: "text", text: commentsList }
        ]
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return {
        content: [
          { type: "text", text: `Error getting comments: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Get images from a Figma file
server.tool(
  "get_images",
  {
    file_key: z.string().min(1).describe("The Figma file key"),
    node_ids: z.array(z.string()).min(1).describe("The IDs of nodes to export as images"),
    format: z.enum(["jpg", "png", "svg", "pdf"]).default("png").describe("Image format to export"),
    scale: z.number().min(0.01).max(4).default(1).describe("Scale factor for the image (0.01 to 4)")
  },
  async ({ file_key, node_ids, format, scale }) => {
    try {
      const imagesResponse = await figmaApi.getImages(file_key, node_ids, {
        format,
        scale
      });
      
      if (imagesResponse.err) {
        return {
          content: [
            { type: "text", text: `Error getting images: ${imagesResponse.err}` }
          ]
        };
      }
      
      const imageUrls = Object.entries(imagesResponse.images)
        .map(([nodeId, url]) => {
          if (!url) {
            return `- ${nodeId}: Error generating image`;
          }
          return `- ${nodeId}: [Image URL](${url})`;
        })
        .join('\n');
      
      return {
        content: [
          { type: "text", text: `# Images for file ${file_key}` },
          { type: "text", text: `Format: ${format}, Scale: ${scale}` },
          { type: "text", text: imageUrls }
        ]
      };
    } catch (error) {
      console.error('Error fetching images:', error);
      return {
        content: [
          { type: "text", text: `Error getting images: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Get file versions
server.tool(
  "get_file_versions",
  {
    file_key: z.string().min(1).describe("The Figma file key")
  },
  async ({ file_key }) => {
    try {
      const versionsResponse = await figmaApi.getFileVersions(file_key);
      
      if (!versionsResponse.versions || versionsResponse.versions.length === 0) {
        return {
          content: [
            { type: "text", text: `No versions found for file ${file_key}` }
          ]
        };
      }
      
      const versionsList = versionsResponse.versions.map((version, index) => {
        return `${index + 1}. **${version.label || 'Unnamed version'}** - ${new Date(version.created_at).toLocaleString()} by ${version.user.handle}\n   ${version.description || 'No description'}`;
      }).join('\n\n');
      
      return {
        content: [
          { type: "text", text: `# File Versions for ${file_key}` },
          { type: "text", text: `Found ${versionsResponse.versions.length} versions:` },
          { type: "text", text: versionsList }
        ]
      };
    } catch (error) {
      console.error('Error fetching file versions:', error);
      return {
        content: [
          { type: "text", text: `Error getting file versions: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Search for text in a file
server.tool(
  "search_text",
  {
    file_key: z.string().min(1).describe("The Figma file key"),
    search_text: z.string().min(1).describe("The text to search for in the file")
  },
  async ({ file_key, search_text }) => {
    try {
      const file = await figmaApi.getFile(file_key);
      
      // Find all TEXT nodes
      const textNodes = FigmaUtils.getNodesByType(file, 'TEXT');
      
      // Filter for nodes containing the search text
      const matchingNodes = textNodes.filter(node => 
        node.characters && node.characters.toLowerCase().includes(search_text.toLowerCase())
      );
      
      if (matchingNodes.length === 0) {
        return {
          content: [
            { type: "text", text: `No text matching "${search_text}" found in file ${file_key}` }
          ]
        };
      }
      
      const matchesList = matchingNodes.map(node => {
        const path = FigmaUtils.getNodePath(file, node.id);
        return `- **${node.name}** (ID: ${node.id})\n  Path: ${path.join(' > ')}\n  Text: "${node.characters}"`;
      }).join('\n\n');
      
      return {
        content: [
          { type: "text", text: `# Text Search Results for "${search_text}"` },
          { type: "text", text: `Found ${matchingNodes.length} matching text nodes:` },
          { type: "text", text: matchesList }
        ]
      };
    } catch (error) {
      console.error('Error searching text:', error);
      return {
        content: [
          { type: "text", text: `Error searching text: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Get components in a file
server.tool(
  "get_components",
  {
    file_key: z.string().min(1).describe("The Figma file key")
  },
  async ({ file_key }) => {
    try {
      const componentsResponse = await figmaApi.getFileComponents(file_key);
      
      if (!componentsResponse.meta?.components || componentsResponse.meta.components.length === 0) {
        return {
          content: [
            { type: "text", text: `No components found in file ${file_key}` }
          ]
        };
      }
      
      const componentsList = componentsResponse.meta.components.map(component => {
        return `- **${component.name}** (Key: ${component.key})\n  Description: ${component.description || 'No description'}\n  ${component.remote ? '(Remote component)' : '(Local component)'}`;
      }).join('\n\n');
      
      return {
        content: [
          { type: "text", text: `# Components in file ${file_key}` },
          { type: "text", text: `Found ${componentsResponse.meta.components.length} components:` },
          { type: "text", text: componentsList }
        ]
      };
    } catch (error) {
      console.error('Error fetching components:', error);
      return {
        content: [
          { type: "text", text: `Error getting components: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Add comment to a file
server.tool(
  "add_comment",
  {
    file_key: z.string().min(1).describe("The Figma file key"),
    message: z.string().min(1).describe("The comment text"),
    node_id: z.string().optional().describe("Optional node ID to attach the comment to")
  },
  async ({ file_key, message, node_id }) => {
    try {
      const commentData: any = { message };
      
      // If node_id is provided, create a client_meta object
      if (node_id) {
        // Create a frame offset client_meta
        commentData.client_meta = {
          node_id: node_id,
          node_offset: {
            x: 0,
            y: 0
          }
        };
      }
      
      const commentResponse = await figmaApi.postComment(file_key, commentData);
      
      return {
        content: [
          { type: "text", text: `Comment added successfully!` },
          { type: "text", text: `Comment ID: ${commentResponse.id}` },
          { type: "text", text: `By user: ${commentResponse.user.handle}` },
          { type: "text", text: `Added at: ${new Date(commentResponse.created_at).toLocaleString()}` }
        ]
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return {
        content: [
          { type: "text", text: `Error adding comment: ${(error as Error).message}` }
        ]
      };
    }
  }
);

// Resource template for Figma files
server.resource(
  "figma-file",
  new ResourceTemplate("figma-file://{file_key}", {
    list: "figma-file://",
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

// Resource template for Figma nodes
server.resource(
  "figma-node",
  new ResourceTemplate("figma-node://{file_key}/{node_id}", {
    list: "figma-node://{file_key}",
  }),
  async (uri, { file_key, node_id }) => {
    try {
      // If only file_key is provided, list all top-level nodes
      if (!node_id) {
        const file = await figmaApi.getFile(file_key);
        
        return {
          contents: file.document.children?.map(node => ({
            uri: `figma-node://${file_key}/${node.id}`,
            title: node.name,
            description: `Type: ${node.type}`,
            text: `# ${node.name}\n\nType: ${node.type}\nID: ${node.id}`
          })) || []
        };
      }
      
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

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Figma MCP Server started");
