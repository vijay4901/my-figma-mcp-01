FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port 10000 (Render will map to PORT env var)
EXPOSE 10000

# Start the WebSocket server
CMD ["bun", "run", "src/socket.ts"]
