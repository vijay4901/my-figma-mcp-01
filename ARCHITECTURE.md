# 🏗️ Architecture Diagram

## Current Local Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Computer                            │
│                                                                   │
│  ┌────────────────┐         ┌──────────────┐                    │
│  │  Cursor AI     │         │   Figma      │                    │
│  │   (Editor)     │         │  (Desktop)   │                    │
│  │                │         │              │                    │
│  │  MCP Client    │         │   Plugin UI  │                    │
│  └───────┬────────┘         └──────┬───────┘                    │
│          │                         │                             │
│          │                         │                             │
│          │    ws://localhost:3055  │                             │
│          │         ┌───────────────┘                             │
│          │         │                                             │
│          └─────────┼─────────┐                                   │
│                    ↓         ↓                                   │
│            ┌────────────────────────┐                            │
│            │  WebSocket Server      │                            │
│            │  (Bun - Port 3055)     │                            │
│            │  - Channel: xyz123     │                            │
│            └────────────────────────┘                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Problem: ❌ Only works on your computer
         ❌ Requires local server running
         ❌ Can't share with team
```

---

## New Cloud Setup (Render.com)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Anywhere in World                         │
│                                                                   │
│  ┌────────────────┐         ┌──────────────┐                    │
│  │  Cursor AI     │         │   Figma      │                    │
│  │  (Your PC)     │         │  (Browser)   │                    │
│  │                │         │              │                    │
│  │  MCP Client    │         │   Plugin UI  │                    │
│  └───────┬────────┘         └──────┬───────┘                    │
│          │                         │                             │
│          │                         │                             │
│          │                         │                             │
└──────────┼─────────────────────────┼─────────────────────────────┘
           │                         │
           │    Internet (WSS - Secure)
           │                         │
           │    wss://your-app.onrender.com
           │                         │
           └─────────┬───────────────┘
                     │
    ┌────────────────┴─────────────────┐
    │                                   │
┌───▼───────────────────────────────────▼───┐
│        Render.com Cloud (Free)            │
│                                            │
│   ┌────────────────────────────────────┐  │
│   │   WebSocket Server (Docker)        │  │
│   │   - Bun Runtime                    │  │
│   │   - Health Check: /health          │  │
│   │   - Automatic SSL (wss://)         │  │
│   │   - Channel Management             │  │
│   │   - CORS Enabled                   │  │
│   └────────────────────────────────────┘  │
│                                            │
│   Auto-Sleep: 15 min inactivity            │
│   Cold Start: 30-60 seconds                │
└────────────────────────────────────────────┘
                     ▲
                     │
                     │ HTTP Ping every 5 min
                     │
    ┌────────────────┴─────────────────┐
    │   UptimeRobot (Free)              │
    │   - Prevents auto-sleep           │
    │   - Keeps server alive 24/7       │
    └───────────────────────────────────┘

Benefits: ✅ Works from anywhere
          ✅ No local server needed
          ✅ Team can collaborate
          ✅ Automatic SSL
          ✅ Free forever
```

---

## Data Flow Example

### 1. User sends command from Cursor AI

```
Cursor AI → "Create a rectangle in Figma"
    ↓
MCP Client converts to WebSocket message
    ↓
{
  "type": "message",
  "channel": "xyz123",
  "message": {
    "id": "abc-def",
    "command": "create_rectangle",
    "params": { "x": 100, "y": 100, "width": 200, "height": 100 }
  }
}
    ↓
Sent to: wss://your-app.onrender.com
```

### 2. Cloud server broadcasts to channel

```
Render.com receives message
    ↓
Finds all clients in channel "xyz123"
    ↓
Broadcasts to Figma plugin
    ↓
{
  "type": "broadcast",
  "sender": "peer",
  "channel": "xyz123",
  "message": { ... }
}
```

### 3. Figma plugin executes and responds

```
Figma Plugin receives command
    ↓
Executes: figma.createRectangle(...)
    ↓
Sends result back
    ↓
{
  "id": "abc-def",
  "result": {
    "name": "Rectangle",
    "id": "node-123"
  }
}
    ↓
Broadcast to channel "xyz123"
    ↓
Cursor receives result ✅
```

---

## File Structure

