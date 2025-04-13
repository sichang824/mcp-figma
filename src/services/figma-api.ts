import axios from 'axios';
import { env } from '../config/env.js';
import type {
  GetFileResponse,
  GetFileNodesResponse,
  GetImageFillsResponse,
  GetImagesResponse,
  GetCommentsResponse, 
  GetFileVersionsResponse,
  GetTeamProjectsResponse,
  GetProjectFilesResponse,
  GetTeamComponentsResponse,
  GetFileComponentsResponse,
  GetComponentResponse,
  GetTeamComponentSetsResponse,
  GetFileComponentSetsResponse,
  GetComponentSetResponse,
  GetTeamStylesResponse,
  GetFileStylesResponse,
  GetStyleResponse,
  PostCommentRequestBody,
  PostCommentResponse,
} from "@figma/rest-api-spec";

const FIGMA_API_BASE_URL = 'https://api.figma.com/v1';

/**
 * Type definition for CreateFrameOptions
 */
export interface CreateFrameOptions {
  name: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  fills?: Array<{
    type: string; 
    color: { r: number; g: number; b: number }; 
    opacity: number;
  }>;
  pageId?: string;
}

/**
 * Type definition for the expected response when creating a frame
 */
export interface CreateFrameResponse {
  frame: {
    id: string;
    name: string;
  };
  success: boolean;
}

/**
 * Service for interacting with the Figma API
 */
export class FigmaApiService {
  private readonly headers: Record<string, string>;

  constructor(accessToken: string = env.FIGMA_PERSONAL_ACCESS_TOKEN) {
    this.headers = {
      'X-Figma-Token': accessToken,
    };
  }

  /**
   * Get file by key
   */
  async getFile(fileKey: string, params: { ids?: string; depth?: number; geometry?: string; plugin_data?: string; branch_data?: boolean } = {}): Promise<GetFileResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Get file nodes by key and node IDs
   */
  async getFileNodes(fileKey: string, nodeIds: string[], params: { depth?: number; geometry?: string; plugin_data?: string } = {}): Promise<GetFileNodesResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/nodes`, {
      headers: this.headers,
      params: {
        ...params,
        ids: nodeIds.join(','),
      },
    });
    return response.data;
  }

  /**
   * Get images for file nodes
   */
  async getImages(fileKey: string, nodeIds: string[], params: { 
    scale?: number; 
    format?: string; 
    svg_include_id?: boolean;
    svg_include_node_id?: boolean;
    svg_simplify_stroke?: boolean;
    use_absolute_bounds?: boolean;
    version?: string;
  } = {}): Promise<GetImagesResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/images/${fileKey}`, {
      headers: this.headers,
      params: {
        ...params,
        ids: nodeIds.join(','),
      },
    });
    return response.data;
  }

  /**
   * Get image fills for a file
   */
  async getImageFills(fileKey: string): Promise<GetImageFillsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/images`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get comments for a file
   */
  async getComments(fileKey: string, params: { as_md?: boolean } = {}): Promise<GetCommentsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/comments`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Post a comment to a file
   */
  async postComment(fileKey: string, data: PostCommentRequestBody): Promise<PostCommentResponse> {
    const response = await axios.post(
      `${FIGMA_API_BASE_URL}/files/${fileKey}/comments`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Create a new frame in a Figma file
   * Note: This uses the Figma Plugin API which requires appropriate permissions
   */
  async createFrame(fileKey: string, options: CreateFrameOptions): Promise<CreateFrameResponse> {
    // Build the frame creation request payload
    const payload = {
      node: {
        type: "FRAME",
        name: options.name,
        size: {
          width: options.width,
          height: options.height,
        },
        position: {
          x: options.x || 0,
          y: options.y || 0,
        },
        fills: options.fills || [],
      },
      pageId: options.pageId,
    };
    
    const response = await axios.post(
      `${FIGMA_API_BASE_URL}/files/${fileKey}/nodes`,
      payload,
      { headers: this.headers }
    );
    
    return {
      frame: {
        id: response.data.node.id,
        name: response.data.node.name,
      },
      success: true
    };
  }

  /**
   * Get file versions
   */
  async getFileVersions(fileKey: string): Promise<GetFileVersionsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/versions`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get team projects
   */
  async getTeamProjects(teamId: string): Promise<GetTeamProjectsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/teams/${teamId}/projects`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get project files
   */
  async getProjectFiles(projectId: string, params: { branch_data?: boolean } = {}): Promise<GetProjectFilesResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/projects/${projectId}/files`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Get team components
   */
  async getTeamComponents(teamId: string, params: { page_size?: number; after?: number; before?: number } = {}): Promise<GetTeamComponentsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/teams/${teamId}/components`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Get file components
   */
  async getFileComponents(fileKey: string): Promise<GetFileComponentsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/components`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get component by key
   */
  async getComponent(key: string): Promise<GetComponentResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/components/${key}`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get team component sets
   */
  async getTeamComponentSets(teamId: string, params: { page_size?: number; after?: number; before?: number } = {}): Promise<GetTeamComponentSetsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/teams/${teamId}/component_sets`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Get file component sets
   */
  async getFileComponentSets(fileKey: string): Promise<GetFileComponentSetsResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/component_sets`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get component set by key
   */
  async getComponentSet(key: string): Promise<GetComponentSetResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/component_sets/${key}`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get team styles
   */
  async getTeamStyles(teamId: string, params: { page_size?: number; after?: number; before?: number } = {}): Promise<GetTeamStylesResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/teams/${teamId}/styles`, {
      headers: this.headers,
      params,
    });
    return response.data;
  }

  /**
   * Get file styles
   */
  async getFileStyles(fileKey: string): Promise<GetFileStylesResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/files/${fileKey}/styles`, {
      headers: this.headers,
    });
    return response.data;
  }

  /**
   * Get style by key
   */
  async getStyle(key: string): Promise<GetStyleResponse> {
    const response = await axios.get(`${FIGMA_API_BASE_URL}/styles/${key}`, {
      headers: this.headers,
    });
    return response.data;
  }
}

export default new FigmaApiService();
