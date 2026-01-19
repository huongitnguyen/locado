# Locado Codebase Summary

**Project:** Locado - Local Domain Manager
**Version:** Based on analysis as of 2026-01-19
**Stack:** Astro (TypeScript), with multilingual support

## Project Overview

Locado is a local domain manager providing:
- Custom domain mapping to localhost, Docker containers, or remote hosts
- Automatic HTTPS with self-signed CA certificates
- Zero-config DNS with cross-platform support
- Beautiful web dashboard for domain management
- Full CLI with auto-start service capability

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Astro (Static Site Generator) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Package Manager | npm |
| Build Tool | Astro CLI |
| Hosting | Static files with dynamic dashboard |

## Directory Structure

```
locado/
├── src/
│   ├── pages/           # Astro page routes
│   │   ├── index.astro  # English homepage
│   │   └── vi.astro     # Vietnamese homepage
│   ├── components/      # Reusable Astro components
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   └── [others]
│   ├── layouts/         # Layout templates
│   │   └── Layout.astro
│   ├── i18n/            # Translation files (JSON)
│   │   ├── en.json      # English
│   │   ├── vi.json      # Vietnamese
│   │   ├── ru.json      # Russian (Phase 1)
│   │   ├── zh.json      # Chinese Simplified (Phase 1)
│   │   ├── ko.json      # Korean (Phase 1)
│   │   └── ja.json      # Japanese (Phase 1)
│   └── styles/          # Global CSS
├── public/              # Static assets
├── dist/                # Build output
└── [config files]       # astro.config.mjs, tsconfig.json, etc.
```

## Core Features

### 1. Multilingual Support (i18n)

**Current Languages:**
- English (en) - Default
- Vietnamese (vi) - Completed
- Russian (ru) - Phase 1 Complete
- Chinese Simplified (zh) - Phase 1 Complete
- Korean (ko) - Phase 1 Complete
- Japanese (ja) - Phase 1 Complete

**Translation Structure:**
All translations stored in `src/i18n/{lang}.json` with flat-key structure:
```json
{
  "meta": { "title": "...", "description": "..." },
  "nav": { "features": "...", "install": "..." },
  "hero": { "title": "...", "typingTexts": [...] },
  "features": { ... },
  "install": { ... },
  "faq": { ... },
  "changelog": { ... },
  "footer": { ... }
}
```

### 2. Page Routing

**Current Routes:**
- `/` - English homepage (index.astro)
- `/vi` - Vietnamese homepage (vi.astro)
- **Planned:** `/ru`, `/zh`, `/ko`, `/ja` (Phase 2)

**Implementation Pattern:**
Each language has dedicated `.astro` page that:
1. Imports language-specific translation file
2. Sets `lang` variable for HTML attribute
3. Passes translations and lang to Layout and components

### 3. Component Architecture

**Navbar.astro:**
- Props: `t` (translations), `lang` (current language)
- Features: Language switcher, navigation links
- Language toggle: Shows link to other language route

**Hero.astro:**
- Displays hero section with typing animation
- Uses translation strings for title and description

**Layout.astro:**
- Wrapper for all pages
- Sets HTML `lang` attribute for SEO
- Props: `title`, `description`, `lang`

## Build & Development

**Commands:**
```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

**Build Output:**
- Static HTML pages in `/dist` directory
- One HTML file per language route

## Key Implementation Details

### i18n Loading Pattern
```typescript
// pages/index.astro
import en from '../i18n/en.json';
const t = en;
const lang = 'en';
```

### Language Switching
- Navbar provides navigation link to alternate language
- URLs follow pattern: `/` (en), `/vi` (vi), etc.
- HTML lang attribute set for accessibility

### Content Organization
All UI strings centralized in JSON files - no hardcoded strings in components.

## Dependencies & Tools

**Key npm packages:**
- astro - Framework
- typescript - Type safety
- tailwindcss - Styling
- (others from package.json)

**Build tools:**
- repomix - Codebase analysis/packing
- Astro CLI - Build and dev server

## Performance Considerations

- Static site generation (SSG) - fast page loads
- Minimal JavaScript - mostly content
- Tailwind CSS optimization for production
- Language-specific static pages eliminate runtime locale detection

## Security Notes

- No backend server or database in main application
- Dashboard references suggest planned backend (phase 2+)
- Translation files are public assets - no sensitive data

## Phase 1 Completion Status

**Completed:**
- 4 new translation files (ru, zh, ko, ja)
- All translations aligned with en.json structure
- Files follow consistent JSON formatting

**Not Yet Implemented:**
- Page routes for new languages (/ru, /zh, /ko, /ja)
- Navbar language selection UI updates
- Automated language detection
- SEO hreflang links for language variants

**Next Phase (Phase 2):**
- Create language-specific page routes
- Update navigation to include all 6 languages
- Add language detection and redirect logic
- Update SEO metadata with hreflang tags

## Development Workflow

1. **Feature Development:** Create/update components in `src/components/`
2. **Translations:** Update all files in `src/i18n/`
3. **Pages:** Add new routes in `src/pages/`
4. **Build:** Run `npm run build`
5. **Preview:** Run `npm run preview` before deployment

## Related Documentation

- [Code Standards](./code-standards.md) - Translation guidelines, file naming conventions
- [System Architecture](./system-architecture.md) - Overall system design
- [Project Overview & PDR](./project-overview-pdr.md) - Requirements and scope
