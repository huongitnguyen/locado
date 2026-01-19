# System Architecture

## Architecture Overview

Locado is a **static site generator (SSG)** with a multilingual web interface built with Astro.

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Static Web Interface (HTML/CSS/JS)          │
│         Built with Astro + TypeScript + Tailwind        │
├─────────────────────────────────────────────────────────┤
│  Language Support (i18n) - Full Support                 │
│  ├─ English (en) /                                      │
│  ├─ Vietnamese (vi) /vi                                 │
│  ├─ Russian (ru) /ru                                    │
│  ├─ Chinese Simplified (zh) /zh                         │
│  ├─ Korean (ko) /ko                                     │
│  └─ Japanese (ja) /ja                                   │
│                                                         │
│  Navigation: Accessible dropdown with all 6 languages   │
│  Accessibility: WCAG 2.1 AA compliant                   │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Astro 4.x | Static site generation |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Build Tool** | Astro CLI | Compilation and bundling |
| **Package Manager** | npm | Dependency management |

### Build Pipeline

```
Source Code (.astro, .ts, .css)
         │
         ▼
   Astro Compiler
         │
         ▼
HTML + CSS + Minimal JS
         │
         ▼
Static Files in /dist/
```

### Internationalization (i18n) Layer

```
┌──────────────────────────────────────────────────────┐
│           Translation Files (JSON)                    │
│  ├─ src/i18n/en.json                                │
│  ├─ src/i18n/vi.json                                │
│  ├─ src/i18n/ru.json (Phase 1 Complete)            │
│  ├─ src/i18n/zh.json (Phase 1 Complete)            │
│  ├─ src/i18n/ko.json (Phase 1 Complete)            │
│  └─ src/i18n/ja.json (Phase 1 Complete)            │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│         Page Routes (.astro files)                    │
│  ├─ src/pages/index.astro (English, /)              │
│  ├─ src/pages/vi.astro (Vietnamese, /vi)           │
│  ├─ src/pages/ru.astro (Russian, /ru)              │
│  ├─ src/pages/zh.astro (Chinese, /zh)              │
│  ├─ src/pages/ko.astro (Korean, /ko)               │
│  └─ src/pages/ja.astro (Japanese, /ja)             │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│      Component Layer (Reusable UI Components)        │
│  ├─ Layout.astro (HTML skeleton, lang attribute)    │
│  ├─ Navbar.astro (Dropdown + 6 languages, WCAG AA)  │
│  ├─ Hero.astro (Hero section with animations)       │
│  ├─ Features.astro (Features grid)                  │
│  └─ [Other components...]                           │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│          Static HTML Pages (Output)                   │
│  ├─ dist/index.html (English)                        │
│  ├─ dist/vi/index.html (Vietnamese)                 │
│  ├─ dist/ru/index.html (Russian)                    │
│  ├─ dist/zh/index.html (Chinese)                    │
│  ├─ dist/ko/index.html (Korean)                     │
│  └─ dist/ja/index.html (Japanese)                   │
└──────────────────────────────────────────────────────┘
```

## Content Flow

### 1. Language Selection Flow

```
Browser Request
     │
     ├─ "/" → index.astro → serves English (en.json)
     ├─ "/vi" → vi.astro → serves Vietnamese (vi.json)
     ├─ "/ru" → ru.astro → serves Russian (ru.json)
     ├─ "/zh" → zh.astro → serves Chinese (zh.json)
     ├─ "/ko" → ko.astro → serves Korean (ko.json)
     ├─ "/ja" → ja.astro → serves Japanese (ja.json)
     └─ "/other" → 404
```

### 2. Page Rendering Flow

```
1. Astro loads page component (e.g., index.astro)
          │
          ▼
2. Page imports translation file (e.g., en.json)
          │
          ▼
3. Page passes translations (t) to Layout + child components
          │
          ▼
4. Components use t.{section}.{key} to render strings
          │
          ▼
5. Layout wraps content with HTML lang attribute
          │
          ▼
6. Astro outputs static HTML file
```

### 3. Component Prop Flow

```
Page Component (e.g., index.astro)
    │
    ├─ import Layout from '../layouts/Layout.astro'
    ├─ import Navbar from '../components/Navbar.astro'
    └─ import en from '../i18n/en.json'
    │
    ▼
<Layout title={t.meta.title} lang="en">
    │
    ├─ <Navbar t={t} lang="en" />
    │
    └─ <Hero t={t} />
        <Features t={t} />
        <Install t={t} />
        <FAQ t={t} />
```

## File Organization

### Source Directory Structure

```
src/
├── pages/
│   ├── index.astro          # English homepage (/)
│   ├── vi.astro             # Vietnamese homepage (/vi)
│   ├── ru.astro             # Russian homepage (/ru)
│   ├── zh.astro             # Chinese homepage (/zh)
│   ├── ko.astro             # Korean homepage (/ko)
│   └── ja.astro             # Japanese homepage (/ja)
│
├── components/
│   ├── Hero.astro           # Hero section
│   ├── Navbar.astro         # Navigation bar with accessible dropdown
│   ├── Features.astro       # Features grid
│   ├── Install.astro        # Installation section
│   ├── FAQ.astro            # FAQ section
│   └── Footer.astro         # Footer
│
├── layouts/
│   └── Layout.astro         # Main HTML template
│
├── i18n/
│   ├── en.json              # English translations (complete)
│   ├── vi.json              # Vietnamese translations (complete)
│   ├── ru.json              # Russian translations (complete)
│   ├── zh.json              # Chinese Simplified (complete)
│   ├── ko.json              # Korean (complete)
│   └── ja.json              # Japanese (complete)
│
└── styles/
    └── global.css           # Global styles
```

