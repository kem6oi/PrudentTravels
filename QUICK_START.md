# ⚡ Quick Deployment Checklist

Follow this checklist to deploy PrudentTravels in ~30 minutes.

---

## ✅ Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub repository
- [ ] Vercel account created (sign up at vercel.com)
- [ ] Render account created (sign up at render.com)
- [ ] Gmail App Password generated (for email sending)

---

## 🗄️ Step 1: Database (5 minutes)

### Render PostgreSQL

1. [ ] Login to [dashboard.render.com](https://dashboard.render.com)
2. [ ] Click "New +" → "PostgreSQL"
3. [ ] Configure:
   - Name: `prudenttravels-db`
   - Database: `prudenttravels`
   - Region: `Oregon`
   - Plan: `Free`
4. [ ] Click "Create Database"
5. [ ] Copy **Internal Database URL** (save for later)
6. [ ] Click "Shell" tab and run SQL files:
   - [ ] Copy/paste contents of `database/schema.sql` and execute
   - [ ] Copy/paste contents of `database/indexes.sql` and execute
   - [ ] (Optional) Copy/paste `database/sample-data.sql` for test data

---

## 🔧 Step 2: Backend (10 minutes)

### Render Web Service

1. [ ] Go to [dashboard.render.com](https://dashboard.render.com)
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repository
4. [ ] Configure:
   - Name: `prudenttravels-api`
   - Region: `Oregon` (same as database!)
   - Root Directory: `PrudentTravels/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

5. [ ] Add Environment Variables (click "Advanced"):

   **Required:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[paste Internal Database URL from Step 1]
   JWT_SECRET=[generate random 32+ character string]
   JWT_EXPIRE=30d
   CLIENT_URL=https://temporary-url.vercel.app
   ADMIN_EMAIL=admin@prudenttravels.com
   ADMIN_PASSWORD=YourStrongPassword123!
   ```

   **Email (Required for user registration):**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=[your Gmail App Password]
   EMAIL_FROM=noreply@prudenttravels.com
   ```

   **Optional (add later):**
   ```
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```

6. [ ] Click "Create Web Service"
7. [ ] Wait for deployment (5-10 minutes)
8. [ ] Copy your backend URL: `https://prudenttravels-api-XXXX.onrender.com`
9. [ ] Test: Visit `https://your-backend-url.onrender.com/health`
   - Should see: `{"success": true, "message": "PrudentTravels API is running"}`

---

## 🎨 Step 3: Frontend (10 minutes)

### Vercel

1. [ ] Go to [vercel.com/new](https://vercel.com/new)
2. [ ] Click "Import Git Repository"
3. [ ] Select your GitHub repo
4. [ ] Configure:
   - Framework: `Create React App`
   - Root Directory: `PrudentTravels/frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

5. [ ] Add Environment Variable:
   ```
   REACT_APP_API_URL=[your backend URL from Step 2]/api/v1
   ```
   Example: `https://prudenttravels-api-xxxx.onrender.com/api/v1`

6. [ ] Click "Deploy"
7. [ ] Wait for deployment (3-5 minutes)
8. [ ] Copy your Vercel URL: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend (2 minutes)

1. [ ] Go back to Render backend dashboard
2. [ ] Click "Environment" tab
3. [ ] Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
4. [ ] Click "Save Changes"
5. [ ] Render will automatically redeploy

---

## 🧪 Step 5: Test Everything (5 minutes)

### Test Backend
- [ ] Visit: `https://your-backend.onrender.com/health`
- [ ] Should return JSON with `success: true`

### Test Frontend
- [ ] Visit: `https://your-app.vercel.app`
- [ ] Homepage loads correctly
- [ ] Navigate to "Destinations"
- [ ] Try to register a new account
- [ ] Check email for verification (if email configured)
- [ ] Login with admin account:
  - Email: `admin@prudenttravels.com`
  - Password: (what you set in ADMIN_PASSWORD)
- [ ] Admin dashboard loads

### Test API Connection
- [ ] Open browser console (F12)
- [ ] Try to register/login
- [ ] Should see no CORS errors
- [ ] API calls should succeed

---

## 🎉 Deployment Complete!

**Your Live URLs:**
- 🌐 Frontend: `https://your-app.vercel.app`
- 🔌 Backend: `https://prudenttravels-api-xxxx.onrender.com`
- 🗄️ Database: Render PostgreSQL

---

## 🚨 Common Issues & Fixes

### CORS Error
**Problem:** Frontend can't connect to backend
**Fix:** Ensure `CLIENT_URL` in backend matches your Vercel URL exactly (include `https://`)

### API 404 Error
**Problem:** API routes not found
**Fix:** Check `REACT_APP_API_URL` includes `/api/v1` at the end

### Database Connection Failed
**Problem:** Backend can't connect to database
**Fix:**
- Use **Internal Database URL** (not External)
- Ensure database and backend in same region
- Check database hasn't expired (free tier = 90 days)

### Email Not Sending
**Problem:** Users not receiving emails
**Fix:**
- Use Gmail App Password, not regular password
- Generate at: google.com/settings/security/apppasswords
- Enable "Less secure app access" in Gmail

### Backend Keeps Crashing
**Problem:** Render shows "Application failed to respond"
**Fix:**
- Check Logs tab in Render dashboard
- Ensure `PORT=10000`
- Verify all required env variables are set

---

## 📈 Next Steps

**Optional Enhancements:**

1. **Custom Domain**
   - [ ] In Vercel: Settings → Domains
   - [ ] Add your domain (e.g., prudenttravels.com)
   - [ ] Update DNS records

2. **Image Uploads (Cloudinary)**
   - [ ] Sign up at cloudinary.com
   - [ ] Get API credentials
   - [ ] Add to Render backend env variables

3. **Payments (Stripe)**
   - [ ] Sign up at stripe.com
   - [ ] Get test API keys
   - [ ] Add to Render backend env variables

4. **Monitoring**
   - [ ] Set up error tracking (Sentry)
   - [ ] Add analytics (Google Analytics)
   - [ ] Monitor uptime (UptimeRobot)

5. **Performance**
   - [ ] Enable Vercel Analytics
   - [ ] Configure CDN caching
   - [ ] Optimize images

---

## 🔐 Security Reminders

- [ ] Change default admin password immediately
- [ ] Use strong, random JWT_SECRET (32+ characters)
- [ ] Never commit .env files to Git
- [ ] Enable 2FA on Vercel and Render accounts
- [ ] Regularly update npm dependencies
- [ ] Monitor logs for suspicious activity

---

## 💰 Cost Tracking

**Free Tier Limits:**

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Vercel | ✅ Free | 100 GB bandwidth, unlimited builds |
| Render Backend | ✅ Free | 750 hrs/month (enough for 1 service) |
| Render Database | ✅ Free | 1 GB storage, expires after 90 days |

**Total Monthly Cost:** $0

**Notes:**
- Render free tier services sleep after 15 min of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading to paid tier for production use

---

## 📞 Need Help?

**Resources:**
- 📖 Full Deployment Guide: See `DEPLOYMENT_GUIDE.md`
- 🔧 Render Docs: render.com/docs
- 🚀 Vercel Docs: vercel.com/docs
- 💬 Community: Render Community Forum

**Check Logs:**
- Render: Dashboard → Your Service → Logs
- Vercel: Dashboard → Deployments → View Function Logs

---

**Estimated Total Time: 30 minutes**

Good luck with your deployment! 🎊
