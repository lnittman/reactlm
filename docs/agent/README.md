# React LLM Agent Documentation

This directory contains task-specific agent documentation for parallel development of React LLM.

## Structure

### Core (`/core/`)
Core library development, architecture, and technical implementation:
- `AGENT_2_CORE.md` - Main core library development (bippy, OpenRouter, file system)
- `AGENT_4_CONSOLIDATION.md` - Clean up src/ duplication and finalize package structure
- `AGENT_5_TESTING.md` - Testing infrastructure and quality assurance

### Launch (`/launch/`)
Release preparation, distribution, and deployment:
- `AGENT_3_LAUNCH.md` - Main launch strategy (GitHub, npm, CDN)
- `AGENT_6_CI_CD.md` - Continuous integration and deployment pipelines
- `AGENT_7_MONITORING.md` - Analytics, error tracking, and performance monitoring

### Marketing (`/marketing/`)
Website, documentation, and community building:
- `AGENT_1_MARKETING.md` - Main marketing website and documentation
- `AGENT_8_DOCS.md` - Complete documentation site with Fumadocs
- `AGENT_9_COMMUNITY.md` - Discord, GitHub community, and developer relations

## Execution Strategy

Each agent can work independently on their domain, with clear handoff points:

1. **Phase 1 (Week 1)**: Foundation
   - Core: Library architecture and OpenRouter integration
   - Marketing: Website foundation and hero demo
   - Launch: Repository setup and package configuration

2. **Phase 2 (Week 2)**: Implementation  
   - Core: Component selection and file system integration
   - Marketing: Documentation site and interactive examples
   - Launch: CI/CD pipelines and testing infrastructure

3. **Phase 3 (Week 3)**: Integration
   - Core: Testing and performance optimization
   - Marketing: Content creation and SEO optimization
   - Launch: Security audit and release preparation

4. **Phase 4 (Week 4)**: Launch
   - All agents coordinate final testing and launch

## Dependencies

- Core agents should complete before Launch agents finalize packages
- Marketing website depends on Core demos being functional
- Documentation agents need Core API to be stable
- All agents feed into final Launch coordination