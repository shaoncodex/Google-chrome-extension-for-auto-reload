# Random Webpage Reloader - Chrome Extension

A powerful Chrome extension that automatically reloads webpages at random or custom intervals with advanced configuration options.

## Features

- 🔄 **Custom Reload Intervals** - Set precise timing from seconds to hours
- ⚡ **Quick Presets** - One-click intervals (10s, 30s, 1m, 5m, etc.)
- 🎯 **Website Management** - Add/remove specific websites to reload
- 🔀 **Random Mode** - Randomize reload intervals within a range
- 🚀 **Auto-Start** - Automatically begin reloading when extension loads
- 🔔 **Notifications** - Get notified when pages reload
- 📊 **Statistics** - Track reload counts and performance
- ⌨️ **Keyboard Shortcuts** - Quick toggle and manual reload
- 💾 **Offline Storage** - All settings saved locally

## Installation

### From Chrome Web Store (Recommended)
*Coming soon - extension will be published to Chrome Web Store*

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `chrome-extension` folder
5. The extension will appear in your extensions list

## Usage

### Quick Start
1. Click the extension icon in your toolbar
2. Click "Start Reloading" to activate
3. Open the dashboard for advanced configuration

### Dashboard Features
- **Websites Tab**: Add/remove websites, configure individual settings
- **Settings Tab**: Advanced timing controls, notification preferences
- **Statistics Tab**: View reload counts and performance metrics

### Keyboard Shortcuts
- `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`) - Toggle extension on/off
- `Ctrl+Shift+F5` (Mac: `Cmd+Shift+F5`) - Reload current page immediately

## Configuration Options

### Reload Modes
- **Fixed Custom Interval** - Set exact timing (e.g., every 60 seconds)
- **Random Time Range** - Random intervals between min/max values
- **Sequential** - Cycle through websites one by one
- **Smart Mode** - Adaptive timing based on page behavior

### Notification Settings
- Browser notifications when pages reload
- Sound feedback (optional)
- Badge count on extension icon
- Visual page indicators

### Error Handling
- Pause on website errors
- Configurable retry attempts
- Skip problematic websites

## Privacy & Security

- **No Data Collection** - All data stored locally on your device
- **No External Servers** - Extension works completely offline
- **Open Source** - Full source code available for review
- **Minimal Permissions** - Only requests necessary Chrome APIs

## Technical Details

### Permissions Required
- `activeTab` - Access current tab for reloading
- `tabs` - Manage multiple tabs
- `storage` - Save settings locally
- `alarms` - Schedule reload events
- `notifications` - Show reload notifications
- `webNavigation` - Monitor page load events

### Storage
- Uses Chrome's local storage API
- No data sent to external servers
- Settings sync across Chrome sessions

## Troubleshooting

### Extension Not Working
1. Check if extension is enabled in `chrome://extensions/`
2. Verify websites are added and marked as "Active"
3. Ensure extension toggle is "ON"

### Pages Not Reloading
1. Check reload intervals aren't too long
2. Verify website URLs are correct
3. Look for error notifications

### Dashboard Not Loading
1. Make sure development server is running (for dev mode)
2. Check browser console for errors
3. Try refreshing the dashboard page

## Development

### Setup Development Environment
```bash
# Clone repository
git clone <repository-url>
cd random-webpage-reloader

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start
```

### Build Extension
```bash
# Copy built files to extension directory
cp -r build/* chrome-extension/dashboard/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or feature requests, please create an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release
- Basic reload functionality
- Dashboard interface
- Multiple reload modes
- Notification system
- Statistics tracking