# 🚀 Deployment Guide - DynamicAI Builder

## Quick Deploy to Vercel (Recommended) - 5 Minutes

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Your code pushed to GitHub

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DynamicAI Builder"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/dynamicai-builder.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=your_neon_database_url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your_secret_key_here
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live! 🎉

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? dynamicai-builder
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## Step 3: Setup Database (Neon PostgreSQL)

### Option A: Use Existing Neon Database

If you're already using Neon:
```
DATABASE_URL=postgresql://neondb_owner:npg_kE1Xr0tGNJDu@ep-super-butterfly-ape4bwxx.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Option B: Create New Neon Database

1. **Go to Neon**
   - Visit https://neon.tech
   - Sign up / Log in

2. **Create Database**
   - Click "Create Project"
   - Name: `dynamicai-builder`
   - Region: Choose closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - Copy the connection string
   - Add to Vercel environment variables

4. **Run Migrations**
   After deployment, run in Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

---

## Step 4: Create Admin User

### Via Vercel CLI
```bash
# Connect to your deployment
vercel env pull .env.local

# Run Prisma Studio
npx prisma studio

# Manually create user with:
# - Email: admin@dynamicai.com
# - Password: (hashed) - Use bcrypt online tool
# - Role: Admin
```

### Or use SQL directly in Neon Dashboard:
```sql
-- First, create admin role
INSERT INTO "roles" (id, name, description) 
VALUES ('admin_role_id', 'Admin', 'Administrator');

-- Then create admin user (password is 'admin123' hashed)
INSERT INTO "users" (id, name, email, password, "roleId") 
VALUES (
  'admin_user_id',
  'Admin User',
  'admin@dynamicai.com',
  '$2a$10$YourHashedPasswordHere',
  'admin_role_id'
);
```

---

## Step 5: Configure OAuth (Optional for Google/GitHub)

### Google OAuth

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com

2. **Create Project**
   - Click "New Project"
   - Name: DynamicAI Builder

3. **Enable OAuth**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://your-app.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```

4. **Add to Environment Variables**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### GitHub OAuth

1. **Go to GitHub Settings**
   - https://github.com/settings/developers

2. **New OAuth App**
   - Click "New OAuth App"
   - Application name: DynamicAI Builder
   - Homepage URL: https://your-app.vercel.app
   - Authorization callback URL: 
     ```
     https://your-app.vercel.app/api/auth/callback/github
     ```

3. **Add to Environment Variables**
   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

---

## Step 6: Verify Deployment

1. **Visit Your App**
   ```
   https://your-app.vercel.app
   ```

2. **Check Health**
   - Can you access the homepage?
   - Can you login?
   - Can you create a project?

3. **Test Features**
   - Create project
   - Create configuration
   - Submit form
   - View table

---

## Environment Variables Reference

### Required
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-minimum-32-chars
```

### Optional (OAuth)
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

---

## Troubleshooting

### Build Fails
```bash
# Check build locally first
npm run build

# If successful locally but fails on Vercel:
# - Check Node.js version (should be 18+)
# - Check environment variables
# - Check build logs on Vercel
```

### Database Connection Issues
```bash
# Test connection string
npx prisma db pull

# Common issues:
# - Missing ?sslmode=require
# - Wrong password
# - IP not whitelisted (Neon allows all by default)
```

### NextAuth Errors
```bash
# Make sure you have:
# 1. NEXTAUTH_URL set correctly
# 2. NEXTAUTH_SECRET is at least 32 chars
# 3. OAuth redirect URLs match exactly
```

### Can't Login
```bash
# Check:
# 1. Admin user exists in database
# 2. Password is correctly hashed
# 3. Role has proper permissions
# 4. Check browser console for errors
```

---

## Custom Domain (Optional)

1. **Go to Vercel Dashboard**
   - Select your project
   - Go to "Settings" → "Domains"

2. **Add Domain**
   - Enter your domain: `yourdomain.com`
   - Follow DNS instructions

3. **Update NEXTAUTH_URL**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

4. **Update OAuth Callbacks**
   - Update Google/GitHub redirect URIs
   - Use new domain

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Automatic page analytics
- Performance metrics
- Web Vitals

### Add Custom Monitoring
```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Follow Sentry setup wizard
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling & Performance

### Vercel Pro Features
- **Bandwidth:** Unlimited
- **Functions:** Extended timeout (300s)
- **Concurrent Builds:** Faster deployments
- **Team Collaboration:** Multiple team members

### Database Scaling (Neon)
- **Free Tier:** 512 MB storage
- **Paid Plans:** More storage, connections, compute
- **Read Replicas:** For better performance

---

## Backup Strategy

### Database Backups
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Or use Neon's built-in backups:
# - Automatic daily backups (paid plans)
# - Point-in-time recovery
```

### Code Backups
- GitHub repository (automatic)
- Vercel stores previous deployments
- Can rollback anytime

---

## Cost Estimate

### Free Tier (Perfect for Demo/Portfolio)
- **Vercel:** Free (Hobby plan)
- **Neon:** Free (512 MB)
- **Total:** $0/month ✅

### Production (Small App)
- **Vercel Pro:** $20/month
- **Neon Pro:** $19/month
- **Total:** $39/month

### Production (Growing App)
- **Vercel Pro:** $20/month
- **Neon Scale:** $69/month
- **Total:** $89/month

---

## Security Checklist

Before going live:

- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] Environment variables are not in code
- [ ] DATABASE_URL uses SSL (?sslmode=require)
- [ ] OAuth redirect URIs are correct
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

---

## Post-Deployment

### Share Your App! 🎉

1. **Add to Portfolio**
   - Include live link
   - Add screenshots
   - Describe features

2. **Share on Social Media**
   - LinkedIn post
   - Twitter/X announcement
   - Dev.to article

3. **Get Feedback**
   - Share with friends
   - Post on Reddit (r/webdev, r/SideProject)
   - Product Hunt launch

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Console:** https://console.neon.tech
- **GitHub Repo:** Your repository URL
- **Documentation:** See README.md, API.md, ARCHITECTURE.md

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Neon database connectivity
3. Check browser console errors
4. Check API errors in Network tab
5. Review environment variables

---

## Success! 🎉

Your app is now live and accessible to the world!

**Next Steps:**
1. ✅ Test all features
2. ✅ Create sample projects
3. ✅ Share with users
4. ✅ Get feedback
5. ✅ Iterate and improve

**Your deployment URL:**
```
https://your-app.vercel.app
```

---

*Deployment completed successfully! 🚀*
