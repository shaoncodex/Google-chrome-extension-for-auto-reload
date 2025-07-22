// Popup Script for Random Webpage Reloader
class PopupManager {
  constructor() {
    this.isActive = false;
    this.stats = {};
    this.websites = [];
    
    this.initializePopup();
  }

  async initializePopup() {
    console.log('🚀 Popup initialized');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load data from background script
    await this.loadData();
    
    // Hide loading and show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }

  setupEventListeners() {
    // Toggle extension button
    document.getElementById('toggleButton').addEventListener('click', () => {
      this.toggleExtension();
    });
    
    // Reload current page button
    document.getElementById('reloadCurrentButton').addEventListener('click', () => {
      this.reloadCurrentPage();
    });
    
    // Open dashboard button
    document.getElementById('openDashboardButton').addEventListener('click', () => {
      this.openDashboard();
    });
    
    // Settings button
    document.getElementById('settingsButton').addEventListener('click', () => {
      this.openSettings();
    });
  }

  async loadData() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_DATA' });
      
      if (response.success) {
        this.websites = response.data.websites || [];
        this.settings = response.data.settings || {};
        this.stats = response.data.stats || {};
        this.isActive = this.settings.isExtensionActive || false;
        
        this.updateUI();
      } else {
        this.showError('Failed to load extension data');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showError('Extension not responding');
    }
  }

  updateUI() {
    // Update status badge and button
    const statusBadge = document.getElementById('statusBadge');
    const toggleButton = document.getElementById('toggleButton');
    
    if (this.isActive) {
      statusBadge.textContent = 'Active';
      statusBadge.className = 'status-badge active';
      toggleButton.textContent = 'Stop Reloading';
      toggleButton.className = 'toggle-button active';
    } else {
      statusBadge.textContent = 'Inactive';
      statusBadge.className = 'status-badge inactive';
      toggleButton.textContent = 'Start Reloading';
      toggleButton.className = 'toggle-button inactive';
    }
    
    // Update stats
    const activeWebsites = this.websites.filter(w => w.isActive).length;
    document.getElementById('activeWebsites').textContent = activeWebsites;
    document.getElementById('totalReloads').textContent = this.stats.totalReloads || 0;
  }

  async toggleExtension() {
    try {
      // Disable button temporarily
      const toggleButton = document.getElementById('toggleButton');
      toggleButton.disabled = true;
      toggleButton.textContent = 'Processing...';
      
      const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' });
      
      if (response.success) {
        this.isActive = response.isActive;
        this.updateUI();
        
        // Show success feedback
        this.showTemporaryFeedback(
          this.isActive ? 'Extension activated!' : 'Extension stopped!'
        );
      } else {
        this.showError('Failed to toggle extension');
      }
    } catch (error) {
      console.error('Error toggling extension:', error);
      this.showError('Extension not responding');
    } finally {
      // Re-enable button
      document.getElementById('toggleButton').disabled = false;
    }
  }

  async reloadCurrentPage() {
    try {
      // Get current active tab
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (activeTab) {
        // Send reload message to background script
        await chrome.runtime.sendMessage({ 
          type: 'RELOAD_NOW',
          websiteId: 'current_tab'
        });
        
        this.showTemporaryFeedback('Page reloaded!');
        
        // Close popup after successful reload
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    } catch (error) {
      console.error('Error reloading current page:', error);
      this.showError('Failed to reload page');
    }
  }

  openDashboard() {
    try {
      // Open dashboard in new tab
      chrome.tabs.create({
        url: chrome.runtime.getURL('dashboard.html')
      });
      
      // Close popup
      window.close();
    } catch (error) {
      console.error('Error opening dashboard:', error);
      this.showError('Failed to open dashboard');
    }
  }

  openSettings() {
    try {
      // Open options page
      chrome.runtime.openOptionsPage();
      
      // Close popup
      window.close();
    } catch (error) {
      console.error('Error opening settings:', error);
      this.showError('Failed to open settings');
    }
  }

  showTemporaryFeedback(message) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 1000;
      animation: fadeInOut 2s ease;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  }

  showError(message) {
    // Update UI to show error state
    const statusBadge = document.getElementById('statusBadge');
    const toggleButton = document.getElementById('toggleButton');
    
    statusBadge.textContent = 'Error';
    statusBadge.className = 'status-badge inactive';
    toggleButton.textContent = message;
    toggleButton.disabled = true;
    
    // Reset after delay
    setTimeout(() => {
      this.loadData();
    }, 3000);
  }

  // Add keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Space bar - toggle extension
      if (event.code === 'Space') {
        event.preventDefault();
        this.toggleExtension();
      }
      
      // Enter key - reload current page
      if (event.code === 'Enter') {
        event.preventDefault();
        this.reloadCurrentPage();
      }
      
      // Escape key - close popup
      if (event.code === 'Escape') {
        window.close();
      }
    });
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  
  .toggle-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .action-button:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// Initialize popup when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
  });
} else {
  new PopupManager();
}