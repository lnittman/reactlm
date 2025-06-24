import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      {/* Hero Section */}
      <section className="content-section">
        <div className="header">
          <div className="header-left">
            <h1 className="header-title">reactlm docs</h1>
          </div>
          <div className="header-nav">
            <Link href="https://reactlm.dev" className="nav-link">
              website
            </Link>
            <Link href="https://github.com/reactlm/reactlm" className="nav-link">
              github
            </Link>
            <Link href="https://discord.gg/reactlm" className="nav-link">
              discord
            </Link>
          </div>
        </div>
        
        <div className="intro">
          <p>
            complete documentation for reactlm - the browser-native ai coding assistant
            that lets you chat with your react components and code directly in the browser.
            learn how to integrate, configure, and use every feature.
          </p>
        </div>

        {/* Quick Start */}
        <div className="content-section">
          <h2>quick start</h2>
          <p>get reactlm running in 30 seconds:</p>
          
          <pre className="code-block">
{`<script src="https://unpkg.com/reactlm/dist/reactlm.js"></script>
<script>
  ReactLM.init({
    providers: {
      openrouter: 'sk-or-...' // get your key at openrouter.ai
    }
  });
</script>`}
          </pre>
          
          <div className="row">
            <Link href="/docs" className="button button-primary">
              get started →
            </Link>
            <Link href="/docs/api" className="button button-secondary">
              api reference
            </Link>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="content-section">
          <h2>documentation sections</h2>
          
          <Link href="/docs/getting-started" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">🚀</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">getting started</div>
                <div className="action-list-item-description">
                  learn the basics and get reactlm up and running in your project
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/installation" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">📦</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">installation</div>
                <div className="action-list-item-description">
                  multiple ways to integrate: script tag, npm, browser extension, framework plugins
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/features" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">⚡</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">features</div>
                <div className="action-list-item-description">
                  explore component selection, multi-model ai, live editing, and more
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/guides" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">📖</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">guides</div>
                <div className="action-list-item-description">
                  best practices, workflows, and advanced usage patterns
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/api" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">🔧</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">api reference</div>
                <div className="action-list-item-description">
                  complete typescript definitions, methods, events, and configuration
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/examples" className="action-list-item">
            <div className="action-list-item-main">
              <div className="action-list-item-icon">💡</div>
              <div className="action-list-item-content">
                <div className="action-list-item-text">examples</div>
                <div className="action-list-item-description">
                  real-world usage examples for react, next.js, vite, and more
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="content-section">
          <h2>key features</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🎯</div>
              <h3 className="feature-card-title">zero-config setup</h3>
              <p className="feature-card-description">
                single script tag or npm package. no api endpoints, no server setup.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card-icon">🔍</div>
              <h3 className="feature-card-title">component selection</h3>
              <p className="feature-card-description">
                visually select any react component. understand props, state, and hierarchy.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card-icon">💬</div>
              <h3 className="feature-card-title">multi-model ai</h3>
              <p className="feature-card-description">
                use claude 3.5, gpt-4o, gemini 2.0, or 100+ models via openrouter.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card-icon">✏️</div>
              <h3 className="feature-card-title">live editing</h3>
              <p className="feature-card-description">
                make changes directly through chat. see updates instantly in dev mode.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="content-section">
          <h2>popular topics</h2>
          
          <div className="row">
            <div className="column">
              <h3>getting started</h3>
              <ul>
                <li><Link href="/docs/getting-started/quick-start">5-minute quickstart</Link></li>
                <li><Link href="/docs/installation/script-tag">script tag setup</Link></li>
                <li><Link href="/docs/installation/npm">npm installation</Link></li>
                <li><Link href="/docs/configuration/api-keys">api key setup</Link></li>
              </ul>
            </div>
            
            <div className="column">
              <h3>features</h3>
              <ul>
                <li><Link href="/docs/features/component-selection">component selection</Link></li>
                <li><Link href="/docs/features/ai-chat">ai chat interface</Link></li>
                <li><Link href="/docs/features/live-editing">live code editing</Link></li>
                <li><Link href="/docs/features/multi-model">model switching</Link></li>
              </ul>
            </div>
            
            <div className="column">
              <h3>advanced</h3>
              <ul>
                <li><Link href="/docs/guides/development-mode">development workflow</Link></li>
                <li><Link href="/docs/guides/production-mode">production safety</Link></li>
                <li><Link href="/docs/api/configuration">configuration api</Link></li>
                <li><Link href="/docs/api/methods">methods reference</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>
          reactlm is open source. <Link href="https://github.com/reactlm/reactlm">contribute on github</Link>.
        </p>
      </footer>
    </main>
  );
}