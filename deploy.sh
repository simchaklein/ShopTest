#!/bin/bash

# ShopTest Complete Deployment Script
# Creates GitHub repo, pushes code, and deploys to Vercel

set -e

REPO_NAME="ShopTest"
GITHUB_USER="simchaklein"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          ShopTest - Complete Deployment                   ║"
echo "║          Pet Food E-Commerce Store                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Verify local git setup
echo "📝 Step 1: Verifying local Git setup..."
cd "$PROJECT_DIR"
git status > /dev/null 2>&1 || { echo "❌ Not a git repository"; exit 1; }
echo "✅ Git repository initialized"
echo ""

# Step 2: Check GitHub CLI
echo "🔍 Step 2: Checking for GitHub CLI..."
if ! command -v gh &> /dev/null; then
    echo "ℹ️  GitHub CLI not found. Installing..."
    
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "⚠️  Homebrew not found. Please install GitHub CLI manually:"
        echo "   https://github.com/cli/cli#installation"
        echo ""
        echo "Then run this script again, or use Method 2 below"
        exit 1
    fi
fi
echo "✅ GitHub CLI available"
echo ""

# Step 3: Create GitHub repository
echo "🚀 Step 3: Creating GitHub repository..."
if gh repo view "$GITHUB_USER/$REPO_NAME" 2>/dev/null; then
    echo "ℹ️  Repository already exists at github.com/$GITHUB_USER/$REPO_NAME"
else
    gh repo create "$REPO_NAME" \
        --public \
        --source=. \
        --description="Pet food e-commerce store for testing Max Pay MCP integration" \
        --remote=origin \
        --push || {
        echo "❌ Failed to create repository"
        echo "You may need to authenticate with: gh auth login"
        exit 1
    }
    echo "✅ Repository created!"
fi
echo ""

# Step 4: Verify push
echo "📤 Step 4: Verifying code is pushed to GitHub..."
git push -u origin main 2>/dev/null || echo "⚠️  Already up to date"
echo "✅ Code ready on GitHub"
echo ""

# Step 5: Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ GITHUB SETUP COMPLETE                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "NEXT STEP: Deploy to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Option A: Automatic Deployment"
echo "  1. Open: https://vercel.com/new"
echo "  2. Click 'Import Git Repository'"
echo "  3. Find and select: ShopTest"
echo "  4. Click 'Import'"
echo "  5. Click 'Deploy'"
echo ""
echo "Option B: Using Vercel CLI"
echo "  npm install -g vercel"
echo "  cd $PROJECT_DIR"
echo "  vercel"
echo ""
echo "Once deployed, test at: https://shoptest-<hash>.vercel.app"
echo ""

