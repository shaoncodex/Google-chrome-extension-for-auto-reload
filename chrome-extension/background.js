// Background Service Worker for Random Webpage Reloader
class ExtensionBackground {
  constructor() {
    this.isActive = false;
    this.websites = [];
    this.settings = {};
    this.stats = {};
    this.activeAlarms = new Set();
    this.currentTabStates = new Map();
    
    this.initializeExtension();
    this.setupEventListeners();
  }

  async initializeExtension() {
    console.log('🚀 Random Webpage Reloader extension initialized');
    
    // Load saved data
    await this.loadStoredData();
    
    // Setup default alarm for checking active state
    chrome.alarms.create('heartbeat', { periodInMinutes: 0.1 }); // Every 6 seconds
  }

  async loadStoredData() {
    try {
      const result = await chrome.storage.local.get(['websites', 'settings', 'stats']);
      
      this.websites = result.websites || [];
      this.settings = result.settings || this.getDefaultSettings();
      this.stats = result.stats || this.getDefaultStats();
      this.isActive = this.settings.isExtensionActive || false;
      
      console.log('📊 Loaded data:', { 
        websites: this.websites.length, 
        isActive: this.isActive 
      });
      
      // Update badge
      this.updateBadge();
      
    } catch (error) {
      console.error('❌ Error loading stored data:', error);
    }
  }

  getDefaultSettings() {
    return {
      isExtensionActive: false,
      reloadMode: 'custom',
      customInterval: 60,
      minInterval: 30,
      maxInterval: 300,
      randomizeOrder: true,
      autoStartEnabled: true,
      notifications: true,
      notificationSound: false,
      showBadgeCount: true,
      pauseOnError: true,
      retryOnError: 3,
      lastSync: new Date().toISOString()
    };
  }

  getDefaultStats() {
    return {
      totalWebsites: 0,
      activeWebsites: 0,
      totalReloads: 0,
      avgReloadTime: 60,
      lastActive: new Date().toISOString(),
      extensionStartTime: new Date().toISOString()
    };
  }

