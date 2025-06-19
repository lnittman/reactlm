# Agent 6: CI/CD & Testing Infrastructure

## Mission
Establish comprehensive CI/CD pipelines and testing infrastructure for the React LLM monorepo. Set up automated testing, building, publishing, and deployment workflows that ensure quality and enable reliable releases.

## Current State Analysis

### ✅ What Exists
- **Monorepo Structure**: Proper workspace configuration with Turbo
- **Build Scripts**: Individual packages have build configurations
- **Package Manifests**: All packages have proper package.json files
- **Development Tools**: Biome for linting/formatting, TypeScript for type checking

### ❌ What's Missing
- **Testing Framework**: No tests exist anywhere in the codebase
- **CI/CD Pipelines**: No GitHub Actions workflows
- **Quality Gates**: No automated quality checks
- **Publishing Automation**: Manual release process
- **Environment Management**: No staging/preview environments

## Infrastructure Design

### 1. Testing Strategy

#### Testing Stack
```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0", 
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^25.0.0",
    "playwright": "^1.48.0",
    "@playwright/test": "^1.48.0"
  }
}
```

#### Test Categories

**Unit Tests (`packages/react-llm/src/**/*.test.ts`)**
```typescript
// packages/react-llm/src/llm/openrouter.test.ts
import { describe, it, expect, vi } from 'vitest';
import { OpenRouterClient } from './openrouter';

describe('OpenRouterClient', () => {
  it('should fetch available models', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        data: [
          { id: 'openai/gpt-4o', name: 'GPT-4o' }
        ]
      })
    });
    global.fetch = mockFetch;
    
    const client = new OpenRouterClient({ apiKey: 'test' });
    const models = await client.getAvailableModels();
    
    expect(models).toHaveLength(1);
    expect(models[0].id).toBe('openai/gpt-4o');
  });
});
```

**Integration Tests (`packages/react-llm/tests/integration/**`)**
```typescript
// packages/react-llm/tests/integration/component-selection.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentSelector } from '../src/components/ComponentSelector';

describe('Component Selection Integration', () => {
  it('should highlight component on hover and select on click', async () => {
    const onSelect = vi.fn();
    render(<ComponentSelector onSelect={onSelect} />);
    
    // Test visual selection workflow
    const button = screen.getByRole('button', { name: /select component/i });
    fireEvent.click(button);
    
    expect(screen.getByText(/selecting/i)).toBeInTheDocument();
  });
});
```

**E2E Tests (`tests/e2e/playwright.config.ts`)**
```typescript
// tests/e2e/react-llm.spec.ts
import { test, expect } from '@playwright/test';

test('complete React LLM workflow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Load React LLM script
  await page.addScriptTag({
    url: 'http://localhost:3001/react-llm.js'
  });
  
  // Initialize with test API key
  await page.evaluate(() => {
    window.ReactLLM.init({
      providers: { openrouter: 'test-key' },
      mode: 'demo'
    });
  });
  
  // Test component selection
  await page.click('[data-testid="component-selector"]');
  await page.click('.some-react-component');
  
  // Verify component is selected
  await expect(page.locator('[data-testid="selected-component"]')).toBeVisible();
  
  // Test AI chat
  await page.fill('[data-testid="chat-input"]', 'Change this button to red');
  await page.click('[data-testid="send-button"]');
  
  // Verify AI response
  await expect(page.locator('[data-testid="ai-response"]')).toContainText('button');
});
```

### 2. CI/CD Pipeline Architecture

#### GitHub Actions Workflows

**1. Quality Checks (`.github/workflows/ci.yml`)**
```yaml
name: Quality Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type checking
        run: pnpm typecheck
        
      - name: Linting
        run: pnpm lint
        
      - name: Unit tests
        run: pnpm test:unit
        
      - name: Build packages
        run: pnpm build
        
      - name: Integration tests
        run: pnpm test:integration
        
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Install Playwright
        run: pnpm exec playwright install
        
      - name: Build for E2E
        run: pnpm build
        
      - name: Start test servers
        run: |
          pnpm --filter @react-llm/web dev &
          pnpm --filter react-llm dev &
          
      - name: Wait for servers
        run: pnpm wait-on http://localhost:3000 http://localhost:3001
        
      - name: Run E2E tests
        run: pnpm test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

**2. Release Pipeline (`.github/workflows/release.yml`)**
```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          registry-url: 'https://registry.npmjs.org'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build packages
        run: pnpm build
        
      - name: Run tests
        run: pnpm test
        
      - name: Create Release PR or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version
          commit: 'chore: release packages'
          title: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          
      - name: Upload to CDN
        if: steps.changesets.outputs.published == 'true'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: pnpm upload-cdn
        
      - name: Deploy Documentation
        if: steps.changesets.outputs.published == 'true'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          pnpm --filter @react-llm/docs build
          pnpm dlx vercel --prod --token $VERCEL_TOKEN
