/**
 * Utility functions for Figma MCP Server
 */

/**
 * Log function that writes to stderr instead of stdout
 * to avoid interfering with MCP stdio communication
 */
export function log(message: string): void {
  process.stderr.write(`${message}\n`);
}

/**
 * Error log function that writes to stderr
 */
export function logError(message: string, error?: unknown): void {
  const errorMessage = error instanceof Error 
    ? error.message 
    : error ? String(error) : 'Unknown error';
  
  process.stderr.write(`ERROR: ${message}: ${errorMessage}\n`);
} 