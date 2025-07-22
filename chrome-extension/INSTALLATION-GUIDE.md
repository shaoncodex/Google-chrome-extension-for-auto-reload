# 🚀 Random Webpage Reloader - Chrome Extension Installation

## 📦 Package Information
- **Extension Name**: Random Webpage Reloader
- **Version**: 1.0.0
- **Package Size**: 17.8 KB
- **Chrome Compatibility**: Chrome 88+ (Manifest V3)

## 🔧 Quick Installation Steps

### Method 1: Load from ZIP (Recommended)

1. **Download the Extension**
   - File: `Random-Webpage-Reloader-Extension.zip`
   - Size: 17.8 KB
   - Contains all necessary files

2. **Extract the ZIP File**
   ```bash
   # Extract to any folder
   unzip Random-Webpage-Reloader-Extension.zip -d Random-Webpage-Reloader/
   ```

3. **Install in Chrome**
   - Open Chrome browser
   - Go to: `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the extracted folder: `Random-Webpage-Reloader/`
   - Extension will appear in your toolbar!

### Method 2: Direct Installation

1. **Open Chrome Extensions**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle "Developer mode" in top right corner

3. **Drag & Drop**
   - Drag the `Random-Webpage-Reloader-Extension.zip` file
   - Drop it onto the Chrome extensions page
   - Chrome will extract and install automatically

## ✅ Verify Installation

After installation, you should see:
- 🔄 Extension icon in Chrome toolbar
- "Random Webpage Reloader" in your extensions list
- Popup opens when clicking the icon

## 🎯 First Time Setup

### 1. Open Dashboard
- Click the extension icon
- Click "Open Dashboard" button
- Configure your settings

### 2. Add Websites
- Click "Add New Website"
- Enter URL: `https://example.com`
- Enter Name: `Example Site`
- Click "Add Website"

### 3. Configure Timing
- Go to "Settings" tab
- Choose reload mode
- Set time intervals using presets or custom time
- Save settings

### 4. Start Reloading
- Toggle extension "ON"
- Watch your websites reload automatically!

## ⚙️ Package Contents

```
Random-Webpage-Reloader/
├── manifest.json          # Extension configuration
├── background.js          # Core reload logic (13.1 KB)
├── content.js            # Page interaction (9.6 KB)
├── popup.html            # Extension popup UI (7.8 KB)
├── popup.js              # Popup functionality (7.3 KB)
├── dashboard.html        # Settings dashboard (7.8 KB)
├── icons/                # Extension icons
│   ├── icon16.png       # 16x16 toolbar icon
│   ├── icon32.png       # 32x32 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 store icon
└── README.md             # Documentation (4.3 KB)
```

## 🚀 Key Features

### ⏰ Time Management
- **Quick Presets**: 10s, 30s, 1m, 2m, 5m, 10m, 30m, 1h
- **Custom Time**: Set hours, minutes, seconds
- **Random Intervals**: Min/max range settings
- **Sequential Mode**: Cycle through websites

### 🌐 Website Management
- **Add/Remove Sites**: Easy website management
- **Auto-Start**: Websites that start automatically
- **Individual Settings**: Custom intervals per site
- **Active/Inactive**: Toggle websites on/off

### 🔔 Notifications
- **Browser Notifications**: Reload alerts
- **Sound Feedback**: Audio notifications
- **Badge Count**: Active websites on icon
- **Visual Indicators**: Page overlay indicators

### ⌨️ Shortcuts
- `Ctrl+Shift+R` - Toggle extension on/off
- `Ctrl+Shift+F5` - Reload current page now

## 🛠️ Troubleshooting

### Extension Won't Load
1. Check Chrome version (need 88+)
2. Ensure Developer mode is enabled
3. Try extracting ZIP to new folder
4. Check for file corruption

### Websites Not Reloading
1. Verify extension is "ON"
2. Check websites are marked "Active"
3. Ensure intervals aren't too long
4. Look for error notifications

### Dashboard Not Working
1. Extension works offline (no server needed)
2. All settings saved in browser storage
3. Try refreshing dashboard page
4. Check browser console for errors

## 🔒 Privacy & Security

- ✅ **No Data Collection**: All data stays on your device
- ✅ **Offline Operation**: No external servers
- ✅ **Minimal Permissions**: Only necessary Chrome APIs
- ✅ **Open Source**: Full code transparency

## 📋 Permissions Explained

- `activeTab`: Access current tab for reloading
- `tabs`: Manage multiple browser tabs
- `storage`: Save settings locally
- `alarms`: Schedule reload events
- `notifications`: Show reload alerts
- `webNavigation`: Monitor page loading

## 🎉 You're Ready!

Your Random Webpage Reloader extension is now installed and ready to use!

### Quick Test:
1. Add `https://google.com` as a website
2. Set 30-second interval
3. Toggle extension ON
4. Watch Google reload every 30 seconds!

### Need Help?
- Check README.md for detailed features
- All settings are self-explanatory
- Extension works completely offline

**Happy auto-reloading! 🔄✨**