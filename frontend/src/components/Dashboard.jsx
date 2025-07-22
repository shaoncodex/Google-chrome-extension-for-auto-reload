import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Settings, 
  BarChart3, 
  Globe, 
  Clock, 
  Activity,
  RefreshCw,
  Download
} from 'lucide-react';
import { mockApi } from '../mock';
import WebsiteManager from './WebsiteManager';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';

const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [websitesData, settingsData, statsData] = await Promise.all([
        mockApi.getWebsites(),
        mockApi.getSettings(),
        mockApi.getStats()
      ]);
      
      setWebsites(websitesData);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExtensionToggle = async (isActive) => {
    try {
      const updatedSettings = await mockApi.updateSettings({ isExtensionActive: isActive });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating extension status:', error);
    }
  };

  const downloadExtension = () => {
    // Mock download functionality
    console.log('Downloading Chrome extension...');
    alert('Chrome extension download will be available after completing setup!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Chrome Extension Manager
              </h1>
              <p className="text-slate-300">
                Manage your random webpage reloader extension
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={downloadExtension}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Extension
              </Button>
            </div>
          </div>

          {/* Status Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Extension Status</h3>
                    <p className="text-slate-300">
                      {settings?.isExtensionActive ? 'Active and running' : 'Paused'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={settings?.isExtensionActive ? "default" : "secondary"}
                    className={`px-3 py-1 ${
                      settings?.isExtensionActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {settings?.isExtensionActive ? 'ON' : 'OFF'}
                  </Badge>
                  <Switch
                    checked={settings?.isExtensionActive || false}
                    onCheckedChange={handleExtensionToggle}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="websites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger 
              value="websites" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              Websites
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites">
            <WebsiteManager 
              websites={websites} 
              setWebsites={setWebsites}
              mockApi={mockApi}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel 
              settings={settings} 
              setSettings={setSettings}
              mockApi={mockApi}
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatsPanel stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;