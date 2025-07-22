// Mock data for Chrome Extension Manager

export const mockWebsites = [
  {
    id: '1',
    url: 'https://www.google.com',
    name: 'Google',
    isActive: true,
    addedAt: new Date('2024-01-15'),
    lastReloaded: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2', 
    url: 'https://www.github.com',
    name: 'GitHub',
    isActive: true,
    addedAt: new Date('2024-01-16'),
    lastReloaded: new Date('2024-01-20T10:25:00')
  },
  {
    id: '3',
    url: 'https://www.stackoverflow.com',
    name: 'Stack Overflow',
    isActive: false,
    addedAt: new Date('2024-01-17'),
    lastReloaded: new Date('2024-01-20T09:45:00')
  },
  {
    id: '4',
    url: 'https://www.reddit.com',
    name: 'Reddit',
    isActive: true,
    addedAt: new Date('2024-01-18'),
    lastReloaded: new Date('2024-01-20T10:15:00')
  }
];

export const mockSettings = {
  id: 'default',
  isExtensionActive: true,
  reloadMode: 'random', // 'random' | 'custom' | 'sequential'
  minInterval: 30, // seconds
  maxInterval: 300, // seconds  
  customInterval: 60, // seconds
  randomizeOrder: true,
  notifications: true,
  lastSync: new Date('2024-01-20T10:35:00')
};

export const mockStats = {
  totalWebsites: 4,
  activeWebsites: 3,
  totalReloads: 1247,
  avgReloadTime: 145, // seconds
  lastActive: new Date('2024-01-20T10:35:00'),
  uptime: '2d 14h 23m'
};

// Mock API functions
export const mockApi = {
  getWebsites: () => Promise.resolve(mockWebsites),
  
  addWebsite: (website) => {
    const newWebsite = {
      ...website,
      id: Date.now().toString(),
      addedAt: new Date(),
      lastReloaded: null,
      isActive: true
    };
    mockWebsites.push(newWebsite);
    return Promise.resolve(newWebsite);
  },
  
  updateWebsite: (id, updates) => {
    const index = mockWebsites.findIndex(w => w.id === id);
    if (index !== -1) {
      mockWebsites[index] = { ...mockWebsites[index], ...updates };
      return Promise.resolve(mockWebsites[index]);
    }
    return Promise.reject(new Error('Website not found'));
  },
  
  deleteWebsite: (id) => {
    const index = mockWebsites.findIndex(w => w.id === id);
    if (index !== -1) {
      mockWebsites.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Website not found'));
  },
  
  getSettings: () => Promise.resolve(mockSettings),
  
  updateSettings: (updates) => {
    Object.assign(mockSettings, updates);
    return Promise.resolve(mockSettings);
  },
  
  getStats: () => Promise.resolve(mockStats)
};