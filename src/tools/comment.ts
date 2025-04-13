/**
 * Comment tools for the Figma MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import figmaApi from "../services/figma-api.js";

export const getCommentsTool = (server: McpServer) => {
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
};

export const addCommentTool = (server: McpServer) => {
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
};

/**
 * Registers all comment-related tools with the MCP server
 */
export const registerCommentTools = (server: McpServer): void => {
  getCommentsTool(server);
  addCommentTool(server);
};
