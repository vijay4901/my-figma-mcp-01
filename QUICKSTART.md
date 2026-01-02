# 🚀 Quick Start: Deploy to Render.com in 5 Minutes

## Prerequisites
- GitHub account
- Git installed

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git (if needed)
git init
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Render (2 minutes)

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your repository
5. Click **"Connect"**
6. Select **"Free"** plan
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment

## Step 3: Get Your URL (30 seconds)

Your WebSocket URL will be:
```
wss://your-service-name.onrender.com
```

## Step 4: Connect Figma Plugin (30 seconds)

1. Open Figma plugin
2. Enter WebSocket URL: `wss://your-service-name.onrender.com`
3. Click **"Connect"**
4. ✅ Done!

## Step 5: Keep It Alive (Optional - 2 minutes)

To prevent sleep:

1. Go to https://uptimerobot.com
2. Create free account
3. Add monitor with URL: `https://your-service-name.onrender.com/health`
4. Set interval: 5 minutes

---

## 🎉 That's It!

You now have a **free forever** cloud WebSocket server!

**Need more details?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete guide.

## Quick Troubleshooting

- **Can't connect?** Wait 60 seconds (cold start)
- **URL error?** Make sure it starts with `wss://`
- **Still issues?** Check the [full deployment guide](./DEPLOYMENT.md)

