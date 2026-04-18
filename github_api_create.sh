#!/bin/bash

# Try to read GitHub token from git credentials
GITHUB_TOKEN=""

# Check for git credentials helper
if command -v security &> /dev/null; then
  # macOS keychain
  GITHUB_TOKEN=$(security find-generic-password -l "github.com" -a "simchaklein" -w 2>/dev/null)
fi

# Check for token in environment
if [ -z "$GITHUB_TOKEN" ]; then
  GITHUB_TOKEN="${GITHUB_TOKEN:-}"
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ No GitHub authentication token found"
  echo "Please authenticate with GitHub:"
  echo "  1. Open https://github.com/new in your browser"
  echo "  2. Name: ShopTest"
  echo "  3. Description: Pet food e-commerce store for testing Max Pay MCP integration"
  echo "  4. Public: Yes"
  echo "  5. Click 'Create repository'"
  echo ""
  echo "Then run:"
  echo "  cd '$(pwd)'"
  echo "  git push -u origin main"
  exit 1
fi

# Create repository via GitHub API
echo "🚀 Creating repository via GitHub API..."

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "ShopTest",
    "description": "Pet food e-commerce store for testing Max Pay MCP integration",
    "private": false,
    "auto_init": false
  }'

if [ $? -eq 0 ]; then
  echo "✅ Repository created! Now pushing code..."
  git push -u origin main
else
  echo "❌ Failed to create repository via API"
fi