```
design-with-ai/
│
├── 📄 Deployment Files (New!)
│   ├── render.yaml              # Render.com config
│   ├── Dockerfile               # Docker container
│   ├── .dockerignore           # Exclude files
│   ├── DEPLOYMENT.md           # Full guide
│   ├── QUICKSTART.md           # 5-min guide
│   └── MANUAL_SETUP.md         # Setup steps
│
├── 🔧 Source Code (Modified)
│   ├── src/
│   │   ├── socket.ts           # ✏️ Updated for cloud
│   │   ├── talk_to_figma_mcp/
│   │   │   └── server.ts       # MCP server
│   │   └── cursor_mcp_plugin/
│   │       ├── code.js         # Plugin logic
│   │       ├── ui.html         # ✏️ Updated UI
│   │       └── manifest.json   # ✏️ Cloud permissions
│   │
│   ├── package.json            # Dependencies
│   └── readme.md               # ✏️ Added cloud info
│
└── 📦 Config Files
    ├── .gitignore              # Git exclusions
    └── tsconfig.json           # TypeScript config
```

---

## Channel System

```
When Figma Plugin connects:
    ↓
Generates random channel: "xyz123"
    ↓
Joins channel on server
    ↓
Server tracks: Map<channelName, Set<WebSocket>>

channels = {
  "xyz123": [
    <WebSocket from Cursor>,
    <WebSocket from Figma>
  ],
  "abc456": [
    <WebSocket from another Cursor>,
    <WebSocket from another Figma>
  ]
}

Benefits:
- ✅ Isolation: Each session is separate
- ✅ Multiple teams can use same server
- ✅ No message cross-contamination
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│   SSL/TLS Encryption (WSS)          │ ← Automatic via Render
├─────────────────────────────────────┤
│   CORS Headers                      │ ← Allows Figma domain
├─────────────────────────────────────┤
│   Channel Isolation                 │ ← Random channel names
├─────────────────────────────────────┤
│   Figma Plugin Permissions          │ ← Manifest.json
├─────────────────────────────────────┤
│   Network Access Control            │ ← Allowed domains only
└─────────────────────────────────────┘

Optional Additional Layers:
- Token-based authentication
- Rate limiting per IP
- Request validation
- Logging and monitoring
```

---

## Deployment Pipeline

```
1. Local Development
   ├── Write code
   ├── Test locally (ws://localhost:3055)
   └── Commit changes

2. Push to GitHub
   ├── git add .
   ├── git commit -m "..."
   └── git push origin main

3. Render.com Auto-Deploy
   ├── Detects push
   ├── Reads render.yaml
   ├── Builds Docker image
   ├── Deploys container
   └── Assigns URL: your-app.onrender.com

4. Production Ready
   ├── Health check: /health responds
   ├── WebSocket: wss:// available
   └── SSL certificate: automatic

5. Keep Alive
   └── UptimeRobot pings every 5 min
```

---

## Cost Breakdown

```
Monthly Costs:
┌──────────────────────┬─────────┬──────────┐
│ Service              │ Tier    │ Cost     │
├──────────────────────┼─────────┼──────────┤
│ Render.com           │ Free    │ $0       │
│ GitHub               │ Free    │ $0       │
│ UptimeRobot          │ Free    │ $0       │
│ SSL Certificate      │ Free    │ $0       │
│ Domain (optional)    │ Own     │ ~$12/yr  │
└──────────────────────┴─────────┴──────────┘
                       TOTAL:     $0/month

Free Tier Limits (Render.com):
- 100 GB bandwidth/month
- 500 build minutes/month
- Unlimited web services
- Auto-sleep after 15 min (solved with UptimeRobot)
```

---

## Comparison: Local vs Cloud

```
┌──────────────────────┬──────────────┬───────────────┐
│ Feature              │ Local        │ Cloud         │
├──────────────────────┼──────────────┼───────────────┤
│ Setup Time           │ 5 minutes    │ 15 minutes    │
│ Access               │ Your PC only │ Anywhere      │
│ Team Sharing         │ ❌           │ ✅            │
│ SSL/HTTPS            │ ❌           │ ✅ Auto       │
│ Server Uptime        │ Manual       │ 24/7          │
│ Cost                 │ $0           │ $0            │
│ Maintenance          │ Manual       │ Automatic     │
│ Port Forwarding      │ Required     │ Not needed    │
│ Firewall Issues      │ Possible     │ None          │
│ Mobile Access        │ ❌           │ ✅            │
└──────────────────────┴──────────────┴───────────────┘

Recommendation: Use Cloud for production!
```

---

This architecture provides a scalable, secure, and free solution for Figma-Cursor integration! 🚀





