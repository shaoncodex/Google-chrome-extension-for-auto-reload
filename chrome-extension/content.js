// Content Script for Random Webpage Reloader
class ContentScript {
  constructor() {
    this.isReloading = false;
    this.reloadCount = 0;
    this.startTime = Date.now();
    
    this.initializeContentScript();
  }

  initializeContentScript() {
    console.log('🔧 Content script loaded for:', window.location.href);
    
    // Add visual indicator if extension is active
    this.addVisualIndicator();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });
    
    // Monitor page load events
    this.monitorPageEvents();
    
    // Inject page interaction capabilities
    this.injectPageCapabilities();
  }

  addVisualIndicator() {
    // Only add indicator if not already present
    if (document.getElementById('random-reloader-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'random-reloader-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 12px;
      height: 12px;
      background: #10B981;
      border-radius: 50%;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      pointer-events: none;
    `;
    
    document.body.appendChild(indicator);
    
    // Check if extension is active and show indicator
    this.updateIndicatorStatus();
  }

  async updateIndicatorStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
      const indicator = document.getElementById('random-reloader-indicator');
      
      if (indicator && response.success) {
        if (response.isActive) {
          indicator.style.opacity = '0.7';
          indicator.style.background = '#10B981';
          indicator.title = 'Random Reloader: Active';
        } else {
          indicator.style.opacity = '0.3';
          indicator.style.background = '#6B7280';
          indicator.title = 'Random Reloader: Inactive';
        }
      }
    } catch (error) {
      console.log('Could not get extension status:', error);
    }
  }

  handleMessage(message, sender, sendResponse) {
    console.log('📨 Content script received message:', message.type);
    
    switch (message.type) {
      case 'RELOAD_PAGE':
        this.reloadPage();
        sendResponse({ success: true });
        break;
        
      case 'GET_PAGE_INFO':
        sendResponse({
          success: true,
          data: {
            url: window.location.href,
            title: document.title,
            loadTime: Date.now() - this.startTime,
            reloadCount: this.reloadCount
          }
        });
        break;
        
      case 'UPDATE_STATUS':
        this.updateIndicatorStatus();
        sendResponse({ success: true });
        break;
        
      case 'SHOW_RELOAD_NOTIFICATION':
        this.showReloadNotification(message.data);
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }

  monitorPageEvents() {
    // Track page load time
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onPageLoaded();
      });
    } else {
      this.onPageLoaded();
    }
    
    // Monitor for page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.onVisibilityChange();
    });
    
    // Monitor for beforeunload (page refresh/navigate away)
    window.addEventListener('beforeunload', () => {
      this.onBeforeUnload();
    });
  }

  onPageLoaded() {
    console.log('📄 Page loaded:', window.location.href);
    
    // Update indicator
    setTimeout(() => {
      this.updateIndicatorStatus();
    }, 1000);
    
    // Send page load event to background
    chrome.runtime.sendMessage({
      type: 'PAGE_LOADED',
      data: {
        url: window.location.href,
        title: document.title,
        loadTime: Date.now() - this.startTime
      }
    }).catch(() => {
      // Extension might not be available
    });
  }

  onVisibilityChange() {
    if (!document.hidden) {
      // Page became visible, update status
      this.updateIndicatorStatus();
    }
  }

  onBeforeUnload() {
    // Page is about to reload/navigate away
    console.log('🔄 Page reloading/navigating away');
  }

  reloadPage() {
    if (this.isReloading) return;
    
    this.isReloading = true;
    this.reloadCount++;
    
    console.log(`🔄 Reloading page (${this.reloadCount})...`);
    
    // Show reload animation/notification
    this.showReloadAnimation();
    
    // Reload the page
    setTimeout(() => {
      window.location.reload();
    }, 500); // Small delay for animation
  }

  showReloadAnimation() {
    const indicator = document.getElementById('random-reloader-indicator');
    if (indicator) {
      // Animate the indicator
      indicator.style.transform = 'scale(1.5)';
      indicator.style.opacity = '1';
      indicator.style.background = '#F59E0B';
      
      setTimeout(() => {
        indicator.style.transform = 'scale(1)';
        indicator.style.opacity = '0.7';
        indicator.style.background = '#10B981';
      }, 300);
    }
  }

  showReloadNotification(data) {
    // Create temporary notification overlay
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    notification.textContent = data.message || 'Page will reload soon...';
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  injectPageCapabilities() {
    // Inject additional capabilities that can interact with the page
    this.injectKeyboardShortcuts();
    this.injectContextMenu();
  }

  injectKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+R (or Cmd+Shift+R on Mac) - Manual reload
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        this.reloadPage();
      }
      
      // Ctrl+Shift+T (or Cmd+Shift+T on Mac) - Toggle extension
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' }).catch(() => {
          console.log('Could not toggle extension');
        });
      }
    });
  }

  injectContextMenu() {
    // Add right-click context menu items (handled by background script)
    // This is just a placeholder for any page-specific context menu handling
    document.addEventListener('contextmenu', (event) => {
      // Could add custom context menu items here if needed
    });
  }

  // Utility methods for advanced features
  
  async getPageMetrics() {
    return {
      url: window.location.href,
      title: document.title,
      loadTime: Date.now() - this.startTime,
      reloadCount: this.reloadCount,
      isVisible: !document.hidden,
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      },
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      hasErrors: this.checkForPageErrors()
    };
  }

  checkForPageErrors() {
    // Check for common page error indicators
    const errorSelectors = [
      '[class*="error"]',
      '[class*="404"]',
      '[class*="not-found"]',
      '[id*="error"]'
    ];
    
    return errorSelectors.some(selector => {
      return document.querySelector(selector) !== null;
    });
  }

  preserveScrollPosition() {
    // Store scroll position before reload
    const scrollData = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem('randomReloaderScroll', JSON.stringify(scrollData));
  }

  restoreScrollPosition() {
    // Restore scroll position after reload
    const scrollData = sessionStorage.getItem('randomReloaderScroll');
    if (scrollData) {
      try {
        const data = JSON.parse(scrollData);
        // Only restore if reload was recent (within 10 seconds)
        if (Date.now() - data.timestamp < 10000) {
          window.scrollTo(data.x, data.y);
        }
        sessionStorage.removeItem('randomReloaderScroll');
      } catch (error) {
        console.log('Could not restore scroll position:', error);
      }
    }
  }
}

// Initialize content script only if not already initialized
if (!window.randomReloaderContentScript) {
  window.randomReloaderContentScript = new ContentScript();
  
  // Restore scroll position if this was a reload
  window.randomReloaderContentScript.restoreScrollPosition();
}