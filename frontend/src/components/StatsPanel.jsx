import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  Globe, 
  RefreshCw, 
  Clock, 
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react';

const StatsPanel = ({ stats }) => {
  const StatCard = ({ title, value, description, icon: Icon, trend, color = "blue" }) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    trend > 0 
                      ? 'text-green-400 border-green-400/30 bg-green-400/10' 
                      : 'text-red-400 border-red-400/30 bg-red-400/10'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {Math.abs(trend)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Websites"
          value={stats?.totalWebsites || 0}
          description="Websites in your list"
          icon={Globe}
          color="blue"
        />
        <StatCard
          title="Active Websites"
          value={stats?.activeWebsites || 0}
          description="Currently being reloaded"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Total Reloads"
          value={stats?.totalReloads || 0}
          description="All-time reload count"
          icon={RefreshCw}
          trend={12}
          color="purple"
        />
        <StatCard
          title="Avg Reload Time"
          value={`${stats?.avgReloadTime || 0}s`}
          description="Average interval between reloads"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extension Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Extension Status
            </CardTitle>
            <CardDescription className="text-slate-300">
              Current extension activity and uptime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Status</span>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-mono">{stats?.uptime || '0h 0m'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Last Active</span>
              <span className="text-sm">
                {stats?.lastActive 
                  ? new Date(stats.lastActive).toLocaleTimeString()
                  : 'Never'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-300">
              Latest reload events and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm">Google reloaded</p>
                  <p className="text-xs text-slate-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">GitHub reloaded</p>
                  <p className="text-xs text-slate-400">7 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Reddit reloaded</p>
                  <p className="text-xs text-slate-400">12 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Overview
          </CardTitle>
          <CardDescription className="text-slate-300">
            Daily reload activity and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-slate-400">Performance chart will be available</p>
              <p className="text-sm text-slate-500">after collecting more data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;