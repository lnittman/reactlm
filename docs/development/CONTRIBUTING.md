# Contributing to React LLM

Thank you for your interest in contributing to React LLM! This guide will help you get started with contributing to the project.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/react-llm.git
   cd react-llm
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b my-feature-branch
   ```

## 📁 Project Structure

This is a monorepo managed with pnpm workspaces:

```
react-llm/
├── packages/
│   ├── react-llm/         # Core library
│   ├── next/              # Next.js plugin
│   ├── vite/              # Vite plugin
│   └── browser-extension/ # Browser extension
├── apps/
│   └── demo/              # Demo applications
├── .changeset/            # Changesets for versioning
└── docs/                  # Documentation
```

## 🛠️ Development

### Running the Development Server

```bash
# Start development for all packages
pnpm dev

# Start development for a specific package
pnpm --filter react-llm dev
```

### Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter react-llm build
```

### Code Quality

We use several tools to maintain code quality:

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## 📝 Making Changes

### 1. Create a Changeset

When you make changes that should be published, create a changeset:

```bash
pnpm changeset
```

This will prompt you to:
- Select which packages are affected
- Choose the type of change (major, minor, patch)
- Write a summary of your changes

### 2. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 3. Push and Create a Pull Request

```bash
git push origin my-feature-branch
```

Then create a pull request on GitHub.

## 🧪 Testing

We encourage adding tests for new features:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## 📚 Documentation

Documentation improvements are always welcome! You can update:

- **API documentation** in the source code (JSDoc comments)
- **README files** in individual packages
- **Examples** in the `apps/` directory

## 🐛 Reporting Issues

Please use our [issue templates](.github/ISSUE_TEMPLATE/) when reporting bugs or requesting features.

### Bug Reports

Include:
- React LLM version
- Browser and OS
- Steps to reproduce
- Expected vs actual behavior
- Code examples (if applicable)

### Feature Requests

Include:
- Clear description of the problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Examples of how it would be used

## 🎯 Areas We Need Help With

- **Testing**: Writing unit and integration tests
- **Documentation**: Improving guides and examples
- **Browser compatibility**: Testing across different browsers
- **Performance**: Optimizing bundle size and runtime performance
- **Accessibility**: Ensuring the UI is accessible
- **Internationalization**: Adding support for multiple languages

## 🔧 Package-Specific Guidelines

### Core Library (`packages/react-llm`)

- Focus on browser compatibility and performance
- Keep bundle size minimal
- Use TypeScript for type safety
- Follow the existing architecture patterns

### Framework Plugins (`packages/next`, `packages/vite`)

- Ensure compatibility with the latest framework versions
- Keep plugin APIs simple and intuitive
- Document configuration options thoroughly

### Browser Extension (`packages/browser-extension`)

- Follow manifest v3 guidelines
- Ensure permission requests are minimal
- Test across Chrome, Firefox, and Edge

## 📋 Pull Request Process

1. **Fork and branch** from `main`
2. **Make your changes** following our guidelines
3. **Add tests** if applicable
4. **Add a changeset** for publishable changes
5. **Update documentation** if needed
6. **Ensure all checks pass**:
   - Linting
   - Type checking
   - Tests
   - Build process
7. **Create a pull request** with a clear description

### Pull Request Template

Your PR should include:
- **Description** of changes
- **Type of change** (bug fix, feature, etc.)
- **Testing** information
- **Changeset** (if applicable)
- **Screenshots** (for UI changes)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and constructive in discussions
- Help others learn and grow
- Focus on the technical merits of contributions
- Assume positive intent

## 📞 Getting Help

If you need help or have questions:

- **Discord**: Join our [Discord community](https://discord.gg/react-llm)
- **GitHub Discussions**: Use [GitHub Discussions](https://github.com/your-org/react-llm/discussions)
- **Issues**: Create an issue for bugs or feature requests

## 🎉 Recognition

Contributors who make significant contributions will be:
- Added to the contributors list
- Mentioned in release notes
- Invited to join the core team (for ongoing contributors)

Thank you for contributing to React LLM! 🚀