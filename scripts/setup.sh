#!/bin/bash

# Create .cursor directory if it doesn't exist
mkdir -p .cursor

bun install

# Create mcp.json with the current directory path
echo "{
  \"mcpServers\": {
    \"DesignWithAI\": {
      \"command\": \"bunx\",
      \"args\": [
        \"design-with-ai@latest\"
      ]
    }
  }
}" > .cursor/mcp.json 