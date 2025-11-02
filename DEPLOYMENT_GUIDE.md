# 🚀 PrudentTravels Deployment Guide

Complete guide to deploy PrudentTravels online using **Vercel** (Frontend), **Render** (Backend), and **Render PostgreSQL** (Database).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Render PostgreSQL)](#1-database-setup-render-postgresql)
3. [Backend Deployment (Render)](#2-backend-deployment-render)
4. [Frontend Deployment (Vercel)](#3-frontend-deployment-vercel)
5. [Post-Deployment Configuration](#4-post-deployment-configuration)
6. [Testing Your Deployment](#5-testing-your-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Alternative Free Database Options](#alternative-free-database-options)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ GitHub account (free)
- ✅ Vercel account (free) - Sign up at [vercel.com](https://vercel.com)
- ✅ Render account (free) - Sign up at [render.com](https://render.com)
- ✅ Your code pushed to a GitHub repository
- ✅ Email account for sending emails (Gmail, etc.)
- ✅ (Optional) Cloudinary account for image uploads
- ✅ (Optional) Stripe account for payments

---

## 1. Database Setup (Render PostgreSQL)

### Option A: Using Render PostgreSQL (Recommended - Easiest)

**Free Tier Limits:**
- ✅ 256 MB RAM
- ✅ 1 GB Storage
- ✅ Expires after 90 days (you'll need to create a new one)
- ✅ Perfect for development/testing

**Steps:**

1. **Login to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   ```
   Name: prudenttravels-db
   Database: prudenttravels
   User: prudenttravels_user
   Region: Oregon (US West) - or closest to you
   Plan: Free
   ```

3. **Create Database**
   - Click "Create Database"
   - Wait for it to provision (1-2 minutes)

4. **Get Connection Details**
   - After creation, click on your database
   - Under "Connections", you'll see:
     - **Internal Database URL** (use this for Render backend)
     - **External Database URL** (use this for local development)
   - Copy the **Internal Database URL** - you'll need it later

5. **Initialize Database Schema**

   You have two options:

   **Option 1: Using Render Shell (Recommended)**
   - In your database dashboard, click "Shell"
   - Run these commands one by one:
   ```bash
   # Copy the contents of PrudentTravels/database/schema.sql
   # Paste and run in the shell

   # Then copy and run indexes.sql

   # Optional: Load sample data with sample-data.sql
   ```

   **Option 2: Using a PostgreSQL Client**
   - Download [pgAdmin](https://www.pgadmin.org/) or [TablePlus](https://tableplus.com/)
   - Connect using the **External Database URL**
   - Import files in this order:
     1. `database/schema.sql`
     2. `database/indexes.sql`
     3. `database/sample-data.sql` (optional)

---

## 2. Backend Deployment (Render)

### Steps:

1. **Create Web Service**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `YourUsername/PrudentTravels`

2. **Configure Service**
   ```
   Name: prudenttravels-api
   Region: Oregon (US West) - SAME as database
   Branch: main (or your deployment branch)
   Root Directory: PrudentTravels/backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

3. **Set Environment Variables**

   Click "Advanced" → "Add Environment Variable" for each:

   ```bash
   # Required Variables
   NODE_ENV=production
   PORT=10000

   # Database (use Internal Database URL from Step 1)
   DATABASE_URL=postgresql://prudenttravels_user:password@host/prudenttravels

   # JWT Configuration
   JWT_SECRET=your_super_secret_random_string_change_this
   JWT_EXPIRE=30d

   # Frontend URL (we'll update this after deploying frontend)
   CLIENT_URL=https://your-app.vercel.app

   # Email Configuration (use Gmail App Password)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=noreply@prudenttravels.com

   # Admin Account
   ADMIN_EMAIL=admin@prudenttravels.com
   ADMIN_PASSWORD=ChangeThisPassword123!

   # Optional: Cloudinary (for image uploads)
   CLOUDINARY_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Optional: Stripe (for payments)
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```

   **Important Notes:**
   - For `DATABASE_URL`: Use the **Internal Database URL** from Render PostgreSQL
   - For `JWT_SECRET`: Generate a random string (at least 32 characters)
   - For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
   - `CLIENT_URL` will be updated after frontend deployment

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment (5-10 minutes)
   - Your API will be at: `https://prudenttravels-api.onrender.com`

5. **Verify Deployment**
   - Visit: `https://your-backend-url.onrender.com/health`
   - You should see:
   ```json
   {
     "success": true,
     "message": "PrudentTravels API is running",
     "timestamp": "2025-11-02T...",
     "environment": "production"
   }
   ```

---

## 3. Frontend Deployment (Vercel)

### Steps:

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository: `YourUsername/PrudentTravels`

2. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: PrudentTravels/frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Set Environment Variables**

   Click "Environment Variables" and add:

   ```bash
   # API URL (use your Render backend URL from Step 2)
   REACT_APP_API_URL=https://prudenttravels-api.onrender.com/api/v1
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment (2-5 minutes)
   - Your app will be at: `https://your-app.vercel.app`

5. **Custom Domain (Optional)**
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain (e.g., `prudenttravels.com`)
   - Follow DNS configuration instructions

---

## 4. Post-Deployment Configuration

### Update Backend CLIENT_URL

1. Go to your Render backend dashboard
2. Navigate to "Environment"
3. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
4. Click "Save Changes"
5. Render will automatically redeploy

### Update Database Connection (If needed)

If you're using Sequelize and need to update the database config:

1. In `backend/src/config/database.js`, ensure it uses `DATABASE_URL`:
   ```javascript
   use: process.env.DATABASE_URL
   ```

### Enable Auto-Deploy

**For Backend (Render):**
- Already enabled by default
- Every push to your main branch will trigger a deployment

**For Frontend (Vercel):**
- Already enabled by default
- Every push to your main branch will trigger a deployment

---

## 5. Testing Your Deployment

### Test Backend API

```bash
# Health check
curl https://your-backend.onrender.com/health

# Test registration
curl -X POST https://your-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "Test1234"
  }'
```

### Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to register a new account
3. Check if you receive a verification email
4. Try logging in
5. Browse destinations
6. Test booking flow

### Common Issues to Check

- ✅ CORS errors? → Check `CLIENT_URL` in backend env variables
- ✅ Database connection errors? → Verify `DATABASE_URL` is correct
- ✅ API not responding? → Check Render logs in dashboard
- ✅ 404 errors? → Ensure routes are correctly configured

---

## Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → Logs
- Ensure `PORT` is set to `10000` (Render's default)
- Verify database connection string is correct

**Database connection fails**
- Use **Internal Database URL** (not External) on Render
- Ensure database is in the same region as backend
- Check database is not expired (free tier expires after 90 days)

**Email not sending**
- For Gmail, use an App Password, not regular password
- Enable "Less secure app access" in Gmail settings
- Check EMAIL_HOST, EMAIL_PORT are correct

### Frontend Issues

**API requests failing (CORS)**
- Update `CLIENT_URL` in backend to match your Vercel URL
- Include `https://` in the URL

**Environment variables not working**
- Must start with `REACT_APP_`
- Rebuild the app after adding env variables
- In Vercel: Settings → Environment Variables → Redeploy

**404 on page refresh**
- Already handled by `vercel.json` configuration
- All routes redirect to `index.html`

### Database Issues

**Free database expired**
- Render free PostgreSQL expires after 90 days
- Export your data before expiration
- Create a new database and import data
- Update `DATABASE_URL` in backend

**Out of storage**
- Free tier: 1GB limit
- Clear old data or upgrade plan
- Monitor usage in Render dashboard

---

## Alternative Free Database Options

If you need alternatives to Render PostgreSQL:

### 1. **Neon** (Recommended Alternative)
- **Free Tier:** 0.5 GB storage, 10 GB data transfer
- **Never expires**
- **Serverless PostgreSQL**
- **Setup:** [neon.tech](https://neon.tech)
- Get connection string and use as `DATABASE_URL`

### 2. **Supabase**
- **Free Tier:** 500 MB database, 1 GB file storage
- **Includes:** Auth, Storage, Real-time subscriptions
- **Never expires**
- **Setup:** [supabase.com](https://supabase.com)
- Get PostgreSQL connection string from Settings → Database

### 3. **ElephantSQL**
- **Free Tier:** 20 MB storage (very limited)
- **Good for:** Small projects, testing
- **Setup:** [elephantsql.com](https://elephantsql.com)

### 4. **Railway**
- **Free Tier:** $5 credit/month
- **Includes:** PostgreSQL, Redis, etc.
- **Setup:** [railway.app](https://railway.app)

**Recommendation:** Start with **Render PostgreSQL** for simplicity, then migrate to **Neon** or **Supabase** for long-term projects.

---

## 🎉 Deployment Complete!

Your PrudentTravels application is now live!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://prudenttravels-api.onrender.com`
- Database: Hosted on Render

**Next Steps:**
1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure email templates
4. ✅ Set up Cloudinary for image uploads
5. ✅ Configure Stripe for payments
6. ✅ Monitor application logs
7. ✅ Set up error tracking (Sentry, LogRocket)
8. ✅ Configure analytics (Google Analytics)

**Important Security Notes:**
- 🔒 Change default admin password immediately
- 🔒 Use strong JWT_SECRET (32+ random characters)
- 🔒 Never commit .env files to Git
- 🔒 Enable 2FA on Vercel and Render accounts
- 🔒 Regularly update dependencies

**Cost Monitoring:**
- Vercel Free: 100 GB bandwidth, unlimited builds
- Render Free: 750 hrs/month per service
- Database Free: 90 days (Render) or unlimited (Neon/Supabase)

---

## 📞 Support

If you encounter issues:

1. **Check Logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Logs

2. **Common Commands:**
   ```bash
   # View Render logs
   # In Render dashboard → Logs tab

   # Redeploy Vercel
   # In Vercel dashboard → Deployments → Redeploy
   ```

3. **Resources:**
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Community](https://community.render.com)

---

**Happy Deploying! 🚀**
