# Agent 1: Marketing Website & Documentation

## Mission
Build a stunning Next.js 15 marketing website and comprehensive documentation site that showcases React LLM as a browser-native AI coding assistant. The hero should feature a live demo showing visual component selection and multi-model AI chat capabilities.

## Design Direction
- **Aesthetic**: Vercel/Linear inspired - clean, minimal, dark mode first
- **Typography**: Inter or SF Pro Display for headings, SF Mono for code
- **Colors**: 
  - Background: `#000000` to `#0a0a0a`
  - Primary: `#00DC82` (green accent)
  - Text: `#ffffff` to `#888888` gradients
  - Borders: `rgba(255,255,255,0.1)`
- **Animations**: Framer Motion for smooth, subtle effects

## Deliverables

### 1. Marketing Website Structure

```
apps/web/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Landing page
│   ├── demo/
│   │   └── page.tsx           # Full-page demo
│   ├── pricing/
│   │   └── page.tsx           # Pricing (free + pro)
│   └── api/
│       └── waitlist/route.ts  # Waitlist signup
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Sticky header
│   │   ├── Footer.tsx         # Minimal footer
│   │   └── Navigation.tsx     # Main nav
│   ├── home/
│   │   ├── Hero.tsx           # Hero with live demo
│   │   ├── Features.tsx       # Feature grid
│   │   ├── HowItWorks.tsx     # 3-step process
│   │   ├── Comparison.tsx     # vs React DevTools
│   │   ├── Installation.tsx   # Quick start
│   │   └── Testimonials.tsx   # Social proof
│   ├── demo/
│   │   ├── LiveDemo.tsx       # Preact wrapper
│   │   ├── DemoControls.tsx   # Demo options
│   │   └── CodePreview.tsx    # Show generated code
│   └── ui/
│       ├── Button.tsx         # Reusable button
│       ├── Card.tsx           # Feature cards
│       ├── CodeBlock.tsx      # Syntax highlighting
│       └── GradientText.tsx   # Gradient effects
├── styles/
│   ├── globals.css            # Tailwind + custom
│   └── fonts.ts               # Local font config
└── public/
    ├── demo/                  # Demo assets
    └── react-llm.js          # Hosted script
```

### 2. Key Components Implementation

#### Hero Section
```tsx
// components/home/Hero.tsx
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div className="space-y-6">
          <Badge>Now Available</Badge>
          <Badge variant="outline" className="ml-2">
            Supports GPT-4, Claude 3, Gemini & More
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold">
            Chat with your code,
            <GradientText>right in the browser</GradientText>
          </h1>
          <p className="text-xl text-gray-400">
            Click any component to select it. Chat with GPT-4, Claude, or Gemini. 
            Make live edits instantly. The future of web development is here.
          </p>
          <div className="flex gap-4">
            <Button size="lg" href="#install">
              Get Started
            </Button>
            <Button variant="outline" size="lg" href="/demo">
              Try Demo
            </Button>
          </div>
          {/* Install command */}
          <CodeBlock language="bash" copy>
            npm install --save-dev react-llm
          </CodeBlock>
        </div>
        
        {/* Right: Live Demo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl" />
          <LiveDemo />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
```

