#!/bin/bash

# DynamicAI Builder - Setup Script
# This script automates the initial setup process

set -e

echo "🚀 DynamicAI Builder - Setup Script"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You'll need to set up a database manually."
else
    echo "✅ PostgreSQL found"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔐 Setting up environment variables..."

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please edit .env.local with your configuration"
else
    echo "ℹ️  .env.local already exists, skipping..."
fi

echo ""
echo "🗄️  Setting up database..."

# Prompt for database setup
read -p "Do you want to set up the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=\"postgresql://" .env.local; then
        echo "📊 Generating Prisma client..."
        npm run prisma:generate

        echo "🔄 Running database migrations..."
        npm run prisma:migrate

        read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🌱 Seeding database..."
            npm run prisma:seed
            echo "✅ Database seeded successfully!"
            echo ""
            echo "📝 Default admin credentials:"
            echo "   Email: admin@dynamicai.com"
            echo "   Password: admin123"
            echo "   ⚠️  Please change this password after first login!"
        fi
    else
        echo "⚠️  Please configure DATABASE_URL in .env.local first"
    fi
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Set up OAuth providers (Google, GitHub) if needed"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "- README.md - General overview"
echo "- DEPLOYMENT.md - Deployment instructions"
echo "- ARCHITECTURE.md - Architecture details"
echo "- TESTING.md - Testing guide"
echo "- CONTRIBUTING.md - Contribution guidelines"
echo ""
echo "🎉 Happy coding!"
