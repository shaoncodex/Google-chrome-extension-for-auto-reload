import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Clock, 
  Shuffle, 
  Bell,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SettingsPanel = ({ settings, setSettings, mockApi }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const updatedSettings = await mockApi.updateSettings(localSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateLocalSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Reload Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reload Configuration
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure how and when websites are reloaded
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reload-mode">Reload Mode</Label>
            <Select
              value={localSettings.reloadMode || 'random'}
              onValueChange={(value) => updateLocalSetting('reloadMode', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select reload mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random Intervals</SelectItem>
                <SelectItem value="custom">Fixed Custom Interval</SelectItem>
                <SelectItem value="sequential">Sequential (One by One)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localSettings.reloadMode === 'random' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-interval">Minimum Interval (seconds)</Label>
                <Input
                  id="min-interval"
                  type="number"
                  min="10"
                  max="3600"
                  value={localSettings.minInterval || 30}
                  onChange={(e) => updateLocalSetting('minInterval', parseInt(e.target.value))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-interval">Maximum Interval (seconds)</Label>
                <Input
                  id="max-interval"
                  type="number"
                  min="10"
                  max="3600"
                  value={localSettings.maxInterval || 300}
                  onChange={(e) => updateLocalSetting('maxInterval', parseInt(e.target.value))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          )}

          {localSettings.reloadMode === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-interval">Custom Interval (seconds)</Label>
              <Input
                id="custom-interval"
                type="number"
                min="10"
                max="3600"
                value={localSettings.customInterval || 60}
                onChange={(e) => updateLocalSetting('customInterval', parseInt(e.target.value))}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          )}

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Randomize Website Order</Label>
              <p className="text-sm text-slate-400">
                Randomly select which website to reload next
              </p>
            </div>
            <Switch
              checked={localSettings.randomizeOrder || false}
              onCheckedChange={(checked) => updateLocalSetting('randomizeOrder', checked)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure extension notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Enable Notifications</Label>
              <p className="text-sm text-slate-400">
                Get notified when websites are reloaded
              </p>
            </div>
            <Switch
              checked={localSettings.notifications || false}
              onCheckedChange={(checked) => updateLocalSetting('notifications', checked)}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Advanced Options
          </CardTitle>
          <CardDescription className="text-slate-300">
            Additional configuration options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold mb-2">Extension Sync</h4>
            <p className="text-sm text-slate-400 mb-3">
              Last synced: {localSettings.lastSync ? new Date(localSettings.lastSync).toLocaleString() : 'Never'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;