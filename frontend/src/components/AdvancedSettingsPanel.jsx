import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Settings, 
  Clock, 
  Shuffle, 
  Bell,
  Save,
  RefreshCw,
  Zap,
  AlertTriangle,
  Volume2,
  VolumeX,
  Hash,
  Play
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import TimeSelector from './TimeSelector';

const AdvancedSettingsPanel = ({ settings, setSettings, offlineApi }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const updatedSettings = await offlineApi.updateSettings(localSettings);
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

  const handleTimeChange = React.useCallback((newTime) => {
    updateLocalSetting('customInterval', newTime);
    // Also update the individual time components for display
    updateLocalSetting('customHours', Math.floor(newTime / 3600));
    updateLocalSetting('customMinutes', Math.floor((newTime % 3600) / 60));
    updateLocalSetting('customSeconds', newTime % 60);
  }, []);

  return (
    <div className="space-y-6">
      {/* Reload Mode & Timing */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reload Configuration
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure timing and reload behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reload Mode Selection */}
          <div className="space-y-2">
            <Label htmlFor="reload-mode">Reload Mode</Label>
            <Select
              value={localSettings.reloadMode || 'custom'}
              onValueChange={(value) => updateLocalSetting('reloadMode', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select reload mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Fixed Custom Interval</SelectItem>
                <SelectItem value="random">Random Time Range</SelectItem>
                <SelectItem value="sequential">Sequential (Round Robin)</SelectItem>
                <SelectItem value="smart">Smart Mode (Adaptive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Time Selector */}
          {localSettings.reloadMode === 'custom' && (
            <div className="space-y-4">
              <Separator className="bg-white/10" />
              <TimeSelector
                value={localSettings.customInterval || 60}
                onChange={handleTimeChange}
                showPresets={true}
                showAdvanced={true}
              />
            </div>
          )}

          {/* Random Range Settings */}
          {localSettings.reloadMode === 'random' && (
            <div className="space-y-4">
              <Separator className="bg-white/10" />
              <Label className="text-base">Random Time Range</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-interval">Minimum (seconds)</Label>
                  <Input
                    id="min-interval"
                    type="number"
                    min="5"
                    max="3600"
                    value={localSettings.minInterval || 30}
                    onChange={(e) => updateLocalSetting('minInterval', parseInt(e.target.value))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-interval">Maximum (seconds)</Label>
                  <Input
                    id="max-interval"
                    type="number"
                    min="5"
                    max="3600"
                    value={localSettings.maxInterval || 300}
                    onChange={(e) => updateLocalSetting('maxInterval', parseInt(e.target.value))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Reload Options */}
          <Separator className="bg-white/10" />
          <div className="space-y-4">
            <Label className="text-base">Advanced Options</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Randomize Website Order</Label>
                <p className="text-xs text-slate-400">
                  Randomly select which website to reload next
                </p>
              </div>
              <Switch
                checked={localSettings.randomizeOrder || false}
                onCheckedChange={(checked) => updateLocalSetting('randomizeOrder', checked)}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Auto-Start on Extension Load</Label>
                <p className="text-xs text-slate-400">
                  Automatically start reloading when extension is enabled
                </p>
              </div>
              <Switch
                checked={localSettings.autoStartEnabled || false}
                onCheckedChange={(checked) => updateLocalSetting('autoStartEnabled', checked)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications & Feedback
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure alerts and visual feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm">Enable Notifications</Label>
              <p className="text-xs text-slate-400">
                Get browser notifications when websites are reloaded
              </p>
            </div>
            <Switch
              checked={localSettings.notifications || false}
              onCheckedChange={(checked) => updateLocalSetting('notifications', checked)}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <Label className="text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Notification Sound
              </Label>
              <p className="text-xs text-slate-400">
                Play sound when reloading occurs
              </p>
            </div>
            <Switch
              checked={localSettings.notificationSound || false}
              onCheckedChange={(checked) => updateLocalSetting('notificationSound', checked)}
              className="data-[state=checked]:bg-orange-500"
              disabled={!localSettings.notifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Show Badge Count
              </Label>
              <p className="text-xs text-slate-400">
                Display reload count on extension icon
              </p>
            </div>
            <Switch
              checked={localSettings.showBadgeCount || false}
              onCheckedChange={(checked) => updateLocalSetting('showBadgeCount', checked)}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Handling */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error Handling
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure behavior when websites fail to load
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm">Pause on Error</Label>
              <p className="text-xs text-slate-400">
                Stop reloading if a website fails to load
              </p>
            </div>
            <Switch
              checked={localSettings.pauseOnError || false}
              onCheckedChange={(checked) => updateLocalSetting('pauseOnError', checked)}
              className="data-[state=checked]:bg-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retry-count">Retry Attempts</Label>
            <Select
              value={localSettings.retryOnError?.toString() || '3'}
              onValueChange={(value) => updateLocalSetting('retryOnError', parseInt(value))}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select retry count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Retry</SelectItem>
                <SelectItem value="1">1 Retry</SelectItem>
                <SelectItem value="3">3 Retries</SelectItem>
                <SelectItem value="5">5 Retries</SelectItem>
                <SelectItem value="10">10 Retries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Extension Sync Info */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Extension Sync
          </CardTitle>
          <CardDescription className="text-slate-300">
            Synchronization with Chrome extension
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm">Last Sync</h4>
                <p className="text-xs text-slate-400">
                  {localSettings.lastSync 
                    ? new Date(localSettings.lastSync).toLocaleString() 
                    : 'Never synced'
                  }
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="text-green-400 border-green-400/30 bg-green-400/10"
              >
                Connected
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Force Sync Extension
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
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSettingsPanel;