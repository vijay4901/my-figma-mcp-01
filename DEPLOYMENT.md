# 🚀 Deploying to Render.com (Free Forever)

This guide will help you deploy the WebSocket server to Render.com's free tier for lifetime hosting.

## 📋 Prerequisites

- GitHub account
- Render.com account (free, no credit card required)
- Git installed on your computer

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `design-with-ai`)
3. **Do not** initialize with README (you already have files)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## ☁️ Step 2: Deploy to Render.com

### 2.1 Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended)
4. Authorize Render to access your GitHub repositories

### 2.2 Create New Web Service

1. Click the **"New +"** button in the top right
2. Select **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Find and select your repository: `YOUR_USERNAME/YOUR_REPO_NAME`
5. Click **"Connect"**

### 2.3 Configure Web Service

Render will auto-detect the `render.yaml` configuration, but verify these settings:

**Basic Settings:**
- **Name**: `design-with-ai` (or your preferred name)
- **Region**: Choose closest to you (e.g., Oregon (US West))
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Docker`

**Build & Deploy:**
- **Dockerfile Path**: `./Dockerfile` (auto-detected)
- **Docker Command**: Will use CMD from Dockerfile

**Plan:**
- Select **"Free"** plan ($0/month)
- ⚠️ Free tier services spin down after 15 mins of inactivity
- ⚠️ Cold start time: 30-60 seconds

**Advanced Settings (Optional):**
- **Health Check Path**: `/health` (already configured)
- **Auto-Deploy**: Yes (recommended)

### 2.4 Deploy

1. Click **"Create Web Service"** at the bottom
2. Wait 5-10 minutes for the initial deployment
3. Watch the deployment logs for any errors

---

## 🌐 Step 3: Get Your WebSocket URL

### 3.1 Find Your Service URL

Once deployed, you'll see your service URL:
```
https://design-with-ai.onrender.com
```

### 3.2 WebSocket URL Format

Your WebSocket connection will use **WSS** (secure):
```
wss://figma-mcp-websocket.onrender.com
```

> **Note**: Replace `figma-mcp-websocket` with your actual service name

---

## 🔍 Step 4: Test Your Deployment

### 4.1 Test Health Endpoint

Open in your browser:
```
https://your-service-name.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "uptime": 123.456,
  "channels": 0,
  "timestamp": "2025-01-02T12:34:56.789Z"
}
```

### 4.2 Test Root Endpoint

Open in your browser:
```
https://your-service-name.onrender.com/
```

You should see:
```
Figma MCP WebSocket Server is running
```

---

## 🎨 Step 5: Connect Figma Plugin

### 5.1 Open Figma Plugin

1. In Figma, open the **Cursor MCP Plugin**
2. Go to the **Connection** tab

### 5.2 Enter WebSocket URL

In the "WebSocket Server URL" field, enter:
```
wss://your-service-name.onrender.com
```

### 5.3 Connect

1. Click the **"Connect"** button
2. Wait for the connection to establish
3. You should see: "Connected to wss://... in channel: xyz123"

---

## ⚡ Step 6: Prevent Auto-Sleep (Recommended)

Render's free tier spins down after 15 minutes of inactivity. To keep it alive:

### 6.1 Use UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Sign up for free account
3. Click **"+ Add New Monitor"**

**Monitor Settings:**
- **Monitor Type**: HTTP(s)
- **Friendly Name**: Figma MCP Keep-Alive
- **URL**: `https://your-service-name.onrender.com/health`
- **Monitoring Interval**: 5 minutes
- **Monitor Timeout**: 30 seconds

4. Click **"Create Monitor"**

**Result**: Your service will never sleep! UptimeRobot pings every 5 minutes.

### 6.2 Alternative: Cron-job.org

1. Go to https://cron-job.org
2. Create free account
3. Create new cron job to hit your health endpoint every 5 minutes

---

## 🔄 Step 7: Update MCP Server Configuration

