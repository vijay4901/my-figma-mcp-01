import { Server, ServerWebSocket } from "bun";

// Store clients by channel
const channels = new Map<string, Set<ServerWebSocket<any>>>();

function handleConnection(ws: ServerWebSocket<any>) {
  // Don't add to clients immediately - wait for channel join
  console.log("New client connected");

  // Send welcome message to the new client
  ws.send(JSON.stringify({
    type: "system",
    message: "Please join a channel to start chatting",
  }));

  ws.close = () => {
    console.log("Client disconnected");

    // Remove client from their channel
    channels.forEach((clients, channelName) => {
      if (clients.has(ws)) {
        clients.delete(ws);

        // Notify other clients in same channel
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "system",
              message: "A user has left the channel",
              channel: channelName
            }));
          }
        });
      }
    });
  };
}

const PORT = parseInt(process.env.PORT || "10000", 10);
const HOSTNAME = "0.0.0.0"; // Always bind to 0.0.0.0 for cloud compatibility

const server = Bun.serve({
  port: PORT,
  hostname: HOSTNAME,
  fetch(req: Request, server: Server) {
    const url = new URL(req.url);
    
    // Log all incoming requests
    console.log(`Incoming request: ${req.method} ${url.pathname}`);
    console.log(`Headers:`, Object.fromEntries(req.headers.entries()));
    
    // Health check endpoint for Render.com
    if (url.pathname === "/health" && req.method === "GET") {
      return new Response(JSON.stringify({ 
        status: "ok", 
        uptime: process.uptime(),
        channels: channels.size,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Root endpoint
    if (url.pathname === "/" && req.method === "GET") {
      // Check if this is a WebSocket upgrade request
      const upgradeHeader = req.headers.get("upgrade");
      if (upgradeHeader?.toLowerCase() === "websocket") {
        console.log("⚡ WebSocket upgrade request at root path");
        const success = server.upgrade(req);
        if (success) {
          console.log("✅ WebSocket upgrade successful");
          return;
        }
        console.error("❌ WebSocket upgrade failed");
      }
      
      return new Response("Figma MCP WebSocket Server is running", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain",
        },
      });
    }

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Handle WebSocket upgrade for any path
    const upgradeHeader = req.headers.get("upgrade");
    if (upgradeHeader?.toLowerCase() === "websocket") {
      console.log(`⚡ WebSocket upgrade request at ${url.pathname}`);
      const success = server.upgrade(req);

      if (success) {
        console.log("✅ WebSocket upgrade successful");
        return; // Upgraded to WebSocket
      }
      
      console.error("❌ WebSocket upgrade failed");
      return new Response("WebSocket upgrade failed", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Return response for non-WebSocket requests
    return new Response("Use WebSocket protocol to connect", {
      status: 426,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Upgrade": "websocket",
      },
    });
  },
  },
  websocket: {
    open: handleConnection,
    message(ws: ServerWebSocket<any>, message: string | Buffer) {
      try {
        const data = JSON.parse(message as string);
        console.log(`\n=== Received message from client ===`);
        console.log(`Type: ${data.type}, Channel: ${data.channel || 'N/A'}`);
        if (data.message?.command) {
          console.log(`Command: ${data.message.command}, ID: ${data.id}`);
        } else if (data.message?.result) {
          console.log(`Response: ID: ${data.id}, Has Result: ${!!data.message.result}`);
        }
        console.log(`Full message:`, JSON.stringify(data, null, 2));

        if (data.type === "join") {
          const channelName = data.channel;
          if (!channelName || typeof channelName !== "string") {
            ws.send(JSON.stringify({
              type: "error",
              message: "Channel name is required"
            }));
            return;
          }

          // Create channel if it doesn't exist
          if (!channels.has(channelName)) {
            channels.set(channelName, new Set());
          }

          // Add client to channel
          const channelClients = channels.get(channelName)!;
          channelClients.add(ws);

          console.log(`\n✓ Client joined channel "${channelName}" (${channelClients.size} total clients)`);

          // Notify client they joined successfully
          ws.send(JSON.stringify({
            type: "system",
            message: `Joined channel: ${channelName}`,
            channel: channelName
          }));

          ws.send(JSON.stringify({
            type: "system",
            message: {
              id: data.id,
              result: "Connected to channel: " + channelName,
            },
            channel: channelName
          }));

          // Notify other clients in channel
          channelClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "system",
                message: "A new user has joined the channel",
                channel: channelName
              }));
            }
          });
          return;
        }

        // Handle regular messages
        if (data.type === "message") {
          const channelName = data.channel;
          if (!channelName || typeof channelName !== "string") {
            ws.send(JSON.stringify({
              type: "error",
              message: "Channel name is required"
            }));
            return;
          }

          const channelClients = channels.get(channelName);
          if (!channelClients || !channelClients.has(ws)) {
            ws.send(JSON.stringify({
              type: "error",
              message: "You must join the channel first"
            }));
            return;
          }

          // Broadcast to all OTHER clients in the channel (not the sender)
          // This prevents echo and ensures proper request-response flow
          let broadcastCount = 0;
          channelClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              broadcastCount++;
              const broadcastMessage = {
                type: "broadcast",
                message: data.message,
                sender: "peer",
                channel: channelName
              };
              console.log(`\n=== Broadcasting to peer #${broadcastCount} ===`);
              console.log(JSON.stringify(broadcastMessage, null, 2));
              client.send(JSON.stringify(broadcastMessage));
            }
          });
          
          if (broadcastCount === 0) {
            console.log(`⚠️  No other clients in channel "${channelName}" to receive message!`);
          } else {
            console.log(`✓ Broadcast to ${broadcastCount} peer(s) in channel "${channelName}"`);
          }
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    },
    close(ws: ServerWebSocket<any>) {
      // Remove client from their channel
      channels.forEach((clients) => {
        clients.delete(ws);
      });
    }
  }
});

console.log(`🚀 WebSocket server running on ${HOSTNAME}:${server.port}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Health check available at: http://${HOSTNAME}:${server.port}/health`);
