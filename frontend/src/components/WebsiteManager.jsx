import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Clock,
  RefreshCw,
  Play
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const WebsiteManager = ({ websites, setWebsites, offlineApi }) => {
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newWebsiteName, setNewWebsiteName] = useState('');
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const { toast } = useToast();

  const addWebsite = async (e) => {
    e.preventDefault();
    
    if (!newWebsiteUrl.trim() || !newWebsiteName.trim()) {
      toast({
        title: "Error",
        description: "Please provide both URL and name",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(newWebsiteUrl);
    } catch {
      toast({
        title: "Error", 
        description: "Please provide a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsAddingWebsite(true);
    
    try {
      const newWebsite = await offlineApi.addWebsite({
        url: newWebsiteUrl,
        name: newWebsiteName
      });
      
      setWebsites(prev => [...prev, newWebsite]);
      setNewWebsiteUrl('');
      setNewWebsiteName('');
      
      toast({
        title: "Success",
        description: "Website added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add website",
        variant: "destructive"
      });
    } finally {
      setIsAddingWebsite(false);
    }
  };

  const toggleWebsiteStatus = async (id, isActive) => {
    try {
      const updatedWebsite = await offlineApi.updateWebsite(id, { isActive });
      setWebsites(prev => 
        prev.map(w => w.id === id ? updatedWebsite : w)
      );
      
      toast({
        title: "Success",
        description: `Website ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update website status",
        variant: "destructive"
      });
    }
  };

  const deleteWebsite = async (id) => {
    if (!window.confirm('Are you sure you want to delete this website?')) {
      return;
    }

    try {
      await mockApi.deleteWebsite(id);
      setWebsites(prev => prev.filter(w => w.id !== id));
      
      toast({
        title: "Success",
        description: "Website deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive"
      });
    }
  };

  const formatLastReloaded = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Add Website Form */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Website
          </CardTitle>
          <CardDescription className="text-slate-300">
            Add websites to your random reload list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addWebsite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  type="url"
                  placeholder="https://example.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website-name">Display Name</Label>
                <Input
                  id="website-name"
                  placeholder="Example Site"
                  value={newWebsiteName}
                  onChange={(e) => setNewWebsiteName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isAddingWebsite}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isAddingWebsite ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Website
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Websites List */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Managed Websites ({websites.length})
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure which websites to include in random reloading
          </CardDescription>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No websites added yet</p>
              <p className="text-sm">Add your first website above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{website.name}</h3>
                        <Badge 
                          variant={website.isActive ? "default" : "secondary"}
                          className={`${
                            website.isActive 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}
                        >
                          {website.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {website.autoStart && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            <Play className="w-3 h-3 mr-1" />
                            Auto-Start
                          </Badge>
                        )}
                        {website.customInterval && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {website.customInterval}s
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-1">{website.url}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last reload: {formatLastReloaded(website.lastReloaded)}
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {website.reloadCount || 0} reloads
                        </span>
                        <span>
                          Added: {new Date(website.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(website.url, '_blank')}
                      className="text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={website.isActive}
                      onCheckedChange={(checked) => toggleWebsiteStatus(website.id, checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteWebsite(website.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;