### 7.1 Update Cursor MCP Config

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "DesignWithAI": {
      "command": "bunx",
      "args": [
        "design-with-ai@latest",
        "--server=your-service-name.onrender.com"
      ]
    }
  }
}
```

### 7.2 Restart Cursor

Close and reopen Cursor for changes to take effect.

---

## 📊 Monitoring & Logs

### View Logs in Render

1. Go to your Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time logs of connections and activity

### Key Metrics to Watch

- **Requests**: Number of HTTP/WebSocket requests
- **Bandwidth**: Data transferred
- **Build Time**: Time to deploy updates
- **Status**: Service health

---

## 🔧 Troubleshooting

### Issue: "Connection error - check URL and server status"

**Solutions:**
1. Verify the URL is correct (starts with `wss://`)
2. Check Render dashboard - service should be "Live"
3. Wait 60 seconds if service was sleeping (cold start)
4. Check Render logs for errors

### Issue: Service keeps spinning down

**Solution:**
- Set up UptimeRobot as described in Step 6
- Verify monitor is active and pinging every 5 minutes

### Issue: "Connection timeout"

**Solutions:**
1. Service might be doing cold start (wait 30-60 seconds)
2. Check if Render service is in "Suspended" state
3. Verify manifest.json has correct domain permissions

### Issue: WebSocket upgrade fails

**Solutions:**
1. Ensure you're using `wss://` not `ws://` for cloud
2. Check browser console for specific error messages
3. Verify Render service logs for connection attempts

---

## 💰 Cost Breakdown

### Render.com Free Tier

| Feature | Free Tier |
|---------|-----------|
| **Price** | $0/month forever |
| **Bandwidth** | 100 GB/month |
| **Build Minutes** | 500 minutes/month |
| **Instances** | Multiple free services |
| **Auto-sleep** | After 15 mins inactivity |
| **Cold Start** | 30-60 seconds |
| **SSL/TLS** | ✅ Included |
| **Custom Domains** | ✅ Supported |

### UptimeRobot Free Tier

| Feature | Free Tier |
|---------|-----------|
| **Price** | $0/month forever |
| **Monitors** | Up to 50 |
| **Check Interval** | 5 minutes |
| **Alerting** | ✅ Email alerts |

**Total Monthly Cost**: **$0** 🎉

---

## 🔐 Security Best Practices

### 1. Environment Variables

Store sensitive data in Render's environment variables:

1. In Render dashboard, go to your service
2. Click **"Environment"** tab
3. Add environment variables:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=https://figma.com`

### 2. Rate Limiting (Optional)

Add rate limiting to prevent abuse. Update `socket.ts`:

```typescript
const connectionCounts = new Map<string, number>();

// In WebSocket open handler:
const ip = req.headers.get('x-forwarded-for') || 'unknown';
const count = connectionCounts.get(ip) || 0;
if (count > 10) {
  ws.close(1008, 'Too many connections');
  return;
}
connectionCounts.set(ip, count + 1);
```

---

## 🚀 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render.com account created
- [ ] Web Service created and deployed
- [ ] Health endpoint responding
- [ ] WebSocket URL tested in Figma plugin
- [ ] Connection successful
- [ ] UptimeRobot monitor configured
- [ ] MCP server config updated
- [ ] All tests passing

---

## 📝 Quick Reference

### Your URLs (Replace with actual values)

```bash
# GitHub Repository
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

# Render Service
https://dashboard.render.com/web/YOUR_SERVICE_ID

# Health Check
https://your-service-name.onrender.com/health

# WebSocket URL (use in Figma plugin)
wss://your-service-name.onrender.com
```

### Useful Commands

```bash
# View Render logs (requires Render CLI)
render logs -f

# Redeploy service
git push origin main

# Test WebSocket locally
wscat -c ws://localhost:3055

# Test WebSocket on cloud
wscat -c wss://your-service-name.onrender.com
```

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **GitHub Issues**: Create an issue in your repository
- **Figma Forum**: https://forum.figma.com
- **MCP Documentation**: https://modelcontextprotocol.io

---

## 🎉 Success!

You now have a **lifetime free** WebSocket server running on Render.com! Your Figma plugin can connect from anywhere, and you can use Cursor AI to control Figma programmatically.

**Next Steps:**
- Customize the plugin for your workflow
- Add more MCP tools
- Share with your team
- Build amazing things! 🚀





