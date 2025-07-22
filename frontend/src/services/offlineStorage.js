// Offline Storage Service for Chrome Extension Manager
class OfflineStorage {
  constructor() {
    this.storageKeys = {
      WEBSITES: 'chromeext_websites',
      SETTINGS: 'chromeext_settings',
      STATS: 'chromeext_stats'
    };
    
    // Initialize default data if not exists
    this.initializeDefaults();
  }

  initializeDefaults() {
    // Initialize websites if not exists
    if (!localStorage.getItem(this.storageKeys.WEBSITES)) {
      const defaultWebsites = [
        {
          id: '1',
          url: 'https://www.google.com',
          name: 'Google',
          isActive: true,
          autoStart: true,
          addedAt: new Date().toISOString(),
          lastReloaded: new Date().toISOString(),
          reloadCount: 0,
          customInterval: null
        }
      ];
      localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(defaultWebsites));
    }

    // Initialize settings if not exists
    if (!localStorage.getItem(this.storageKeys.SETTINGS)) {
      const defaultSettings = {
        id: 'default',
        isExtensionActive: false,
        reloadMode: 'custom',
        customInterval: 60,
        customMinutes: 1,
        customSeconds: 0,
        customHours: 0,
        minInterval: 30,
        maxInterval: 300,
        quickPresets: [
          { name: '30 seconds', seconds: 30 },
          { name: '1 minute', seconds: 60 },
          { name: '5 minutes', seconds: 300 },
          { name: '10 minutes', seconds: 600 },
          { name: '30 minutes', seconds: 1800 },
          { name: '1 hour', seconds: 3600 }
        ],
        randomizeOrder: true,
        autoStartEnabled: true,
        notifications: true,
        notificationSound: false,
        showBadgeCount: true,
        pauseOnError: true,
        retryOnError: 3,
        lastSync: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Initialize stats if not exists
    if (!localStorage.getItem(this.storageKeys.STATS)) {
      const defaultStats = {
        totalWebsites: 1,
        activeWebsites: 1,
        totalReloads: 0,
        avgReloadTime: 60,
        lastActive: new Date().toISOString(),
        uptime: '0h 0m',
        extensionStartTime: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.STATS, JSON.stringify(defaultStats));
    }
  }

  // Website operations
  async getWebsites() {
    const websites = localStorage.getItem(this.storageKeys.WEBSITES);
    return websites ? JSON.parse(websites) : [];
  }

  async addWebsite(website) {
    const websites = await this.getWebsites();
    const newWebsite = {
      ...website,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
      lastReloaded: null,
      isActive: true,
      autoStart: false,
      reloadCount: 0,
      customInterval: null
    };
    
    websites.push(newWebsite);
    localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(websites));
    
    // Update stats
    await this.updateStats({ totalWebsites: websites.length });
    
    return newWebsite;
  }

  async updateWebsite(id, updates) {
    const websites = await this.getWebsites();
    const index = websites.findIndex(w => w.id === id);
    
    if (index !== -1) {
      websites[index] = { ...websites[index], ...updates };
      localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(websites));
      
      // Update active websites count
      const activeCount = websites.filter(w => w.isActive).length;
      await this.updateStats({ activeWebsites: activeCount });
      
      return websites[index];
    }
    throw new Error('Website not found');
  }

  async deleteWebsite(id) {
    const websites = await this.getWebsites();
    const filteredWebsites = websites.filter(w => w.id !== id);
    
    localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(filteredWebsites));
    
    // Update stats
    const activeCount = filteredWebsites.filter(w => w.isActive).length;
    await this.updateStats({ 
      totalWebsites: filteredWebsites.length,
      activeWebsites: activeCount 
    });
    
    return true;
  }

  // Settings operations
  async getSettings() {
    const settings = localStorage.getItem(this.storageKeys.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  }

  async updateSettings(updates) {
    const currentSettings = await this.getSettings();
    const updatedSettings = { 
      ...currentSettings, 
      ...updates,
      lastSync: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKeys.SETTINGS, JSON.stringify(updatedSettings));
    
    // Sync with Chrome extension if available
    this.syncWithExtension(updatedSettings);
    
    return updatedSettings;
  }

  // Stats operations
  async getStats() {
    const stats = localStorage.getItem(this.storageKeys.STATS);
    const parsedStats = stats ? JSON.parse(stats) : null;
    
    if (parsedStats) {
      // Calculate uptime
      const startTime = new Date(parsedStats.extensionStartTime);
      const now = new Date();
      const uptimeMs = now - startTime;
      const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
      parsedStats.uptime = `${hours}h ${minutes}m`;
    }
    
    return parsedStats;
  }

  async updateStats(updates) {
    const currentStats = await this.getStats();
    const updatedStats = { 
      ...currentStats, 
      ...updates,
      lastActive: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKeys.STATS, JSON.stringify(updatedStats));
    return updatedStats;
  }

  async incrementReloadCount(websiteId) {
    const websites = await this.getWebsites();
    const website = websites.find(w => w.id === websiteId);
    
    if (website) {
      website.reloadCount = (website.reloadCount || 0) + 1;
      website.lastReloaded = new Date().toISOString();
      
      await this.updateWebsite(websiteId, {
        reloadCount: website.reloadCount,
        lastReloaded: website.lastReloaded
      });
    }
    
    // Update total reload count
    const stats = await this.getStats();
    await this.updateStats({ 
      totalReloads: (stats.totalReloads || 0) + 1 
    });
  }

  // Chrome Extension Communication
  syncWithExtension(settings) {
    // Send settings to Chrome extension if available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        chrome.runtime.sendMessage({
          type: 'SETTINGS_UPDATE',
          data: settings
        });
      } catch (error) {
        console.log('Extension not available:', error.message);
      }
    }
  }

  async syncFromExtension() {
    // Get data from Chrome extension if available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        return new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: 'GET_DATA' }, (response) => {
            if (response && response.data) {
              // Update local storage with extension data
              if (response.data.websites) {
                localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(response.data.websites));
              }
              if (response.data.settings) {
                localStorage.setItem(this.storageKeys.SETTINGS, JSON.stringify(response.data.settings));
              }
              if (response.data.stats) {
                localStorage.setItem(this.storageKeys.STATS, JSON.stringify(response.data.stats));
              }
            }
            resolve(response);
          });
        });
      } catch (error) {
        console.log('Extension not available:', error.message);
        return null;
      }
    }
    return null;
  }

  // Export/Import functionality
  exportData() {
    const data = {
      websites: JSON.parse(localStorage.getItem(this.storageKeys.WEBSITES) || '[]'),
      settings: JSON.parse(localStorage.getItem(this.storageKeys.SETTINGS) || '{}'),
      stats: JSON.parse(localStorage.getItem(this.storageKeys.STATS) || '{}'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.websites) {
        localStorage.setItem(this.storageKeys.WEBSITES, JSON.stringify(data.websites));
      }
      if (data.settings) {
        localStorage.setItem(this.storageKeys.SETTINGS, JSON.stringify(data.settings));
      }
      if (data.stats) {
        localStorage.setItem(this.storageKeys.STATS, JSON.stringify(data.stats));
      }
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    localStorage.removeItem(this.storageKeys.WEBSITES);
    localStorage.removeItem(this.storageKeys.SETTINGS);
    localStorage.removeItem(this.storageKeys.STATS);
    this.initializeDefaults();
  }
}

// Create singleton instance
const offlineStorage = new OfflineStorage();

// Export API that matches the mock API structure
export const offlineApi = {
  getWebsites: () => offlineStorage.getWebsites(),
  addWebsite: (website) => offlineStorage.addWebsite(website),
  updateWebsite: (id, updates) => offlineStorage.updateWebsite(id, updates),
  deleteWebsite: (id) => offlineStorage.deleteWebsite(id),
  getSettings: () => offlineStorage.getSettings(),
  updateSettings: (updates) => offlineStorage.updateSettings(updates),
  getStats: () => offlineStorage.getStats(),
  updateStats: (updates) => offlineStorage.updateStats(updates),
  incrementReloadCount: (websiteId) => offlineStorage.incrementReloadCount(websiteId),
  syncWithExtension: (settings) => offlineStorage.syncWithExtension(settings),
  syncFromExtension: () => offlineStorage.syncFromExtension(),
  exportData: () => offlineStorage.exportData(),
  importData: (data) => offlineStorage.importData(data),
  clearAllData: () => offlineStorage.clearAllData()
};

export default offlineStorage;