.PHONY: install start dev build test clean

install:
	bun install

start:
	bun run start

dev:
	bun run dev

mcp:
	bun run mcp

build:
	bun run build

build-mcp:
	bun run build:mcp

test:
	bun run test

clean:
	rm -rf dist
	rm -rf node_modules

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make start      - Start the server"
	@echo "  make dev        - Start the development server with auto-reload"
	@echo "  make mcp        - Start the MCP server with auto-reload"
	@echo "  make build      - Build the project"
	@echo "  make build-mcp  - Build the MCP server"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Remove build artifacts and dependencies"

run-mcp-with-token:
	FIGMA_PERSONAL_ACCESS_TOKEN=temporary_test_token bun run dist/mcp-index.js

# Test the MCP server with a simple script
test-mcp:
	@echo "Starting MCP test..."
	@node test-mcp.js | bun run dist/mcp-index.js