```

**3. Preview Deployments (`.github/workflows/preview.yml`)**
```yaml
name: Preview Deployments

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        
      - name: Install and build
        run: |
          pnpm install --frozen-lockfile
          pnpm build
          
      - name: Deploy preview
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          # Deploy marketing site preview
          pnpm --filter @react-llm/web dlx vercel --token $VERCEL_TOKEN
          
          # Deploy docs preview  
          pnpm --filter @react-llm/docs dlx vercel --token $VERCEL_TOKEN
          
          # Upload CDN assets to staging
          pnpm upload-cdn --env staging
```

### 3. Package Configuration

#### Changesets for Version Management
```json
// .changeset/config.json
{
  "changelog": "@changesets/changelog-github",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@react-llm/web", "@react-llm/docs"]
}
```

#### Test Scripts Configuration
```json
// package.json (root)
{
  "scripts": {
    "test": "turbo run test",
    "test:unit": "turbo run test:unit",
    "test:integration": "turbo run test:integration", 
    "test:e2e": "playwright test",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Package-Level Testing
```json
// packages/react-llm/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run src/**/*.test.ts",
    "test:integration": "vitest run tests/integration/**/*.test.ts",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### 4. Quality Gates & Standards

#### Required Checks for PR Merge
- [ ] **Type Safety**: TypeScript compilation without errors
- [ ] **Code Quality**: Biome linting and formatting
- [ ] **Unit Tests**: 80%+ coverage on new code
- [ ] **Integration Tests**: All critical user flows pass
- [ ] **Build Success**: All packages build without errors
- [ ] **Bundle Size**: No unexpected size increases

#### Automated Quality Checks
```typescript
// scripts/quality-check.ts
export async function runQualityChecks() {
  const results = await Promise.all([
    checkTypeScript(),
    checkLinting(),
    runUnitTests(),
    checkBundleSize(),
    verifyAPICompatibility()
  ]);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.error('Quality checks failed:', failed);
    process.exit(1);
  }
}
```

### 5. Environment Management

#### Development Environments
- **Local Development**: Full React LLM with hot reload
- **Staging**: Production build with test API keys
- **Preview**: PR-based deployments for review

#### Production Environments
- **CDN**: React LLM script hosted on AWS CloudFront
- **NPM**: Published packages for installation
- **Documentation**: Live docs site with search

## Implementation Plan

### Week 1: Testing Foundation
- [ ] **Vitest Setup**: Configure testing framework for all packages
- [ ] **Unit Tests**: Write tests for core LLM functionality
- [ ] **Testing Utilities**: Create test helpers and mocks
- [ ] **Coverage Reports**: Set up coverage collection and reporting

### Week 2: CI/CD Pipeline
- [ ] **GitHub Actions**: Create quality check workflow
- [ ] **Release Automation**: Set up Changesets and publishing
- [ ] **Environment Setup**: Configure staging and preview deployments
- [ ] **Security**: Set up secrets and access controls

### Week 3: Integration & E2E Testing
- [ ] **Playwright Setup**: Configure E2E testing framework
- [ ] **Critical User Flows**: Test complete React LLM workflows
- [ ] **Browser Testing**: Multi-browser compatibility testing
- [ ] **Performance Testing**: Bundle size and runtime performance

### Week 4: Quality & Monitoring
- [ ] **Quality Gates**: Enforce testing and coverage requirements
- [ ] **Monitoring**: Set up error tracking and performance monitoring
- [ ] **Documentation**: Document CI/CD processes and troubleshooting
- [ ] **Team Training**: Onboard team on new processes

## Success Metrics

### Reliability Metrics
- [ ] **Test Coverage**: 80%+ unit test coverage
- [ ] **Build Success Rate**: 95%+ successful CI runs
- [ ] **Deployment Success**: 99%+ successful releases
- [ ] **Performance**: <5min CI pipeline duration

### Quality Metrics
- [ ] **Bug Escape Rate**: <5% bugs reaching production
- [ ] **Security Scanning**: Zero high-severity vulnerabilities
- [ ] **Dependency Health**: All dependencies up-to-date
- [ ] **Code Quality**: Consistent linting and formatting

### Developer Experience
- [ ] **Feedback Speed**: <10min from push to CI results
- [ ] **Preview Deployments**: Every PR gets preview URL
- [ ] **Easy Debugging**: Clear error messages and logs
- [ ] **Automated Releases**: Zero-effort publishing process