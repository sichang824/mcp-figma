.PHONY: install start dev build test clean plugin plugin-dev start-all

install:
	bun install

start:
	bun run start

dev:
	bun run dev

build:
	bun run build

build-mcp:
	bun run build:mcp

# Build Figma plugin
plugin:
	@echo "Building Figma plugin..."
	bun build src/plugin/code.ts --outfile src/plugin/code.js --target browser

# Watch and rebuild Figma plugin in development
plugin-dev:
	@echo "Starting plugin development mode..."
	bun build src/plugin/code.ts --outfile src/plugin/code.js --target browser --watch

# Start both MCP server and Figma plugin development mode
start-all:
	@echo "Starting MCP server and Figma plugin..."
	@echo "MCP server running in background, press Ctrl+C to stop all processes"
	@(bun run mcp & echo "$$!" > .mcp.pid) && (bun build src/plugin/code.ts --outfile src/plugin/code.js --target browser --watch || (kill `cat .mcp.pid` && rm .mcp.pid))
	@if [ -f .mcp.pid ]; then kill `cat .mcp.pid` && rm .mcp.pid; fi

test:
	bun run test

clean:
	rm -rf dist
	rm -rf node_modules
	rm -f src/plugin/code.js
	rm -f .mcp.pid

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make start        - Start the server"
	@echo "  make dev          - Start the development server with auto-reload"
	@echo "  make mcp          - Start the MCP server with auto-reload"
	@echo "  make build        - Build the project"
	@echo "  make build-mcp    - Build the MCP server"
	@echo "  make plugin       - Build the Figma plugin"
	@echo "  make plugin-dev   - Start the Figma plugin development mode with auto-reload"
	@echo "  make start-all    - Start both MCP server and Figma plugin development mode"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Remove build artifacts and dependencies"

# Test the MCP server with inspector
mcp:
	@echo "Starting MCP test with inspector..."
	@npx @modelcontextprotocol/inspector bun --watch src/index.ts -e FIGMA_PERSONAL_ACCESS_TOKEN=${FIGMA_PERSONAL_ACCESS_TOKEN} -e WEBSOCKET_PORT=3001