  setupEventListeners() {
    // Handle alarms
    chrome.alarms.onAlarm.addListener((alarm) => {
      this.handleAlarm(alarm);
    });

    // Handle messages from popup/dashboard
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });

    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Handle keyboard commands
    chrome.commands.onCommand.addListener((command) => {
      this.handleCommand(command);
    });

    // Handle extension install/update
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });
  }

  async handleAlarm(alarm) {
    console.log('⏰ Alarm triggered:', alarm.name);
    
    if (alarm.name === 'heartbeat') {
      if (this.isActive) {
        await this.processReloadQueue();
      }
      return;
    }

    // Handle website-specific alarms
    if (alarm.name.startsWith('reload_')) {
      const websiteId = alarm.name.replace('reload_', '');
      await this.reloadWebsite(websiteId);
    }
  }

  async handleMessage(message, sender, sendResponse) {
    console.log('📨 Received message:', message.type);
    
    try {
      switch (message.type) {
        case 'GET_DATA':
          sendResponse({
            success: true,
            data: {
              websites: this.websites,
              settings: this.settings,
              stats: this.stats
            }
          });
          break;

        case 'SETTINGS_UPDATE':
          await this.updateSettings(message.data);
          sendResponse({ success: true });
          break;

        case 'WEBSITE_UPDATE':
          await this.updateWebsites(message.data);
          sendResponse({ success: true });
          break;

        case 'TOGGLE_EXTENSION':
          await this.toggleExtension();
          sendResponse({ success: true, isActive: this.isActive });
          break;

        case 'RELOAD_NOW':
          await this.reloadWebsite(message.websiteId);
          sendResponse({ success: true });
          break;

        case 'GET_STATUS':
          sendResponse({
            success: true,
            isActive: this.isActive,
            stats: this.stats
          });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    // Track tab states for reload monitoring
    if (changeInfo.status === 'complete' && tab.url) {
      this.currentTabStates.set(tabId, {
        url: tab.url,
        lastReloaded: Date.now(),
        reloadCount: this.currentTabStates.get(tabId)?.reloadCount || 0
      });
    }
  }

  async handleCommand(command) {
    console.log('⌨️ Command received:', command);
    
    switch (command) {
      case 'toggle_extension':
        await this.toggleExtension();
        this.showNotification('Extension ' + (this.isActive ? 'Activated' : 'Deactivated'));
        break;
        
      case 'reload_current':
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
          await this.reloadTab(activeTab.id);
        }
        break;
    }
  }

  async handleInstall(details) {
    if (details.reason === 'install') {
      console.log('🎉 Extension installed!');
      
      // Open welcome/setup page
      chrome.tabs.create({
        url: chrome.runtime.getURL('dashboard.html')
      });
      
      // Show welcome notification
      this.showNotification('Welcome to Random Webpage Reloader! Configure your settings to get started.');
    }
  }

  async toggleExtension() {
    this.isActive = !this.isActive;
    this.settings.isExtensionActive = this.isActive;
    
    await this.saveSettings();
    this.updateBadge();
    
    if (this.isActive) {
      await this.startReloading();
      console.log('✅ Extension activated');
    } else {
      await this.stopReloading();
      console.log('⏹️ Extension deactivated');
    }
  }

  async startReloading() {
    if (!this.isActive) return;
    
    const activeWebsites = this.websites.filter(w => w.isActive);
    console.log(`🔄 Starting reload process for ${activeWebsites.length} websites`);
    
    // Clear existing alarms
    await this.clearAllReloadAlarms();
    
    // Set up new alarms based on settings
    for (const website of activeWebsites) {
      await this.scheduleWebsiteReload(website);
    }
    
    // Update stats
    this.stats.lastActive = new Date().toISOString();
    await this.saveStats();
  }

  async stopReloading() {
    console.log('⏹️ Stopping all reload processes');
    await this.clearAllReloadAlarms();
  }

  async scheduleWebsiteReload(website) {
    let delayMinutes;
    
    // Calculate delay based on settings
    if (this.settings.reloadMode === 'custom') {
      delayMinutes = (website.customInterval || this.settings.customInterval) / 60;
    } else if (this.settings.reloadMode === 'random') {
      const minSec = this.settings.minInterval;
      const maxSec = this.settings.maxInterval;
      const randomSec = Math.floor(Math.random() * (maxSec - minSec + 1)) + minSec;
      delayMinutes = randomSec / 60;
    } else {
      delayMinutes = 1; // Default 1 minute
    }
    
    // Minimum delay of 0.1 minutes (6 seconds)
    delayMinutes = Math.max(0.1, delayMinutes);
    
    const alarmName = `reload_${website.id}`;
    chrome.alarms.create(alarmName, { delayInMinutes: delayMinutes });
    
    console.log(`⏲️ Scheduled ${website.name} to reload in ${delayMinutes} minutes`);
  }

  async reloadWebsite(websiteId) {
    const website = this.websites.find(w => w.id === websiteId);
    if (!website || !website.isActive) return;
    
    console.log(`🔄 Reloading website: ${website.name}`);
    
    try {
      // Find tabs with this URL
      const tabs = await chrome.tabs.query({ url: website.url + '*' });
      
      if (tabs.length === 0) {
        // If no tab exists, optionally create one
        if (website.autoStart) {
          await chrome.tabs.create({ url: website.url, active: false });
        }
      } else {
        // Reload existing tabs
        for (const tab of tabs) {
          await this.reloadTab(tab.id);
        }
      }
      
      // Update statistics
      await this.incrementReloadCount(websiteId);
      
      // Show notification if enabled
      if (this.settings.notifications) {
        this.showNotification(`Reloaded: ${website.name}`);
      }
      
      // Schedule next reload
      await this.scheduleWebsiteReload(website);
      
    } catch (error) {
      console.error(`❌ Error reloading ${website.name}:`, error);
      
      if (this.settings.pauseOnError) {
        await this.handleReloadError(websiteId, error);
      } else {
        // Still schedule next reload
        await this.scheduleWebsiteReload(website);
      }
    }
  }

  async reloadTab(tabId) {
    try {
      await chrome.tabs.reload(tabId);
      
      // Update tab state
      if (this.currentTabStates.has(tabId)) {
        const state = this.currentTabStates.get(tabId);
        state.reloadCount = (state.reloadCount || 0) + 1;
        state.lastReloaded = Date.now();
      }
      
    } catch (error) {
      console.error(`❌ Error reloading tab ${tabId}:`, error);
      throw error;
    }
  }

  async handleReloadError(websiteId, error) {
    const website = this.websites.find(w => w.id === websiteId);
    if (!website) return;
    
    console.log(`⚠️ Handling reload error for ${website.name}`);
    
    // Increment error count
    website.errorCount = (website.errorCount || 0) + 1;
    
    if (website.errorCount >= this.settings.retryOnError) {
      // Disable website after max retries
      website.isActive = false;
      await this.saveWebsites();
      
      this.showNotification(`Disabled ${website.name} due to repeated errors`);
    } else {
      // Schedule retry
      setTimeout(() => {
        this.scheduleWebsiteReload(website);
      }, 30000); // Retry after 30 seconds
    }
  }

  async processReloadQueue() {
    // This method is called by heartbeat to handle any missed reloads
    if (!this.isActive) return;
    
    // Update badge count if enabled
    if (this.settings.showBadgeCount) {
      this.updateBadge();
    }
  }

  async incrementReloadCount(websiteId) {
    const website = this.websites.find(w => w.id === websiteId);
    if (website) {
      website.reloadCount = (website.reloadCount || 0) + 1;
      website.lastReloaded = new Date().toISOString();
    }
    
    this.stats.totalReloads = (this.stats.totalReloads || 0) + 1;
    this.stats.lastActive = new Date().toISOString();
    
    await this.saveWebsites();
    await this.saveStats();
  }

  async clearAllReloadAlarms() {
    const alarms = await chrome.alarms.getAll();
    for (const alarm of alarms) {
      if (alarm.name.startsWith('reload_')) {
        chrome.alarms.clear(alarm.name);
      }
    }
  }

  updateBadge() {
    if (this.settings.showBadgeCount && this.isActive) {
      const activeCount = this.websites.filter(w => w.isActive).length;
      chrome.action.setBadgeText({ text: activeCount.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
    } else if (this.isActive) {
      chrome.action.setBadgeText({ text: '●' });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }

  showNotification(message) {
    if (this.settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Random Webpage Reloader',
        message: message
      });
    }
  }

  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
    
    // Restart reloading if settings changed and extension is active
    if (this.isActive) {
      await this.stopReloading();
      await this.startReloading();
    }
  }

  async updateWebsites(newWebsites) {
    this.websites = newWebsites;
    await this.saveWebsites();
    
    // Update stats
    this.stats.totalWebsites = this.websites.length;
    this.stats.activeWebsites = this.websites.filter(w => w.isActive).length;
    await this.saveStats();
    
    // Restart reloading if extension is active
    if (this.isActive) {
      await this.stopReloading();
      await this.startReloading();
    }
  }

  async saveSettings() {
    await chrome.storage.local.set({ settings: this.settings });
  }

  async saveWebsites() {
    await chrome.storage.local.set({ websites: this.websites });
  }

  async saveStats() {
    await chrome.storage.local.set({ stats: this.stats });
  }
}

// Initialize the background service
const extensionBackground = new ExtensionBackground();