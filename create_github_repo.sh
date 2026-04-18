#!/bin/bash

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run from ShopTest directory."
  exit 1
fi

# First, let's try using git with GitHub SSH
echo "🔍 Checking for GitHub authentication..."

# Try to authenticate with GitHub
if ! gh auth status > /dev/null 2>&1; then
  echo "⚠️  Not authenticated with GitHub CLI. Attempting web authentication..."
  
  # Try to open browser for authentication
  if command -v open &> /dev/null; then
    echo "Opening GitHub authentication page in browser..."
    # Give user time to see the message
    sleep 2
  fi
fi

# Try to create repository using gh CLI
echo "🚀 Creating repository on GitHub..."

if command -v gh &> /dev/null; then
  gh repo create ShopTest \
    --public \
    --source=. \
    --description="Pet food e-commerce store for testing Max Pay MCP integration" \
    --remote=origin \
    --push 2>/dev/null
  
  if [ $? -eq 0 ]; then
    echo "✅ Repository created and code pushed!"
    exit 0
  fi
fi

# Alternative: Use git + SSH
echo "🔗 Using Git SSH to push..."

# Add remote if not present
if ! git remote get-url origin > /dev/null 2>&1; then
  git remote add origin git@github.com:simchaklein/ShopTest.git
fi

# Try to push
git push -u origin main 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Code pushed to GitHub successfully!"
  exit 0
fi

# If all else fails, provide manual instructions
echo ""
echo "❌ Automatic push failed. Here's what to do manually:"
echo ""
echo "1. Create the repository on GitHub:"
echo "   https://github.com/new?name=ShopTest&description=Pet+food+e-commerce+store+for+testing+Max+Pay+MCP+integration&public=1"
echo ""
echo "2. Then run these commands:"
echo "   cd \"$(pwd)\""
echo "   git remote add origin https://github.com/simchaklein/ShopTest.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
