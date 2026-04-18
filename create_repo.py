#!/usr/bin/env python3

import os
import json
import subprocess

# ShopTest Repository Creation Script
# This script creates the GitHub repository and pushes code

def create_repo():
    repo_name = "ShopTest"
    owner = "simchaklein"
    description = "Pet food e-commerce store for testing Max Pay MCP payment integration"
    
    # Check if GitHub CLI is available
    try:
        result = subprocess.run(['gh', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ GitHub CLI is installed")
            print(f"Creating repository: {owner}/{repo_name}...")
            
            # Create repo using GitHub CLI
            cmd = [
                'gh', 'repo', 'create', repo_name,
                '--public',
                '--source=.',
                '--description=' + description,
                '--remote=origin'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Repository created successfully!")
                
                # Push code
                print("Pushing code to GitHub...")
                cmd = ['git', 'push', '-u', 'origin', 'main']
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode == 0:
                    print("✅ Code pushed successfully!")
                    print(f"Repository URL: https://github.com/{owner}/{repo_name}")
                else:
                    print(f"❌ Push failed: {result.stderr}")
            else:
                print(f"❌ Repository creation failed: {result.stderr}")
        else:
            print("❌ GitHub CLI not found. Please install it:")
            print("   brew install gh (macOS)")
            print("   choco install gh (Windows)")
            print("   sudo apt install gh (Linux)")
    except FileNotFoundError:
        print("❌ GitHub CLI not found. Please install it first.")

if __name__ == '__main__':
    create_repo()
