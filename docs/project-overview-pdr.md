# Project Overview & Product Development Requirements (PDR)

## Project Definition

**Project Name:** Locado
**Project Motto:** Local Domain Manager - Beautiful domains for local development
**Type:** Open-source development utility
**License:** Proprietary

## Problem Statement

Developers working locally need:
- Easy mapping of custom domains to local services
- Automatic HTTPS without external proxies (Caddy/Nginx)
- Cross-platform DNS support (macOS, Linux, Windows)
- Simplified domain management through beautiful UI
- Support for multiple targets: localhost, Docker, remote hosts

**Current Solutions:** Complex setup with Caddy/Nginx, manual hosts file editing, missing HTTPS automation.

## Solution Overview

Locado provides:
- **Zero-config DNS:** Automatic .local domain resolution
- **Built-in HTTPS:** Self-signed CA, one-click trust
- **Unified Dashboard:** Web UI for domain management
- **Docker Integration:** Auto-detect containers
- **Cross-platform:** macOS (dnsmasq), Linux (systemd-resolved), Windows (Acrylic)
- **Multiple TLDs:** Support for .local, .test, .dev, custom TLDs (up to 10)

## Vision & Roadmap

### Phase 1: Foundation & Localization (In Progress)
**Status:** Partial Complete

**Completed:**
- English homepage (en.json, index.astro)
- Vietnamese homepage (vi.json, vi.astro)
- Russian translation file (ru.json) ✓ Phase 1
- Chinese Simplified translation file (zh.json) ✓ Phase 1
- Korean translation file (ko.json) ✓ Phase 1
- Japanese translation file (ja.json) ✓ Phase 1

**Pending (Phase 1 Completion):**
- Page routes for new languages (/ru, /zh, /ko, /ja)
- Navigation updated to show all 6 languages
- Browser testing for all language variants

### Phase 2: Enhancement & Expansion (Q1 2026)
- Full CLI implementation
- Dashboard backend
- Domain CRUD operations
- Docker integration
- Service auto-start (LaunchD/systemd)

### Phase 3: Advanced Features (Q2 2026)
- Remote host support
- Multiple TLD configuration
- Certificate management UI
- Advanced DNS configuration
- User preferences/settings

### Phase 4: Ecosystem (Q3 2026)
- Plugin system
- Community translations
- Third-party integrations
- Package repositories
- Documentation hub

## Functional Requirements

### FR-1: Multilingual Support
**Requirement:** Support multiple languages for global accessibility
**Languages Supported:**
- English (en) ✓
- Vietnamese (vi) ✓
- Russian (ru) ✓ Phase 1
- Chinese Simplified (zh) ✓ Phase 1
- Korean (ko) ✓ Phase 1
- Japanese (ja) ✓ Phase 1
- *Future:* German, Spanish, French, Portuguese, Italian, etc.

**Sub-requirements:**
- FR-1.1: Consistent translation structure across all languages
- FR-1.2: Proper HTML lang attributes for SEO/accessibility
- FR-1.3: Easy switching between languages
- FR-1.4: No hardcoded strings in components

**Acceptance Criteria:**
- All translation files valid JSON with identical schema
- All page routes properly set HTML lang attribute
- Navigation provides language switcher
- No console errors when switching languages

### FR-2: Responsive Web Interface
**Requirement:** Beautiful, responsive UI for all devices
**Acceptance Criteria:**
- Works on mobile, tablet, desktop
- Proper color scheme and typography
- Smooth animations (hero typing effect)
- Fast load times

### FR-3: Installation & Quick Start
**Requirement:** Clear, easy installation process
**Sub-requirements:**
- FR-3.1: One-liner install command
- FR-3.2: Auto-detect system (macOS/Linux/Windows)
- FR-3.3: Clear documentation for each platform
- FR-3.4: Troubleshooting guides

### FR-4: Domain Management
**Requirement:** CRUD operations for domains
**Sub-requirements:**
- FR-4.1: Add domain with target (localhost:port, docker, remote)
- FR-4.2: List all active domains
- FR-4.3: Remove domain
- FR-4.4: Update domain target

