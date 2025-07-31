#!/bin/bash

echo "Pushing HealFast to GitHub..."

# Check if authenticated
if gh auth status; then
    echo "✓ GitHub authentication confirmed"
    
    # Push to GitHub
    echo "Pushing code to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✓ Successfully pushed to GitHub!"
        echo ""
        echo "Your code is now at: https://github.com/iamdwaynemoore/healfast"
        echo ""
        echo "Next steps:"
        echo "1. Go to: https://github.com/iamdwaynemoore/healfast/settings/pages"
        echo "2. Under 'Source', select 'Deploy from a branch'"
        echo "3. Select 'main' branch and '/dist' folder"
        echo "4. Click 'Save'"
        echo "5. Your app will be live at: https://iamdwaynemoore.github.io/healfast/"
    else
        echo "❌ Push failed. Please check your connection and try again."
    fi
else
    echo "❌ Not authenticated with GitHub. Please run: gh auth login"
fi