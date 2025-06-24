# Release Process

This document outlines the release process for React LLM packages.

## Overview

React LLM uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases. The process is fully automated through GitHub Actions.

## Release Workflow

### 1. Making Changes

When you make changes that should be released:

```bash
# After making your changes
pnpm changeset
```

This will prompt you to:
- Select which packages have changed
- Select the bump type (major, minor, patch)
- Write a summary of the changes

### 2. Automated Release Process

When changes with changesets are merged to `main`:

1. **Changeset Bot** creates/updates a "Version Packages" PR
2. This PR accumulates all pending changesets
3. When merged, it triggers the release workflow

### 3. Release Workflow Steps

The automated release workflow performs:

1. **Build & Test**
   - Builds all packages
   - Runs full test suite
   - Validates bundle sizes

2. **NPM Publishing**
   - Publishes to NPM with provenance
   - Updates package versions
   - Generates changelogs

3. **GitHub Release**
   - Creates GitHub releases with assets
   - Uploads distribution files
   - Generates release notes

4. **CDN Distribution**
   - Files automatically available on unpkg/jsdelivr
   - Generates SRI hashes for security
   - Creates CDN usage examples

5. **Documentation**
   - Deploys updated docs to production
   - Updates API documentation
   - Refreshes search indexes

6. **Notifications**
   - Discord/Slack webhooks (if configured)
   - GitHub issue for announcement
   - Team notifications

## Manual Release (Emergency Only)

If you need to manually release:

```bash
# Ensure you're on main and up to date
git checkout main
git pull

# Build and test
pnpm build
pnpm test

# Create versions
pnpm version

# Publish to NPM
pnpm release
```

## Version Guidelines

### Patch Release (0.0.x)
- Bug fixes
- Performance improvements
- Documentation updates
- Dependency updates (non-breaking)

### Minor Release (0.x.0)
- New features
- New APIs (backward compatible)
- Deprecations
- Minor breaking changes with migration path

### Major Release (x.0.0)
- Breaking API changes
- Major architectural changes
- Removal of deprecated features
- Incompatible dependency updates

## Pre-release Versions

For testing releases:

```bash
# Create a pre-release changeset
pnpm changeset pre enter beta

# Make changes and add changesets as normal
pnpm changeset

# When ready to publish beta
pnpm version
pnpm release

# Exit pre-release mode
pnpm changeset pre exit
```

## Release Checklist

Before releasing, ensure:

- [ ] All tests pass
- [ ] No linting errors
- [ ] Bundle size is acceptable
- [ ] Documentation is updated
- [ ] CHANGELOG reflects changes
- [ ] Version bump is appropriate
- [ ] Breaking changes are documented

## Troubleshooting

### Release Failed

1. Check GitHub Actions logs
2. Ensure NPM_TOKEN is valid
3. Verify package.json is correct
4. Check for npm audit issues

### CDN Not Updated

- unpkg/jsdelivr cache can take up to 10 minutes
- Force refresh: `https://purge.jsdelivr.net/npm/react-llm@latest`

### Documentation Not Deployed

1. Check Vercel deployment logs
2. Ensure VERCEL_TOKEN is set
3. Verify build succeeds locally

## Configuration

### Required Secrets

Set these in GitHub repository settings:

- `NPM_TOKEN`: NPM automation token
- `CODECOV_TOKEN`: Code coverage reporting
- `VERCEL_TOKEN`: Documentation deployment
- `DISCORD_WEBHOOK_URL`: Release notifications (optional)
- `SLACK_WEBHOOK_URL`: Release notifications (optional)

### Optional Configurations

- `CLOUDFLARE_API_TOKEN`: CDN cache purging
- `ALGOLIA_CRAWLER_API_KEY`: Search index updates
- `SNYK_TOKEN`: Security scanning

## Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Every 2-4 weeks with new features
- **Major releases**: Planned quarterly or as needed

## Support

For release issues:
1. Check existing GitHub issues
2. Review workflow logs
3. Contact maintainers in Discord