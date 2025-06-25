'use client'

import React, { useState } from 'react'
import { Copy, Check, Package, Globe, Zap, Terminal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

type InstallMethod = 'npm' | 'script' | 'cdn'

const installMethods = {
  npm: {
    title: 'NPM Package',
    description: 'Best for React projects with build tools',
    icon: Package,
    badge: 'Recommended',
    steps: [
      {
        title: 'Install the package',
        code: 'npm install --save-dev react-llm',
        language: 'bash'
      },
      {
        title: 'Import and initialize',
        code: `import { ReactLLM } from 'react-llm'

// Initialize with your API keys
ReactLLM.init({
  providers: {
    openai: 'sk-...',
    anthropic: 'sk-ant-...',
    // or use OpenRouter for all models
    openrouter: 'sk-or-...'
  },
  mode: 'development' // or 'production'
})`,
        language: 'javascript'
      }
    ]
  },
  script: {
    title: 'Script Tag',
    description: 'Works on any website, no build tools needed',
    icon: Globe,
    steps: [
      {
        title: 'Add the script tag',
        code: '<script src="https://unpkg.com/react-llm@latest/dist/react-llm.js"></script>',
        language: 'html'
      },
      {
        title: 'Initialize React LLM',
        code: `<script>
  ReactLLM.init({
    providers: {
      openrouter: 'sk-or-your-api-key'
    },
    mode: 'production' // safe for live sites
  })
</script>`,
        language: 'html'
      }
    ]
  },
  cdn: {
    title: 'CDN Import',
    description: 'ES modules for modern browsers',
    icon: Zap,
    steps: [
      {
        title: 'Import from CDN',
        code: `import { ReactLLM } from 'https://unpkg.com/react-llm@latest/dist/react-llm.esm.js'

ReactLLM.init({
  providers: {
    openrouter: 'sk-or-your-api-key'
  }
})`,
        language: 'javascript'
      }
    ]
  }
}

function CodeBlock({ code }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}

export function Installation() {
  const [activeMethod, setActiveMethod] = useState<InstallMethod>('npm')
  const method = installMethods[activeMethod]
  const Icon = method.icon

  return (
    <section id="install" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Quick{" "}
            <span className="gradient-text">Installation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get React LLM running in your project in under 2 minutes. 
            Choose the installation method that works best for your setup.
          </p>
        </div>

        {/* Method Selection */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {(Object.keys(installMethods) as InstallMethod[]).map((key) => {
            const method = installMethods[key]
            const MethodIcon = method.icon
            return (
              <Button
                key={key}
                variant={activeMethod === key ? 'default' : 'outline'}
                onClick={() => setActiveMethod(key)}
                className="flex items-center gap-2 h-auto py-3 px-6"
              >
                <MethodIcon className="w-4 h-4" />
                {method.title}
                {'badge' in method && method.badge && activeMethod !== key && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {method.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>

        {/* Installation Steps */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {method.title}
                    {'badge' in method && method.badge && (
                      <Badge variant="success" className="text-xs">
                        {'badge' in method ? method.badge : ''}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {method.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {method.steps.map((step, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                  </div>
                  <CodeBlock code={step.code} language={step.language} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Environment Setup */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                API Key Setup
              </CardTitle>
              <CardDescription>
                You&apos;ll need API keys from your preferred AI providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Recommended: OpenRouter</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Single API key for all models (GPT-4, Claude, Gemini, etc.)
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>1. Sign up at <code className="bg-muted px-1 rounded">openrouter.ai</code></div>
                    <div>2. Generate an API key</div>
                    <div>3. Use key with <code className="bg-muted px-1 rounded">openrouter</code> provider</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Direct Providers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use API keys directly from each provider
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>• <code className="bg-muted px-1 rounded">openai</code> - OpenAI API key</div>
                    <div>• <code className="bg-muted px-1 rounded">anthropic</code> - Anthropic API key</div>
                    <div>• <code className="bg-muted px-1 rounded">google</code> - Google AI API key</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to start building?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="/demo">
              Try Interactive Demo
            </Button>
            <Button variant="outline" size="lg" href="/docs">
              Read Full Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}