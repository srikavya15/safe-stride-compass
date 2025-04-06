
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
  type: 'mapbox' | 'crime';
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit, type }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const storageKey = `safe-stride-${type}-api-key`;

  useEffect(() => {
    // Check if API key is already saved in localStorage
    const savedApiKey = localStorage.getItem(storageKey);
    if (savedApiKey) {
      setSavedKey(savedApiKey);
      onApiKeySubmit(savedApiKey);
    }
  }, [storageKey, onApiKeySubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem(storageKey, apiKey);
    setSavedKey(apiKey);
    onApiKeySubmit(apiKey);
    
    toast({
      title: "API Key Saved",
      description: `Your ${type === 'mapbox' ? 'Mapbox' : 'Crime API'} key has been saved.`,
    });
  };

  const clearApiKey = () => {
    localStorage.removeItem(storageKey);
    setSavedKey(null);
    setApiKey('');
    toast({
      title: "API Key Removed",
      description: `Your ${type === 'mapbox' ? 'Mapbox' : 'Crime API'} key has been removed.`,
    });
  };

  if (savedKey) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{type === 'mapbox' ? 'Mapbox' : 'Crime API'} Key Configured</CardTitle>
          <CardDescription>
            Your API key is already configured and saved securely in your browser.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={clearApiKey} className="w-full">
            Clear API Key
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === 'mapbox' ? 'Mapbox' : 'Crime API'} API Key</CardTitle>
        <CardDescription>
          {type === 'mapbox' 
            ? 'Enter your Mapbox public API key to enable the maps.' 
            : 'Enter your Crime API key to retrieve crime data.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save API Key</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApiKeyInput;