**Status:** Planned for Phase 2

### FR-5: Dashboard
**Requirement:** Web-based domain management UI
**Sub-requirements:**
- FR-5.1: Domain list with status
- FR-5.2: Add/edit/delete domain forms
- FR-5.3: Service status indicator
- FR-5.4: Certificate trust status

**Status:** Planned for Phase 2

## Non-Functional Requirements

### NFR-1: Performance
**Requirement:** Fast load times and responsive UI
**Target:**
- Page load < 2 seconds
- Time to Interactive < 1 second
- No layout shifts

**Implementation:**
- Static site generation (no server rendering)
- Minimal JavaScript
- CSS optimization with Tailwind

### NFR-2: Security
**Requirement:** Secure domain management and HTTPS
**Measures:**
- Self-signed CA for HTTPS
- Local-only DNS resolution
- No external dependencies for proxy
- Source code integrity via git

**Status:** Foundation in place, enhanced in Phase 2

### NFR-3: Accessibility
**Requirement:** WCAG 2.1 AA compliance minimum
**Measures:**
- Proper HTML lang attributes
- Semantic HTML structure
- Keyboard navigation
- Color contrast ratios

### NFR-4: Maintainability
**Requirement:** Clean, modular codebase
**Measures:**
- TypeScript for type safety
- Component-based architecture
- Consistent code standards
- Comprehensive documentation

### NFR-5: Scalability
**Requirement:** Support for multiple domains and users
**Target:**
- Manage up to 100+ domains
- Handle multiple concurrent connections
- Support clustering for remote deployment

**Status:** Planned for Phase 2-3

## Technical Specifications

### Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Astro | 4.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Package Manager | npm | Latest |
| Build Tool | Astro CLI | 4.x |

### Architecture

**Frontend:** Static site with Astro
- Pages: index.astro (en), vi.astro (vi), ru.astro (pending), etc.
- Components: Navbar, Hero, Features, Install, FAQ, Footer
- Layouts: Layout.astro (base HTML template)
- Styling: Tailwind CSS with global styles

**Translation System:**
- Translation files: src/i18n/{lang}.json
- Flat-key structure for simplicity
- Type-safe import pattern

**Backend (Phase 2+):**
- API server (TBD - Go/Node.js)
- Domain database
- DNS configuration
- Certificate management

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Model

### Translation Schema (Phase 1)

```
Translation {
  meta: {
    title: string
    description: string
  }
  nav: {
    features: string
    install: string
    docs: string
    faq: string
  }
  hero: {
    title: string
    typingTexts: string[]
    installBtn: string
    docsBtn: string
  }
  features: {
    title: string
    items: Feature[]
  }
  install: {
    title: string
    subtitle: string
    copyBtn: string
    copiedBtn: string
    commands: Commands
  }
  faq: {
    title: string
    items: FAQItem[]
  }
  changelog: {
    title: string
  }
  footer: {
    madeBy: string
    by: string
    author: string
    links: Links
  }
}
```

### Domain Schema (Phase 2+)