## i18n Architecture Details

### Translation File Schema

```json
{
  "meta": { /* SEO metadata */ },
  "nav": { /* Navigation labels */ },
  "hero": { /* Hero section content */ },
  "features": { /* Feature items */ },
  "install": { /* Installation commands */ },
  "faq": { /* FAQ items */ },
  "changelog": { /* Changelog section */ },
  "footer": { /* Footer content */ }
}
```

### Key Design Decisions

1. **Static Translation Files:** JSON files imported at build time
   - Pros: Type-safe, predictable, no runtime overhead
   - Cons: Requires page route per language

2. **Separate Page Routes:** Each language has dedicated `.astro` page
   - Pros: Clean URLs, proper lang attributes, SEO-friendly
   - Cons: Code duplication (mitigated with Layout components)

3. **Flat Translation Keys:** No deep nesting
   - Pros: Simple access pattern, easy to audit completeness
   - Cons: Longer key names

4. **Component Translation Props:** Pass `t` object to components
   - Pros: Type-safe, traceable usage
   - Cons: Requires prop drilling

## Navigation & Language Switching

### Current Implementation (Phase 3 Complete)

**All 6 language pages with dropdown navigation:**

```
Page (any language)
     │
     ▼
Navbar with Accessible Dropdown
├─ Button: Shows current language name
├─ Keyboard shortcuts: Arrow keys, Enter, Escape
├─ ARIA labels: aria-label, aria-expanded, role="listbox"
└─ Options (all 6 languages):
   ├─ English → /
   ├─ Tiếng Việt → /vi
   ├─ Русский → /ru
   ├─ 简体中文 → /zh
   ├─ 한국어 → /ko
   └─ 日本語 → /ja
```

**Accessibility Features:**
- Current language highlighted with visual indicator
- Focus management: trap focus within dropdown
- Screen reader announces dropdown state & options
- Touch targets: 44x44px minimum
- Contrast: WCAG 2.1 AA (4.5:1 ratio)

## HTML Document Structure

### Language Attribute

```html
<html lang="en">     <!-- For English -->
<html lang="vi">     <!-- For Vietnamese -->
<html lang="ru">     <!-- For Russian -->
<html lang="zh">     <!-- For Chinese Simplified -->
<html lang="ko">     <!-- For Korean -->
<html lang="ja">     <!-- For Japanese -->
```

**Purpose:**
- Accessibility tools know document language
- Search engines rank by language
- Browser spell-check uses correct dictionary

### Meta Tags Structure

```html
<head>
  <title>{t.meta.title}</title>
  <meta name="description" content="{t.meta.description}">
  <!-- Planned: hreflang tags for alternate versions -->
</head>
```

## Build & Deployment

### Build Process

```bash
npm install          # Install dependencies
npm run build        # Compile to /dist/
```

### Output Structure

```
dist/
├── index.html       # English homepage
├── vi/
│   └── index.html   # Vietnamese homepage
├── assets/
│   ├── styles.css
│   └── script.js
└── public/
    └── [static files]
```

## Performance Architecture

### Static Site Benefits

1. **No Server Rendering:** Pre-generated HTML
2. **Minimal JavaScript:** Only necessary for interactions
3. **Fast Delivery:** CDN-friendly static files
4. **High Security:** No dynamic server code execution

### Optimization Strategy

- Tailwind CSS purging for unused styles
- Static asset optimization
- Language-specific pages eliminate runtime detection overhead

## Phase 1-3 Completion Status

**✓ Phase 1 - Completed:**
- Russian translation (ru.json)
- Chinese Simplified translation (zh.json)
- Korean translation (ko.json)
- Japanese translation (ja.json)

**✓ Phase 2 - Completed:**
- Page route ru.astro (/ru)
- Page route zh.astro (/zh)
- Page route ko.astro (/ko)
- Page route ja.astro (/ja)

**✓ Phase 3 - Completed:**
- Navbar refactored with accessible dropdown
- All 6 languages available in dropdown
- Current language visual indication
- WCAG 2.1 AA accessibility compliance
- Keyboard navigation & ARIA labels

**Future Phases:**
- Language detection logic
- SEO hreflang tags
- Language redirect handling

## Security Considerations

- **No Backend:** Static files only - no injection attacks
- **No Database:** Translations embedded in HTML
- **No User Input:** Content from code repository only
- **Source Integrity:** All changes tracked in git

## Scalability & Maintainability

### Adding New Language (Future)

1. Create `src/i18n/{lang}.json` (copy from en.json, translate)
2. Create `src/pages/{lang}.astro` (copy from index.astro, change imports)
3. Update navigation in Navbar component
4. Run build, test, deploy

### Modifying Existing Language

1. Edit `src/i18n/{lang}.json`
2. Run `npm run build`
3. Verify in `npm run preview`
4. Deploy new dist files

## Related Documentation

- [Code Standards](./code-standards.md) - Implementation guidelines
- [Codebase Summary](./codebase-summary.md) - Technical overview
- [Project Overview & PDR](./project-overview-pdr.md) - Requirements
