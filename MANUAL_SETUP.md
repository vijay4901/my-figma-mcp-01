# 🎯 Manual Setup Steps

After all the code changes, here's what you need to do manually:

## 📋 Files Created/Modified

### ✅ Files Created (Already Done)
- ✅ `render.yaml` - Render.com deployment configuration
- ✅ `Dockerfile` - Docker container configuration
- ✅ `.dockerignore` - Files to exclude from Docker build
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `QUICKSTART.md` - 5-minute quick start guide

### ✅ Files Modified (Already Done)
- ✅ `src/socket.ts` - Updated for cloud deployment with health checks
- ✅ `src/cursor_mcp_plugin/ui.html` - Updated UI for cloud WebSocket URLs
- ✅ `src/cursor_mcp_plugin/manifest.json` - Added cloud domain permissions
- ✅ `readme.md` - Added cloud deployment section

---

## 🔧 Manual Steps You Need to Do

### Step 1: GitHub Setup (5 minutes)

```bash
# 1. Make sure all changes are committed
git add .
git commit -m "Add Render.com deployment support"

# 2. Create a new repository on GitHub
# Go to: https://github.com/new
# Create repository (e.g., "figma-mcp-websocket")

# 3. Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Render.com Deployment (5 minutes)

1. **Sign Up**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub (recommended)
   - Authorize Render to access your repositories

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Click "Connect"

3. **Configure Service**
   - **Name**: `design-with-ai` (or your choice)
   - **Region**: Choose closest to you
   - **Plan**: Select **"Free"**
   - Click "Create Web Service"

4. **Wait for Deployment**
   - Initial deployment takes 5-10 minutes
   - Watch the logs for any errors
   - Once deployed, note your URL

### Step 3: Test Your Deployment (2 minutes)

1. **Test Health Endpoint**
   ```
   Open in browser: https://your-app.onrender.com/health
   ```
   Should see JSON response with status "ok"

2. **Test Root Endpoint**
   ```
   Open in browser: https://your-app.onrender.com/
   ```
   Should see: "Figma MCP WebSocket Server is running"

### Step 4: Configure Figma Plugin (1 minute)

1. Open Figma and run your plugin
2. In the Connection tab, enter:
   ```
   wss://your-app.onrender.com
   ```
   (Replace `your-app` with your actual Render service name)
3. Click "Connect"
4. You should see: "Connected to wss://your-app.onrender.com in channel: xyz123"

### Step 5: Setup Keep-Alive (Optional - 2 minutes)

To prevent your free Render service from sleeping:

1. **Sign up for UptimeRobot**
   - Go to https://uptimerobot.com
   - Create free account

2. **Add Monitor**
   - Click "+ Add New Monitor"
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-app.onrender.com/health`
   - **Interval**: 5 minutes
   - Click "Create Monitor"

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────┐
│     Figma Desktop/Browser       │
│     (Figma Plugin Running)      │
└────────────┬────────────────────┘
             │
             │ WSS (Secure WebSocket)
             │ wss://your-app.onrender.com
             │
             ↓
┌─────────────────────────────────┐
│     Render.com (Free Tier)      │
│   WebSocket Server (Bun/Docker) │
│      - Health Checks: /health   │
│      - Auto-SSL/TLS             │
│      - Channel Management       │
└────────────┬────────────────────┘
             │
             │ Channels (xyz123)
             │
             ↓
┌─────────────────────────────────┐
│      Cursor AI (Your Computer)  │
│      MCP Client Connected        │
│   bunx design-with-ai           │
└─────────────────────────────────┘

Optional: UptimeRobot → Pings /health every 5 min
          (Prevents service from sleeping)
```

---

## 📝 Environment Differences

### Local Development
```
WebSocket URL: ws://localhost:3055
SSL: No
Access: Only from your computer
```

### Cloud Production (Render.com)
```
WebSocket URL: wss://your-app.onrender.com
SSL: Yes (automatic)
Access: From anywhere
```

---

## 🔐 Security Notes

### What's Secured
- ✅ WSS (WebSocket Secure) encryption
- ✅ CORS enabled for Figma domains
- ✅ Channel-based isolation
- ✅ Automatic SSL certificates

### What's NOT Included (Optional Enhancements)
- ❌ Authentication (channels are random but not authenticated)
- ❌ Rate limiting (unlimited connections per IP)
- ❌ Request validation beyond basic WebSocket protocol

If you need authentication, consider adding:
```typescript
// Example: Simple token-based auth
const VALID_TOKENS = process.env.VALID_TOKENS?.split(',') || [];

// In WebSocket message handler:
if (data.type === "join" && !VALID_TOKENS.includes(data.token)) {
  ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
  ws.close();
  return;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Can't connect to cloud URL
**Solution**: 
- Wait 60 seconds (cold start)
- Check service is "Live" in Render dashboard
- Verify URL starts with `wss://` not `ws://`

### Issue: "Network access not allowed"
**Solution**: 
- Check `manifest.json` has your Render domain
- Rebuild the Figma plugin
- Reload the plugin in Figma

### Issue: Connection keeps dropping
**Solution**: 
- Service is sleeping - set up UptimeRobot
- Check Render logs for errors
- Verify network stability

### Issue: "Port already in use" (local)
**Solution**: 
```bash
# Find and kill process using port 3055
lsof -ti:3055 | xargs kill -9

# Or use different port
PORT=3056 bun socket
```

---

## 📊 Testing Checklist

- [ ] Health endpoint responds: `https://your-app.onrender.com/health`
- [ ] Root endpoint responds: `https://your-app.onrender.com/`
- [ ] Figma plugin connects with cloud URL
- [ ] Can send messages between Cursor and Figma
- [ ] MCP tools work correctly
- [ ] UptimeRobot monitor is active
- [ ] Service doesn't sleep after 15 minutes

---

## 🎉 Success Criteria

When everything is working, you should be able to:

1. ✅ Open Figma plugin from anywhere
2. ✅ Connect to cloud WebSocket server
3. ✅ Use Cursor AI to control Figma
4. ✅ Server stays online 24/7 (with UptimeRobot)
5. ✅ Zero monthly costs

---

## 📚 Resources

- **Render Documentation**: https://render.com/docs
- **Bun Documentation**: https://bun.sh/docs
- **WebSocket API**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **Figma Plugin API**: https://www.figma.com/plugin-docs/

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs in Render dashboard
2. Review `DEPLOYMENT.md` for detailed troubleshooting
3. Check browser console in Figma plugin
4. Verify all files were pushed to GitHub
5. Create an issue in your repository

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Render settings
2. **Environment Variables**: Store secrets in Render's Environment tab
3. **Auto-Deploy**: Enable in Render to auto-deploy on git push
4. **Monitoring**: Use Render's built-in metrics dashboard
5. **Logging**: Use `console.log` - visible in Render logs tab

---

## 🚀 Next Steps

After successful deployment:

1. Share the cloud URL with your team
2. Customize MCP tools for your workflow
3. Add authentication if needed
4. Consider upgrading to paid plan for no sleep time
5. Build amazing Figma automations!

---

**Estimated Total Setup Time**: 15-20 minutes

**Monthly Cost**: $0 (Free forever with Render + UptimeRobot)

**Result**: Production-ready cloud WebSocket server! 🎉





