# Deployment Guide

This guide covers deploying DynamicAI Builder to various platforms.

## Table of Contents

- [Vercel Deployment (Recommended)](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)

## Vercel Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Neon PostgreSQL account (free tier available)

### Steps

1. **Push code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/dynamicai-builder.git
git push -u origin main
```

2. **Create PostgreSQL database on Neon**

- Go to [Neon Console](https://console.neon.tech/)
- Create a new project
- Copy the connection string

3. **Deploy to Vercel**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New Project"
- Import your GitHub repository
- Configure environment variables (see below)
- Deploy!

4. **Run database migrations**

```bash
npx prisma migrate deploy
```

### Environment Variables for Vercel

Add these in Vercel project settings:

```env
DATABASE_URL=your_neon_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Docker Deployment

### Using Docker Compose

1. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your values
```

2. **Build and start containers**

```bash
docker-compose up -d
```

3. **Run migrations**

```bash
docker-compose exec app npx prisma migrate deploy
```

4. **Seed database (optional)**

```bash
docker-compose exec app npx prisma db seed
```

### Access the application

- Application: http://localhost:3000
- PostgreSQL: localhost:5432

## Manual Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- PM2 (process manager)

### Steps

1. **Clone and install**

```bash
git clone https://github.com/yourusername/dynamicai-builder.git
cd dynamicai-builder
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
# Edit .env with production values
```

3. **Build application**

```bash
npm run build
```

4. **Run migrations**

```bash
npx prisma migrate deploy
```

5. **Start with PM2**

```bash
pm2 start npm --name "dynamicai" -- start
pm2 save
pm2 startup
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| NEXTAUTH_URL | Application URL | https://yourdomain.com |
| NEXTAUTH_SECRET | Secret key for NextAuth | Generate with: `openssl rand -base64 32` |

### OAuth Variables (Optional)

| Variable | Description | How to Get |
|----------|-------------|------------|
| GOOGLE_CLIENT_ID | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | [Google Cloud Console](https://console.cloud.google.com/) |
| GITHUB_CLIENT_ID | GitHub OAuth client ID | [GitHub Developer Settings](https://github.com/settings/developers) |
| GITHUB_CLIENT_SECRET | GitHub OAuth secret | [GitHub Developer Settings](https://github.com/settings/developers) |

### Email Variables (Optional)

| Variable | Description |
|----------|-------------|
| SMTP_HOST | SMTP server host |
| SMTP_PORT | SMTP server port |
| SMTP_USER | SMTP username |
| SMTP_PASSWORD | SMTP password |
| SMTP_FROM | From email address |

## Database Setup

### Neon PostgreSQL (Recommended for Vercel)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to DATABASE_URL environment variable

### Local PostgreSQL

1. **Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql
```

2. **Create database**

```bash
sudo -u postgres psql
CREATE DATABASE dynamicai;
CREATE USER dynamicai WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dynamicai TO dynamicai;
\q
```

3. **Update DATABASE_URL**

```env
DATABASE_URL="postgresql://dynamicai:your_password@localhost:5432/dynamicai?schema=public"
```

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
6. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: DynamicAI Builder
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and Client Secret

## Post-Deployment

### 1. Seed Database

```bash
npx prisma db seed
```

This creates:
- Admin, Manager, and User roles
- Permissions for all resources
- Default admin user (admin@dynamicai.com / admin123)

### 2. Test Application

- Visit your application URL
- Login with admin credentials
- Create a test project
- Upload a test configuration

### 3. Monitor Application

- Check Vercel logs for errors
- Monitor database usage
- Set up error tracking (Sentry recommended)

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db push
```

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### OAuth Not Working

- Check redirect URIs match exactly
- Verify environment variables are set
- Check OAuth app is enabled

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database SSL
- [ ] Review OAuth scopes
- [ ] Set up monitoring

## Performance Optimization

- [ ] Enable Vercel Edge caching
- [ ] Configure database connection pooling
- [ ] Optimize images with Next.js Image
- [ ] Enable incremental static regeneration
- [ ] Use Vercel Analytics

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups

- Neon: Automatic backups included
- Manual: Set up cron job for daily backups

---

For additional help, please open an issue on GitHub or contact support.
