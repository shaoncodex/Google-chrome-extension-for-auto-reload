#!/bin/bash

# Chrome Extension Packaging Script
# Random Webpage Reloader Extension

echo "🚀 Packaging Random Webpage Reloader Chrome Extension..."

# Create package directory
PACKAGE_DIR="random-webpage-reloader-extension"
ZIP_NAME="random-webpage-reloader-v1.0.0.zip"

# Clean previous builds
rm -rf $PACKAGE_DIR
rm -f $ZIP_NAME

# Create package directory
mkdir -p $PACKAGE_DIR

# Copy extension files
echo "📁 Copying extension files..."
cp manifest.json $PACKAGE_DIR/
cp background.js $PACKAGE_DIR/
cp content.js $PACKAGE_DIR/
cp popup.html $PACKAGE_DIR/
cp popup.js $PACKAGE_DIR/
cp dashboard.html $PACKAGE_DIR/
cp README.md $PACKAGE_DIR/

# Copy icons
mkdir -p $PACKAGE_DIR/icons
cp icons/*.png $PACKAGE_DIR/icons/

# Create zip file
echo "📦 Creating zip package..."
zip -r $ZIP_NAME $PACKAGE_DIR

# Clean up temporary directory
rm -rf $PACKAGE_DIR

echo "✅ Package created: $ZIP_NAME"
echo ""
echo "🔧 Installation Instructions:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select the extracted folder"
echo "4. Or drag and drop the .zip file onto the extensions page"
echo ""
echo "📋 Package Contents:"
unzip -l $ZIP_NAME
echo ""
echo "🎉 Ready for installation!"