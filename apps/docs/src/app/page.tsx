import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Code2, Rocket, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            React LLM
            <span className="block text-3xl md:text-5xl font-normal text-muted-foreground mt-2">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete guide to using React LLM - the browser-native AI coding assistant 
            that lets you chat with your React components and code directly in the browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/docs">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/api">
                API Reference
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything you need to know</h2>
          <p className="text-muted-foreground text-lg">
            From quick setup to advanced usage patterns
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Rocket className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Get React LLM running in 30 seconds with a single script tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" asChild className="p-0 h-auto font-normal">
                <Link href="/docs">
                  Start here →
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Installation</CardTitle>
              <CardDescription>
                Multiple ways to integrate: script tag, npm, Next.js, Vite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" asChild className="p-0 h-auto font-normal">
                <Link href="/docs/installation">
                  Installation guides →
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Component selection, multi-model AI, live editing, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" asChild className="p-0 h-auto font-normal">
                <Link href="/docs/features">
                  Explore features →
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Complete TypeScript definitions and interactive examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" asChild className="p-0 h-auto font-normal">
                <Link href="/docs/api">
                  API docs →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Example */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              30-Second Setup
            </h2>
            <div className="bg-card border rounded-lg p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`<!-- Add to any HTML page -->
<script src="https://unpkg.com/react-llm/dist/react-llm.js"></script>
<script>
  ReactLLM.init({
    providers: {
      openrouter: 'sk-or-...' // Your OpenRouter API key
    }
  });
</script>`}</code>
              </pre>
            </div>
            <p className="text-center text-muted-foreground mt-4">
              That's it! React LLM will appear as a floating chat interface on your page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}