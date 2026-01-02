# ✅ Deployment Checklist

Copy this checklist and check off each item as you complete it!

---

## 📋 Pre-Deployment (2 minutes)

- [ ] All code changes are saved
- [ ] Git is initialized in the project
- [ ] Have a GitHub account
- [ ] Have a Render.com account (or ready to create one)

---

## 🚀 Deployment Steps

### 1️⃣ GitHub Setup (5 minutes)

- [ ] Commit all changes: `git add . && git commit -m "Add cloud deployment"`
- [ ] Create new repository on GitHub: https://github.com/new
- [ ] Note repository name: `_______________________`
- [ ] Add remote: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Push code: `git push -u origin main`
- [ ] Verify code is visible on GitHub

### 2️⃣ Render.com Setup (5 minutes)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Authorize Render to access repositories
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Click "Connect"
- [ ] Verify settings:
  - [ ] Name: `_______________________`
  - [ ] Region: `_______________________`
  - [ ] Plan: **Free**
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Deployment status: ✅ Live

### 3️⃣ Get Your URL (1 minute)

- [ ] Find your service URL in Render dashboard
- [ ] Copy URL: `https://_____________.onrender.com`
- [ ] WebSocket URL: `wss://_____________.onrender.com`
- [ ] Test health: Open `https://YOUR_URL/health` in browser
- [ ] Should see JSON with `"status": "ok"`

### 4️⃣ Test Figma Plugin (2 minutes)

- [ ] Open Figma (desktop or browser)
- [ ] Open the Cursor MCP Plugin
- [ ] Go to "Connection" tab
- [ ] Enter WebSocket URL: `wss://YOUR_URL.onrender.com`
- [ ] Click "Connect"
- [ ] Connection status: ✅ Connected
- [ ] See channel name displayed: `_______________________`

### 5️⃣ Test Full Integration (3 minutes)

- [ ] Open Cursor AI
- [ ] Verify MCP server is configured in `~/.cursor/mcp.json`
- [ ] Try a simple command: "Get document info from Figma"
- [ ] Command executes successfully ✅
- [ ] Try creating element: "Create a blue rectangle in Figma"
- [ ] Rectangle appears in Figma ✅

### 6️⃣ Setup Keep-Alive (Optional - 2 minutes)

- [ ] Go to https://uptimerobot.com
- [ ] Create free account
- [ ] Click "+ Add New Monitor"
- [ ] Settings:
  - [ ] Type: HTTP(s)
  - [ ] URL: `https://YOUR_URL.onrender.com/health`
  - [ ] Interval: 5 minutes
- [ ] Click "Create Monitor"
- [ ] Monitor status: ✅ Up

---

## 🧪 Final Verification

- [ ] Health endpoint returns 200 OK
- [ ] WebSocket connects without errors
- [ ] Can send commands from Cursor to Figma
- [ ] Can read Figma data in Cursor
- [ ] Service stays online (doesn't sleep)
- [ ] No error messages in:
  - [ ] Render dashboard logs
  - [ ] Figma plugin console
  - [ ] Cursor console

---

## 📝 Save Your Configuration

### Your Details:
```
GitHub Repository: https://github.com/_____________/______________
Render Service URL: https://_____________.onrender.com
WebSocket URL: wss://_____________.onrender.com
Channel Name (example): _______________________
UptimeRobot Monitor: ☐ Active  ☐ Not Setup
```

### Team Members (share these URLs):
```
WebSocket URL to share: wss://_____________.onrender.com

Instructions for team:
1. Open Figma Plugin
2. Enter URL: wss://_____________.onrender.com
3. Click Connect
4. Start using Cursor AI with Figma!
```

---

## ⏰ Timeline

- [ ] Step 1 (GitHub): _____ minutes (target: 5 min)
- [ ] Step 2 (Render): _____ minutes (target: 5 min)
- [ ] Step 3 (URL): _____ minutes (target: 1 min)
- [ ] Step 4 (Plugin): _____ minutes (target: 2 min)
- [ ] Step 5 (Test): _____ minutes (target: 3 min)
- [ ] Step 6 (Keep-Alive): _____ minutes (target: 2 min)

**Total Time**: _____ minutes (target: ~18 minutes)

---

## 🎉 Success Criteria

When all checkboxes are ✅, you have:

- ✅ Code deployed to cloud
- ✅ Free forever hosting
- ✅ Global access (from anywhere)
- ✅ Secure connections (WSS/SSL)
- ✅ Team collaboration ready
- ✅ 24/7 uptime (with UptimeRobot)
- ✅ Zero monthly costs

---

## 🐛 If Something Goes Wrong

### Can't push to GitHub?
→ Check: `git remote -v` shows correct URL
→ Try: `git remote remove origin` then re-add

### Render deployment fails?
→ Check: Render logs for error messages
→ Verify: `render.yaml` and `Dockerfile` exist in root

### Can't connect in Figma?
→ Wait: 60 seconds for cold start
→ Check: URL starts with `wss://` not `ws://`
→ Verify: `manifest.json` has correct domains

### Still stuck?
→ Read: `DEPLOYMENT.md` for detailed troubleshooting
→ Check: Render dashboard logs
→ Review: `MANUAL_SETUP.md` for step-by-step help

---

## 🎯 Quick Reference

| Need | File to Read |
|------|--------------|
| Quick setup | `QUICKSTART.md` |
| Full guide | `DEPLOYMENT.md` |
| Architecture info | `ARCHITECTURE.md` |
| Manual steps | `MANUAL_SETUP.md` |
| Summary | `BUILD_SUMMARY.md` |

---

## 💾 Save This Checklist

After completion, save your configuration details and keep this checklist for:
- Future deployments
- Team onboarding
- Troubleshooting reference

---

**Good luck! You've got this! 🚀**

Print this checklist or keep it open in another window while you deploy.

