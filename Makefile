.PHONY: install start dev build test clean

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

# Test the MCP server with inspector
mcp:
	@echo "Starting MCP test with inspector..."
	@npx @modelcontextprotocol/inspector bun run mcp -e FIGMA_PERSONAL_ACCESS_TOKEN=${FIGMA_PERSONAL_ACCESS_TOKEN}