```
Domain {
  id: UUID
  name: string          # e.g., "myapp.local"
  target: string        # e.g., "localhost:3000"
  targetType: enum      # "localhost" | "docker" | "remote"
  tld: string          # e.g., ".local"
  protocol: enum       # "http" | "https"
  status: enum         # "active" | "inactive"
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Success Metrics

### Phase 1 (i18n Localization)

- [ ] All 6 languages have translation files (ru, zh, ko, ja complete)
- [ ] All translation files have identical schema
- [ ] Page routes created for all languages
- [ ] Navbar shows language switcher
- [ ] HTML lang attribute correct for each page
- [ ] No console errors in any language variant
- [ ] SEO-friendly URLs for each language

**Target Completion:** End of January 2026

### Phase 2 (CLI & Backend)

- [ ] CLI tool fully functional
- [ ] Domain CRUD operations working
- [ ] Dashboard accessible and usable
- [ ] Docker integration auto-discovering containers
- [ ] Service auto-start on all platforms
- [ ] HTTPS certificates auto-generated and trusted

### Overall Project Goals

1. **Adoption:** 1000+ developers using Locado within 6 months
2. **Quality:** 95% uptime, zero critical security issues
3. **Documentation:** Comprehensive guides for all supported platforms
4. **Community:** Active GitHub community with regular updates
5. **Localization:** Support 10+ languages by Q4 2026

## Constraints & Dependencies

### Technical Constraints
- Must work on macOS 10.15+, modern Linux, Windows 10+
- Ports 80/443 must be available
- Root/admin privileges required for DNS/HTTPS setup
- Limited to local development environment scope

### Business Constraints
- Open-source with proprietary source code
- Single maintainer (Hồ Xuân Dũng)
- Limited resources for third-party integrations
- Community-driven feature requests

### Dependencies
- OS-level DNS resolution services (dnsmasq, systemd-resolved, Acrylic)
- Certificate authority libraries
- Container runtime for Docker support (optional)

## Risks & Mitigation

### Risk 1: Translation Quality
**Risk:** Inconsistent or poor translations affecting user experience
**Mitigation:**
- Standardized JSON schema ensures completeness
- Community review for each language
- Automated validation scripts

### Risk 2: Platform-Specific Issues
**Risk:** Features working on some OS but not others
**Mitigation:**
- Comprehensive testing on each platform
- Clear documentation of platform requirements
- Fallback mechanisms (hosts file DNS)

### Risk 3: Security Vulnerabilities
**Risk:** HTTPS/DNS misconfiguration exposing local network
**Mitigation:**
- Security audit of certificate generation
- Restricted scope to localhost only
- Regular security updates

### Risk 4: User Adoption
**Risk:** Low adoption due to marketing/awareness
**Mitigation:**
- Documentation in multiple languages
- Community engagement
- Regular updates and improvements
- Integration with popular tools

## Release Schedule

| Phase | Milestone | Target Date | Status |
|-------|-----------|------------|--------|
| 1 | i18n Setup | Jan 31, 2026 | In Progress |
| 1 | Translation Files (4 langs) | Jan 19, 2026 | ✓ Complete |
| 1 | Page Routes & Nav | Feb 15, 2026 | Pending |
| 2 | CLI Implementation | Mar 31, 2026 | Planned |
| 2 | Dashboard Backend | Apr 30, 2026 | Planned |
| 3 | Advanced Features | Jun 30, 2026 | Planned |
| 4 | Ecosystem | Sep 30, 2026 | Planned |

## Quality Assurance Strategy

### Testing Approach
- Unit tests for utilities and helpers
- Integration tests for language switching
- Browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Manual testing on each platform (macOS, Linux, Windows)
- Accessibility testing (WCAG 2.1 AA)

### Code Review Process
- All PRs reviewed before merge
- Comprehensive commit messages
- No breaking changes without migration guide
- Documentation updated with code changes

### Performance Monitoring
- Lighthouse audits for each build
- Bundle size tracking
- Page load time monitoring
- Core Web Vitals compliance

## Deployment Strategy

### Current (Phase 1)
- Static HTML hosting (GitHub Pages or similar)
- No backend servers
- CDN distribution for global access

### Future (Phase 2+)
- Backend API server deployment
- Database persistence
- User authentication system
- Dashboard hosting

## Documentation Requirements

**Mandatory Documentation:**
- [Codebase Summary](./codebase-summary.md) - Architecture overview
- [Code Standards](./code-standards.md) - Implementation guidelines
- [System Architecture](./system-architecture.md) - Technical design
- [Development Roadmap](./development-roadmap.md) - Timeline and milestones
- README files for each major component
- Installation guides for each platform
- API documentation (Phase 2+)
- Troubleshooting guides

## Post-Launch Support

### Community
- GitHub Discussions for questions
- Issue templates for bug reports
- Contributing guidelines
- Code of conduct

### Maintenance
- Monthly security updates
- Quarterly feature releases
- Annual major version bumps
- 6-month end-of-life support for old versions

## Sign-Off

**Project Owner:** Hồ Xuân Dũng
**Last Updated:** 2026-01-19
**PDR Version:** 1.0
**Status:** Active Development