#### Live Demo Component
```tsx
// components/demo/LiveDemo.tsx
export function LiveDemo() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Dynamically load the Preact component
    const script = document.createElement('script')
    script.src = '/react-llm.js'
    script.onload = () => {
      window.ReactLLM.init({
        providers: {
          openrouter: process.env.NEXT_PUBLIC_OPENROUTER_DEMO_KEY,
        },
        // Model selected from UI after init,
        mode: 'demo',
        container: 'demo-container',
        demoFeatures: {
          componentSelection: true,
          modelSwitching: true,
          codePreview: true
        }
      })
      setIsLoaded(true)
    }
    document.body.appendChild(script)
  }, [])
  
  return (
    <div className="relative rounded-xl overflow-hidden bg-black/50 backdrop-blur border border-white/10">
      {/* Demo viewport */}
      <div className="aspect-video relative">
        {/* Fake browser chrome */}
        <div className="absolute top-0 inset-x-0 h-10 bg-black/80 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-xs text-gray-500">
            localhost:3000
          </div>
        </div>
        
        {/* Demo container */}
        <div id="demo-container" className="pt-10 h-full">
          {!isLoaded && <DemoSkeleton />}
        </div>
        
        {/* Overlay instructions */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur rounded-lg p-3">
          <p className="text-sm text-gray-300">
            🎯 Click any component to select • 🤖 Choose AI model • 💬 Chat to modify code
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 3. Documentation Site (Fumadocs)

```
apps/docs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── docs/
│       └── [[...slug]]/
│           └── page.tsx
├── content/
│   └── docs/
│       ├── index.mdx          # Introduction
│       ├── getting-started/
│       │   ├── installation.mdx
│       │   ├── quick-start.mdx
│       │   ├── configuration.mdx
│       │   └── providers.mdx      # LLM provider setup
│       ├── features/
│       │   ├── component-selection.mdx
│       │   ├── multi-model-ai.mdx  # Using different models
│       │   ├── live-editing.mdx    # Dev mode features
│       │   ├── component-library.mdx
│       │   └── keyboard-shortcuts.mdx
│       ├── guides/
│       │   ├── development-mode.mdx
│       │   ├── production-mode.mdx
│       │   ├── nextjs.mdx
│       │   ├── vite.mdx
│       │   └── model-selection.mdx # Choosing the right AI
│       ├── api/
│       │   ├── config.mdx
│       │   ├── methods.mdx
│       │   ├── providers.mdx      # Provider APIs
│       │   └── events.mdx
│       └── examples/
│           ├── basic-chat.mdx
│           ├── code-editing.mdx
│           ├── component-library.mdx
│           └── multi-file-refactor.mdx
├── components/
│   ├── MDXComponents.tsx
│   ├── DocSearch.tsx
│   └── InteractiveExample.tsx
└── fumadocs.config.ts
```

### 4. Interactive Examples

```tsx
// components/InteractiveExample.tsx
export function InteractiveExample({ 
  code, 
  height = 400,
  showLineNumbers = true 
}) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      {/* Tab bar */}
      <div className="bg-black/50 border-b border-white/10 flex">
        <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
          Preview
        </TabButton>
        <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')}>
          Code
        </TabButton>
      </div>
      
      {/* Content */}
      <div className="relative" style={{ height }}>
        {activeTab === 'preview' ? (
          <Sandpack
            template="react"
            theme={nightOwl}
            files={{
              '/App.js': code
            }}
            options={{
              showNavigator: false,
              showTabs: false,
              showLineNumbers
            }}
          />
        ) : (
          <CodeBlock language="jsx" lineNumbers={showLineNumbers}>
            {code}
          </CodeBlock>
        )}
      </div>
    </div>
  )
}
```

### 5. SEO & Performance

#### Metadata
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'React LLM - Browser-Native AI Coding Assistant',
  description: 'Chat with your React components using GPT-4, Claude, and more. Click to select, chat to modify, see changes instantly.',
  keywords: ['react', 'ai', 'LLM', 'gpt-4', 'claude', 'developer tools', 'code assistant', 'browser'],
  authors: [{ name: 'React LLM Team' }],
  openGraph: {
    title: 'React LLM - Browser-Native AI Coding Assistant',
    description: 'Chat with your React components using GPT-4, Claude, and more.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React LLM - Browser-Native AI Coding Assistant',
    description: 'Chat with your React components using GPT-4, Claude, and more.',
    images: ['/twitter-image.png'],
  },
}
```

#### Performance Optimizations
- Static generation for all marketing pages
- Dynamic imports for heavy components
- Image optimization with next/image
- Font subsetting with next/font
- Edge runtime for API routes

### 6. Analytics & Monitoring

```tsx
// app/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsProvider>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </AnalyticsProvider>
    </>
  )
}

// Track key events
trackEvent('demo_started', { provider: selectedProvider })
trackEvent('installation_copied', { method: 'script' })
trackEvent('docs_searched', { query })
trackEvent('model_selected', { provider, model })
trackEvent('component_selected_demo')
trackEvent('code_generated_demo')
```

### 7. Launch Checklist

- [ ] Domain setup (react-llm.dev)
- [ ] SSL certificates
- [ ] CDN configuration (Cloudflare)
- [ ] SEO optimization
  - [ ] Sitemap.xml
  - [ ] Robots.txt
  - [ ] Meta tags
  - [ ] Schema markup
- [ ] Social media assets
  - [ ] OG images (1200x630)
  - [ ] Twitter cards
  - [ ] Product Hunt assets
- [ ] Analytics setup
  - [ ] Google Analytics
  - [ ] PostHog events
  - [ ] Error tracking (Sentry)
- [ ] Performance testing
  - [ ] Lighthouse scores >95
  - [ ] Core Web Vitals pass
  - [ ] Load time <2s
- [ ] A/B testing setup
  - [ ] Hero variations
  - [ ] CTA buttons
  - [ ] Pricing page

## Development Workflow

1. **Setup**: Initialize Next.js 15 with TypeScript & App Router
2. **Design System**: Create UI components library with Tailwind
3. **Landing Page**: 
   - Hero with live React LLM demo
   - Feature grid showcasing multi-model AI
   - Use case examples (dev vs production)
   - Model comparison table
4. **Documentation**: 
   - Set up Fumadocs with search
   - Provider setup guides
   - Interactive examples with Sandpack
5. **Demo Integration**: 
   - Embed full React LLM with mock components
   - Model switching UI
   - Code preview panel
6. **Polish**: 
   - Framer Motion animations
   - Dark mode perfection
   - Mobile responsiveness
7. **Testing**: 
   - Cross-browser compatibility
   - Performance optimization
   - SEO validation
8. **Deploy**: 
   - Vercel with preview URLs
   - Edge functions for demos

## Resources

- Design inspiration: https://vercel.com, https://linear.app
- Icons: Lucide React
- Animations: Framer Motion
- Code highlighting: Shiki
- Interactive examples: Sandpack