import React from 'react'
import Link from 'next/link'
import { Github, Twitter, MessageSquare } from 'lucide-react'

export function Footer() {
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Demo', href: '/demo' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Pricing', href: '/pricing' },
    ],
    resources: [
      { name: 'Quick Start', href: '/docs' },
      { name: 'API Reference', href: '/docs/api' },
      { name: 'Examples', href: '/docs/examples' },
      { name: 'Changelog', href: '/changelog' },
    ],
    support: [
      { name: 'GitHub Discussions', href: 'https://github.com/react-llm/react-llm/discussions' },
      { name: 'Discord Community', href: 'https://discord.gg/react-llm' },
      { name: 'Bug Reports', href: 'https://github.com/react-llm/react-llm/issues' },
      { name: 'Feature Requests', href: 'https://github.com/react-llm/react-llm/discussions/categories/ideas' },
    ],
    social: [
      {
        name: 'GitHub',
        href: 'https://github.com/react-llm/react-llm',
        icon: Github,
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/reactllm',
        icon: Twitter,
      },
      {
        name: 'Discord',
        href: 'https://discord.gg/react-llm',
        icon: MessageSquare,
      },
    ],
  }

  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl text-white">React LLM</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Browser-native AI coding assistant that lets you chat with your components and make live edits instantly.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            © 2024 React LLM. Open source under MIT License.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}