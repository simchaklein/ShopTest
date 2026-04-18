#!/bin/bash

# ShopTest GitHub Setup Script
# This script creates the GitHub repository and pushes the ShopTest code

echo "🚀 ShopTest GitHub Setup"
echo "========================"
echo ""
echo "STEP 1: Create repository on GitHub"
echo "Please open https://github.com/new in your browser and:"
echo "  1. Set Owner: simchaklein"
echo "  2. Set Repository name: ShopTest"
echo "  3. Add Description: Pet food e-commerce store for testing Max Pay MCP integration"
echo "  4. Select visibility: Public"
echo "  5. Click 'Create repository'"
echo ""
read -p "Press Enter once you've created the repository on GitHub..."
echo ""

echo "STEP 2: Push code to GitHub"
echo "Running: git push -u origin main"
echo ""

cd "$(dirname "$0")" || exit 1
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Success! Repository created and code pushed to GitHub"
  echo "Repository URL: https://github.com/simchaklein/ShopTest"
  echo ""
  echo "NEXT STEPS:"
  echo "1. Deploy to Vercel: https://vercel.com/new"
  echo "2. Import the ShopTest repository from GitHub"
  echo "3. Configure environment variables if needed"
  echo "4. Deploy!"
else
  echo ""
  echo "❌ Push failed. Please check your GitHub credentials and try again."
fi
