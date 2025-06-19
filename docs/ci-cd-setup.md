# CI/CD & Testing Infrastructure

This document describes the comprehensive CI/CD and testing infrastructure set up for the React LLM monorepo.

## Overview

The project uses a multi-layered testing and automation approach:

- **Unit Tests**: Individual component and function testing with Vitest
- **Integration Tests**: Full workflow testing with real component interactions
- **E2E Tests**: Browser-based testing with Playwright across multiple browsers
- **Quality Gates**: Automated linting, type checking, and security scanning
- **Automated Releases**: Version management with Changesets and automated publishing

## Testing Framework

### Vitest Configuration

The project uses Vitest as the primary testing framework with:

- **Test Environment**: `happy-dom` for lightweight DOM simulation
- **Coverage**: 80%+ requirement with V8 provider
- **Setup**: Global test utilities and mocks in `test-setup.ts`
- **TypeScript**: Full TypeScript support with source maps

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Test Categories

#### 1. Unit Tests (`src/**/*.test.ts`)
- Individual component testing
- Function-level logic validation
- Mock-based isolation testing
- Fast execution (< 1s per test)

#### 2. Integration Tests (`tests/integration/**/*.test.ts`)
- Component interaction testing
- Database integration testing
- LLM provider integration testing
- Real workflow validation

#### 3. E2E Tests (`tests/e2e/**/*.spec.ts`)
- Browser-based testing with Playwright
- Multi-browser support (Chrome, Firefox, Safari)
- Mobile device testing
- Complete user journey validation

### Test Utilities

**Location**: `packages/react-llm/tests/test-utils.tsx`

Provides:
- Custom render functions with providers
- Mock data factories
- Component mocks
- API mocks (OpenRouter, Gemini)
- Browser API mocks (File System, OPFS, Canvas)

```typescript
// Example usage
import { renderWithProviders, createMockChatSession } from '../tests/test-utils'

const mockSession = createMockChatSession({ title: 'Test Chat' })
renderWithProviders(<Toolbar />)
```

## GitHub Actions Workflows

### 1. Quality Checks (`.github/workflows/ci.yml`)

Triggered on: Push to `main`/`develop`, PRs to `main`

**Jobs**:
- **Quality**: Type checking, linting, unit tests, build verification
- **Integration**: Integration test execution
- **E2E**: Browser testing across multiple environments
- **Bundle Analysis**: Size monitoring and reporting
- **Security**: Vulnerability scanning and CodeQL analysis

**Duration**: ~10 minutes
**Parallel Execution**: Yes (quality checks run in parallel)

### 2. Release Pipeline (`.github/workflows/release.yml`)

Triggered on: Push to `main` (after PR merge)

**Steps**:
1. Run full test suite
2. Build all packages
3. Create release PR with Changesets (if changes exist)
4. Publish to NPM (if release PR is merged)
5. Upload CDN assets to AWS
6. Deploy documentation to Vercel
7. Send notifications

### 3. Preview Deployments (`.github/workflows/preview.yml`)

Triggered on: Pull requests to `main`

**Features**:
- Deploy marketing site preview
- Deploy documentation preview
- Upload staging CDN assets
- Comment PR with preview links
- Run Lighthouse performance audits

## Version Management

### Changesets Configuration

**Location**: `.changeset/config.json`

- **Changelog**: GitHub-based changelog generation
- **Access**: Public NPM publishing
- **Ignored Packages**: Apps (web, docs) are not published
- **Base Branch**: `main`

### Release Process

1. **Development**: Create PR with changes
2. **Changeset**: Add changeset describing changes:
   ```bash
   pnpm changeset
   ```
3. **PR Review**: Standard code review process
4. **Merge**: Merge PR to main triggers release workflow
5. **Release PR**: Changesets creates release PR automatically
6. **Publish**: Merge release PR triggers NPM publish and CDN upload

## Quality Gates

### Required Checks

All PRs must pass:

- ✅ **Type Safety**: TypeScript compilation without errors
- ✅ **Code Quality**: Biome linting and formatting
- ✅ **Unit Tests**: 80%+ coverage on new code
- ✅ **Integration Tests**: All critical user flows pass
- ✅ **Build Success**: All packages build without errors
- ✅ **Bundle Size**: No unexpected size increases (500KB limit)
- ✅ **Security**: No high-severity vulnerabilities

### Performance Monitoring

- **Bundle Analysis**: Automatic size monitoring
- **Lighthouse Audits**: Performance scoring on preview deployments
- **Coverage Tracking**: Codecov integration for coverage trends

## Environment Management

### Development
- Local testing with hot reload
- Mock API responses for LLM providers
- SQLite in-memory database
- File system mocking

### Staging (PR Previews)
- Deployed preview environments
- Staging CDN assets
- Test API keys
- Performance monitoring

### Production
- NPM package publishing
- CDN asset deployment (AWS CloudFront)
- Production documentation site
- Release notifications

## Commands

### Development

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### CI/CD

```bash
# Create changeset
pnpm changeset

# Version packages (automatic)
pnpm version

# Release packages (automatic)
pnpm release

# Upload to CDN (automatic)
pnpm upload-cdn
```

## Monitoring & Debugging

### Test Results
- **GitHub Actions**: View detailed test reports in Actions tab
- **Playwright Reports**: HTML reports uploaded as artifacts on failures
- **Coverage Reports**: Codecov integration for coverage tracking

### Performance
- **Bundle Size**: Tracked in PR comments
- **Lighthouse Scores**: Performance audits on preview deployments
- **Build Times**: Monitored in GitHub Actions

### Errors
- **Test Failures**: Detailed error reporting in GitHub Actions
- **Security Issues**: CodeQL analysis results
- **Dependency Vulnerabilities**: NPM audit results

## Troubleshooting

### Common Issues

**Tests Failing Locally**:
```bash
# Clear cache and reinstall
pnpm clean
pnpm install

# Check test configuration
pnpm test --reporter=verbose
```

**Build Failures**:
```bash
# Type check all packages
pnpm typecheck

# Lint and fix issues
pnpm lint --fix
```

**E2E Test Issues**:
```bash
# Install Playwright browsers
pnpm exec playwright install

# Run in headed mode for debugging
pnpm exec playwright test --headed
```

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Review test reports and coverage data
3. Use local debugging tools (Vitest UI, Playwright trace viewer)
4. Consult the troubleshooting section in individual test files

## Success Metrics

Current targets:
- ✅ **95%+ CI build success rate**
- ✅ **<10min pipeline duration**
- ✅ **80%+ test coverage**
- ✅ **Zero-effort releases**
- ✅ **Automated quality gates**

The infrastructure is designed to support rapid development while maintaining high quality standards and reliable releases.