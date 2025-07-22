import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Zap, Timer } from 'lucide-react';

const TimeSelector = ({ 
  value = 60, 
  onChange, 
  showPresets = true, 
  showAdvanced = true,
  className = "" 
}) => {
  // Convert seconds to hours, minutes, seconds
  const [hours, setHours] = useState(Math.floor(value / 3600));
  const [minutes, setMinutes] = useState(Math.floor((value % 3600) / 60));
  const [seconds, setSeconds] = useState(value % 60);

  // Quick presets in seconds
  const presets = [
    { name: '10s', value: 10, icon: Zap },
    { name: '30s', value: 30, icon: Zap },
    { name: '1m', value: 60, icon: Timer },
    { name: '2m', value: 120, icon: Timer },
    { name: '5m', value: 300, icon: Timer },
    { name: '10m', value: 600, icon: Timer },
    { name: '30m', value: 1800, icon: Clock },
    { name: '1h', value: 3600, icon: Clock }
  ];

  // Update parent when time values change
  useEffect(() => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds !== value) {
      onChange(totalSeconds);
    }
  }, [hours, minutes, seconds, onChange, value]);

  // Update local state when value prop changes
  useEffect(() => {
    if (value !== (hours * 3600) + (minutes * 60) + seconds) {
      setHours(Math.floor(value / 3600));
      setMinutes(Math.floor((value % 3600) / 60));
      setSeconds(value % 60);
    }
  }, [value]);

  const handlePresetClick = (presetValue) => {
    setHours(Math.floor(presetValue / 3600));
    setMinutes(Math.floor((presetValue % 3600) / 60));
    setSeconds(presetValue % 60);
  };

  const formatDisplayTime = () => {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Time Display */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-400">Current interval:</span>
        <Badge variant="outline" className="font-mono text-purple-400 border-purple-400/30">
          {formatDisplayTime()}
        </Badge>
      </div>

      {/* Quick Presets */}
      {showPresets && (
        <div className="space-y-2">
          <Label className="text-sm text-slate-300">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isActive = value === preset.value;
              return (
                <Button
                  key={preset.name}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetClick(preset.value)}
                  className={`
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0' 
                      : 'border-white/20 text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {preset.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Time Input */}
      {showAdvanced && (
        <div className="space-y-3">
          <Label className="text-sm text-slate-300">Custom Time</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="hours" className="text-xs text-slate-400">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/20 text-white text-center"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="minutes" className="text-xs text-slate-400">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/20 text-white text-center"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="seconds" className="text-xs text-slate-400">Seconds</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="bg-white/5 border-white/20 text-white text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {(hours * 3600 + minutes * 60 + seconds) < 5 && (
        <div className="text-xs text-amber-400 bg-amber-400/10 p-2 rounded border border-amber-400/20">
          ⚠️ Minimum interval is 5 seconds for performance reasons
        </div>
      )}
    </div>
  );
};

export default TimeSelector;