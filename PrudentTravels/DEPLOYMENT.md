# PrudentTravels Deployment Guide

This guide covers deploying the PrudentTravels application to production.

## Architecture Overview

- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js/Express API deployed on Render
- **Database**: PostgreSQL on Render or other cloud provider

## Backend Deployment (Render)

### 1. Create a Render Account
Go to [render.com](https://render.com) and sign up.

### 2. Create a PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `prudent-travels-db`
3. Database: `prudent_travels`
4. User: (auto-generated)
5. Region: Choose closest to your users
6. Plan: Free or Starter
7. Click "Create Database"
8. **Save the Internal Database URL** - you'll need this

### 3. Deploy Backend API

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `prudenttravels-api`
   - **Root Directory**: `PrudentTravels/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000

   # Database - Use the Internal Database URL from step 2
   # IMPORTANT: Copy the entire Internal Database URL from Render PostgreSQL dashboard
   DATABASE_URL=postgresql://user:password@host/database

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d

   # Email (Gmail example)
   # NOTE: For Gmail, use an App Password, not your regular password
   # Generate at: https://myaccount.google.com/apppasswords
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=PrudentTravels <noreply@prudenttravels.com>

   # Frontend URL (will be your Vercel URL)
   # Update this after deploying frontend
   FRONTEND_URL=https://your-app.vercel.app

   # CORS
   CORS_ORIGIN=https://your-app.vercel.app
   ```

   **⚠️ CRITICAL**: Make sure `DATABASE_URL` is set correctly. The backend now automatically:
   - Uses `DATABASE_URL` if available (Render/Heroku format)
   - Falls back to individual DB credentials for local development
   - Creates all database tables automatically on first run

5. Click "Create Web Service"
6. Wait for deployment to complete
7. **Save your API URL** (e.g., `https://prudenttravels-api.onrender.com`)

### 4. Verify Database Setup

The backend automatically creates all database tables on first run using Sequelize sync.

**Optional**: To check if tables were created successfully:
1. Go to your Render service → "Logs" tab
2. Look for: `✅ Database models synchronized (production mode)`
3. You should also see: `✅ Database connection has been established successfully`

**Note**: An initial admin user is automatically created with credentials:
- Email: `admin@prudenttravels.com`
- Password: `Admin@123`
- **⚠️ Change this password immediately after first login!**

## Frontend Deployment (Vercel)

### 1. Create a Vercel Account
Go to [vercel.com](https://vercel.com) and sign up with GitHub.

### 2. Deploy Frontend

1. Click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `PrudentTravels/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://prudenttravels-api.onrender.com/api/v1
   ```
   ⚠️ **IMPORTANT**: Replace with your actual Render backend URL from step 3.7

5. Click "Deploy"
6. Wait for deployment to complete
7. Your app will be live at `https://your-app.vercel.app`

### 3. Update Backend CORS

Go back to Render and update these environment variables with your Vercel URL:
```
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

## Vercel Environment Variables Setup

If you already deployed but forgot to add environment variables:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://prudenttravels-api.onrender.com/api/v1` (your backend URL)
   - **Environment**: Production, Preview, Development (select all)
4. Click "Save"
5. **Redeploy**: Go to "Deployments" → Click "..." on latest → "Redeploy"

## Common Issues

### Issue: Frontend shows "Loading..." forever

**Cause**: Frontend can't connect to backend API.

**Solutions**:
1. Check that `REACT_APP_API_URL` is set in Vercel environment variables
2. Verify backend is running on Render
3. Check CORS settings in backend allow your frontend URL
4. Redeploy frontend after adding environment variables

### Issue: CORS errors in browser console

**Cause**: Backend CORS not configured for frontend URL.

**Solution**:
1. Go to Render → Your backend service → Environment
2. Set `CORS_ORIGIN` to your Vercel URL
3. Restart the backend service

### Issue: Registration fails with "Error registering user"

**Cause**: Database tables don't exist or database connection failed.

**Solutions**:
1. Check Render logs for database connection errors
2. Verify `DATABASE_URL` is correctly set in environment variables
3. Ensure database is running on Render
4. Look for `✅ Database models synchronized` in logs
5. If tables aren't created, manually restart the backend service

### Issue: 500 Internal Server Error

**Cause**: Backend database connection issues or missing environment variables.

**Solutions**:
1. Verify `DATABASE_URL` is correct in Render (copy from PostgreSQL Internal Database URL)
2. Check database is running and accessible
3. Verify `JWT_SECRET` is set
4. Check backend logs in Render for specific error messages
5. Ensure `NODE_ENV=production` is set

### Issue: Routes return 404

**Cause**: SPA routing not configured properly.

**Solution for Vercel**:
Create `vercel.json` in frontend directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Testing Production Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit `https://your-backend.onrender.com/api/v1/health`
3. **Test Registration**: Try creating a new account
4. **Test Login**: Login with the account
5. **Test Features**: Book a destination, browse, etc.

## Monitoring

### Render (Backend)
- View logs: Dashboard → Your service → Logs
- Monitor health: Check metrics tab
- Set up alerts for downtime

### Vercel (Frontend)
- View deployment logs: Dashboard → Your project → Deployments
- Analytics: Enable Vercel Analytics in settings
- Monitor errors: Integrate with Sentry (optional)

## Environment Files Reference

### `.env.production` (Frontend - Local build)
```
REACT_APP_API_URL=https://prudenttravels-api.onrender.com/api/v1
```

### `.env` (Backend - Render)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use environment variables for all secrets (never commit)
- [ ] Enable HTTPS only (automatic on Vercel/Render)
- [ ] Set proper CORS origins (not *)
- [ ] Use secure email app passwords
- [ ] Enable database SSL in production
- [ ] Set up rate limiting on backend
- [ ] Implement proper error handling (no stack traces to client)

## Custom Domains (Optional)

### Vercel
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render
1. Go to your service → Settings → Custom Domain
2. Add your custom domain
3. Configure DNS CNAME record

## Support

For deployment issues:
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Project Issues**: Create an issue in the GitHub repository
