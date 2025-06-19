'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Play, ExternalLink } from 'lucide-react';

interface InteractiveDemoProps {
  title: string;
  description: string;
  code: string;
  preview?: React.ReactNode;
  height?: number;
  language?: string;
}

export function InteractiveDemo({
  title,
  description,
  code,
  preview,
  height = 400,
  language = 'tsx'
}: InteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{language}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="h-8"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}>
          <div className="flex items-center justify-between px-6 py-2 border-b">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <Button variant="outline" size="sm" className="h-8">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in CodeSandbox
              </Button>
            )}
          </div>
          
          <TabsContent value="preview" className="mt-0">
            <div 
              className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center"
              style={{ height }}
            >
              {preview ? (
                preview
              ) : (
                <div className="text-center text-muted-foreground">
                  <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Interactive preview would render here</p>
                  <p className="text-xs mt-1">
                    This would show the actual React LLM interface
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="mt-0">
            <div 
              className="relative bg-slate-950 text-slate-50 overflow-auto"
              style={{ height }}
            >
              <pre className="p-6 text-sm leading-relaxed">
                <code className="language-tsx">
                  {code}
                </code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}