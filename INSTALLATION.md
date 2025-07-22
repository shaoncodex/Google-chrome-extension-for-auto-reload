# Random Webpage Reloader - Installation Guide

## 🚀 Quick Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to `/app/chrome-extension/` folder
   - Select the folder and click "Select Folder"

4. **Verify Installation**
   - Extension should appear in your extensions list
   - Look for the extension icon in your Chrome toolbar

### Method 2: Install from ZIP Package

1. **Create Package**
   ```bash
   cd /app/chrome-extension
   chmod +x package.sh
   ./package.sh
   ```

2. **Extract and Install**
   - Extract the generated .zip file
   - Follow Method 1 steps with extracted folder

## 🎯 First Time Setup

### 1. Open Dashboard
- Click the extension icon in your toolbar
- Click "Open Dashboard" button
- Or right-click extension icon → "Options"

### 2. Add Websites
- Go to "Websites" tab
- Click "Add New Website"
- Enter URL and display name
- Click "Add Website"

### 3. Configure Settings
- Go to "Settings" tab
- Choose reload mode (Custom/Random/Sequential)
- Set your preferred time intervals
- Enable notifications if desired

### 4. Start Reloading
- Toggle the extension "ON" from dashboard or popup
- Watch as your websites reload automatically!

## ⚙️ Configuration Options

### Reload Modes
- **Custom Interval**: Fixed timing (e.g., every 60 seconds)
- **Random Range**: Random intervals between min/max values
- **Sequential**: Reload websites one by one
- **Smart Mode**: Adaptive timing (coming soon)

### Time Settings
- **Quick Presets**: 10s, 30s, 1m, 2m, 5m, 10m, 30m, 1h
- **Custom Time**: Set hours, minutes, and seconds manually
- **Minimum**: 5 seconds (for performance)

### Advanced Features
- **Auto-Start**: Begin reloading when extension loads
- **Randomize Order**: Random website selection
- **Notifications**: Browser alerts when pages reload
- **Sound Feedback**: Audio notifications
- **Badge Count**: Show active websites count on icon
- **Error Handling**: Pause on errors, retry failed loads

## 🎮 Usage Tips

### Keyboard Shortcuts
- `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`) - Toggle extension on/off
- `Ctrl+Shift+F5` (Mac: `Cmd+Shift+F5`) - Reload current page now

### Best Practices
1. **Start Small**: Begin with 1-2 websites to test
2. **Reasonable Intervals**: Don't set intervals too short (minimum 5s)
3. **Monitor Performance**: Check statistics to ensure smooth operation
4. **Website Selection**: Add websites you actively use/monitor

### Common Use Cases
- **Development**: Auto-refresh localhost during coding
- **Monitoring**: Keep dashboards/admin panels updated
- **News/Feeds**: Stay updated with news websites
- **Social Media**: Refresh social feeds automatically
- **Testing**: Automated testing of web applications

## 🔧 Troubleshooting

### Extension Not Loading
```bash
# Check for JavaScript errors in Chrome DevTools
# Go to chrome://extensions/ → Extension details → Inspect views: background page
```

### Websites Not Reloading
1. Verify websites are marked as "Active"
2. Check reload intervals aren't too long
3. Ensure extension toggle is "ON"
4. Look for error notifications

### Dashboard Not Working
1. Make sure development server is running:
   ```bash
   cd /app/frontend
   npm start
   ```
2. Check if localhost:3000 is accessible
3. Refresh the dashboard page

### Performance Issues
1. Reduce number of active websites
2. Increase reload intervals
3. Check Chrome's task manager for resource usage

## 📊 Features Overview

### ✅ Core Features
- [x] Custom reload intervals with presets
- [x] Multiple website management
- [x] Random and sequential reload modes
- [x] Browser notifications
- [x] Statistics tracking
- [x] Keyboard shortcuts
- [x] Offline storage
- [x] Visual indicators
- [x] Error handling

### 🚀 Advanced Features
- [x] Auto-start websites
- [x] Individual website intervals
- [x] Sound notifications
- [x] Badge count display
- [x] Scroll position preservation
- [x] Page error detection
- [x] Retry mechanisms

## 🔒 Privacy & Security

- **No Data Collection**: All data stored locally
- **No External Servers**: Works completely offline
- **Minimal Permissions**: Only essential Chrome APIs
- **Open Source**: Full code transparency

## 🐛 Known Issues

1. **Dashboard iframe**: May not load if development server is not running
2. **Icon rendering**: Some sizes may appear pixelated
3. **Memory usage**: High with many active websites

## 🔄 Updates & Maintenance

### Manual Updates
1. Download latest version
2. Go to chrome://extensions/
3. Click "Update" on the extension
4. Or remove and reinstall with new files

### Development Mode
```bash
# Auto-reload extension during development
# Changes to background.js, content.js, popup.js require extension reload
# Changes to dashboard require only page refresh
```

## 🆘 Support

### Getting Help
1. Check this installation guide
2. Review README.md for detailed documentation
3. Look at browser console for error messages
4. Create issue in repository

### Debug Information
When reporting issues, include:
- Chrome version
- Extension version
- Console error messages
- Steps to reproduce
- Operating system

## 🎉 Enjoy!

Your Random Webpage Reloader extension is now ready to use. Happy browsing! 🌐