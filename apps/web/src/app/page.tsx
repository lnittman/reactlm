import { ActionListItem } from '@/components/ui/ActionListItem'
import { CodeBlock } from '@/components/ui/CodeBlock'

export default function Home() {
  return (
    <main className="container">
        <header className="header">
          <div className="header-left">
            <img src="/logo.png" alt="reactlm" className="header-logo" />
            <h1 className="header-title">reactlm</h1>
          </div>
          <nav className="header-nav">
            <a href="/docs" className="nav-link">docs</a>
            <a href="/demo" className="nav-link">demo</a>
            <a href="https://github.com/reactlm/reactlm" className="nav-link" target="_blank">github</a>
          </nav>
        </header>
        
        <div className="intro">
          <p>
            reactlm is bringing AI-powered development to the browser. we are a group of engineers building tools that let developers chat with their react components, make live code changes, and explore any website&apos;s architecture.
          </p>
        </div>
        
        <section className="content-section">
          <h2>key features</h2>
          <ActionListItem 
            href="/docs/visual-selection"
            description="click any component to inspect its structure, props, and state. powered by bippy react fiber traversal."
          >
            visual component selection
          </ActionListItem>
          <ActionListItem 
            href="/docs/multi-model"
            description="choose from openai, anthropic claude, google gemini, and more via openrouter's unified api."
          >
            multi-model LLM support
          </ActionListItem>
          <ActionListItem 
            href="/docs/live-editing"
            description="make changes through ai chat and see them instantly via hot module replacement in development."
          >
            live code editing
          </ActionListItem>
          <ActionListItem 
            href="/docs/zero-config"
            description="single script tag integration. works on any website—development or production."
          >
            zero configuration
          </ActionListItem>
          <ActionListItem 
            href="/docs/storage"
            description="sqlite wasm with opfs persistence. all data stays local and private."
          >
            browser-native storage
          </ActionListItem>
          <ActionListItem 
            href="/docs/component-library"
            description="save interesting patterns from any website. build your own component collection."
          >
            component library management
          </ActionListItem>
        </section>

        <section className="content-section">
          <h2>installation</h2>
          
          <h3>script tag</h3>
          <CodeBlock language="html">
{`<!-- Add to any HTML page -->
<script src="https://unpkg.com/reactlm/dist/reactlm.js"></script>
<script>
  ReactLM.init({
    providers: {
      openrouter: 'sk-or-...' // Recommended: access to all models
      // Or use individual providers:
      // openai: 'sk-...',
      // anthropic: 'sk-ant-...',
    },
    mode: 'production' // or 'development' for file editing
  });
</script>`}
          </CodeBlock>

          <h3>npm package</h3>
          <CodeBlock language="javascript">
{`npm install reactlm
# or
pnpm add reactlm

// React component usage
import { ReactLMProvider } from 'reactlm';

function App() {
  return (
    <ReactLMProvider 
      config={{ 
        providers: { /* your API keys */ },
        theme: 'dark',
        position: 'bottom-right'
      }}
    >
      {/* Your app */}
    </ReactLMProvider>
  );
}`}
          </CodeBlock>

          <h3>development server plugin</h3>
          <CodeBlock language="javascript">
{`// vite.config.js or webpack.config.js
import { reactLMPlugin } from 'reactlm/plugin';

export default {
  plugins: [
    reactLMPlugin({
      enableHotReload: true,
      fileAccess: true,
      sourceMaps: true
    })
  ]
};`}
          </CodeBlock>
        </section>

        <section className="content-section">
          <h2>use cases</h2>
          <ActionListItem>
            make live code changes through ai chat
          </ActionListItem>
          <ActionListItem>
            explore components and save patterns
          </ActionListItem>
          <ActionListItem>
            understand structure and implementation
          </ActionListItem>
          <ActionListItem>
            build cross-site component libraries
          </ActionListItem>
        </section>

        <section className="content-section">
          <h2>technology stack</h2>
          <ActionListItem>
            preact + signals for reactive ui
          </ActionListItem>
          <ActionListItem>
            bippy for react fiber instrumentation
          </ActionListItem>
          <ActionListItem>
            sqlite wasm with opfs persistence
          </ActionListItem>
          <ActionListItem>
            openrouter for unified LLM access
          </ActionListItem>
          <ActionListItem>
            file system access api for live editing
          </ActionListItem>
          <ActionListItem>
            shadow dom for style isolation
          </ActionListItem>
        </section>

        <section className="content-section">
          <h2>resources</h2>
          <ActionListItem href="/docs">
            documentation and guides
          </ActionListItem>
          <ActionListItem href="/demo">
            interactive demo
          </ActionListItem>
          <ActionListItem href="https://github.com/react-llm/react-llm" target="_blank">
            view source on github
          </ActionListItem>
          <ActionListItem href="https://github.com/react-llm/react-llm/issues" target="_blank">
            report issues and feedback
          </ActionListItem>
        </section>

        <footer>
          <p>
            if you are interested in contributing, please <a href="https://github.com/react-llm/react-llm">get in touch</a>.
          </p>
        </footer>
      </main>
  )
}
