import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  children?: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="navigation-inner">
        <Link href="/" className="navigation-logo">
          react llm
        </Link>
        
        <section className="navigation-content">
          {children}
        </section>
        
        <section className="navigation-links">
          <Link href="/docs" className="navigation-link">
            docs
          </Link>
          <Link href="/demo" className="navigation-link">
            demo
          </Link>
          <Link href="https://github.com/react-llm/react-llm" className="navigation-link" target="_blank">
            github
          </Link>
        </section>
      </div>
    </nav>
  );
}