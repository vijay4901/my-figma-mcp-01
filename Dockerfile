FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (Render assigns dynamically via PORT env var)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/health || exit 1

# Start the WebSocket server
CMD ["bun", "run", "src/socket.ts"]
