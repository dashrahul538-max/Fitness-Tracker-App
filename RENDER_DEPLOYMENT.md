# Render Deployment Guide

## Prerequisites
- GitHub account with repository
- Render account (https://render.com)

## Steps to Deploy

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Fitness Tracker App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitness-tracker-app.git
git push -u origin main
```

### 2. Create a New Web Service on Render

1. Log in to **Render Dashboard** (https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Choose **Deploy an existing repository** and select your GitHub repo
4. Fill in the details:
   - **Name**: `fitness-tracker-app` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. Configure Environment Variables (if needed)
- In the Render dashboard, go to **Environment** tab
- Add any custom variables (currently using default PORT from Render)

### 4. Deploy
Click **Create Web Service** and wait for deployment to complete.

Your app will be available at: `https://your-app-name.onrender.com`

## Important Notes

### Database Persistence
- SQLite database is stored in the `db/` directory
- Each time the service restarts, the database resets
- **For persistent data**, migrate to a cloud database like:
  - PostgreSQL (Render offers free tier)
  - MongoDB Atlas
  - Firebase Realtime Database

### Free Tier Limitations on Render
- Service spins down after 15 minutes of inactivity
- First spin-up after inactivity takes ~30 seconds
- Free tier may not be suitable for production apps with real users

### Recommended Database Migration (PostgreSQL)
```javascript
// Replace SQLite with PostgreSQL
// Install: npm install pg
// Update db/database.js to use PostgreSQL client
```

### Recommendations for Production
1. **Use a cloud database** instead of SQLite
2. **Set up monitoring** to track performance
3. **Enable auto-deploy** from GitHub commits
4. **Add error tracking** (Sentry.io integration)
5. **Set up custom domain** if you have one
6. **Enable HTTPS** (automatic with Render)

## Troubleshooting

**App keeps crashing?**
- Check logs: Dashboard → Service → Logs tab
- Verify build command completes successfully
- Check for PORT environment issues

**Database lost after restart?**
- SQLite data is ephemeral on Render
- Need to migrate to persistent database

**Build failures?**
- Run locally: `npm run build && npm start`
- Check package.json for correct dependencies
- Verify all imports are correct

## Quick Links
- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
