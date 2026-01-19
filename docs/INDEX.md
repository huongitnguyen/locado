# Locado Documentation Index

Welcome to the Locado documentation. This directory contains comprehensive guides for developers, contributors, and users.

## Core Documentation

### [Project Overview & PDR](./project-overview-pdr.md)
**Business & requirements definition** - Product vision, functional requirements, success metrics, roadmap
- Problem statement and solution overview
- 4-phase development roadmap (Q1-Q4 2026)
- Functional & non-functional requirements
- Success metrics and release schedule
- Risk assessment and mitigation strategies

**Start here if:** Understanding project goals and requirements

### [Codebase Summary](./codebase-summary.md)
**Architecture overview & tech stack** - Project structure, technologies, features, current state
- Technology stack breakdown (Astro, TypeScript, Tailwind)
- Directory structure and file organization
- i18n support (6 languages: en, vi, ru, zh, ko, ja)
- Core features explanation
- Phase progression status
- Performance considerations

**Start here if:** Understanding how the project is organized

### [System Architecture](./system-architecture.md)
**Technical design & implementation** - i18n architecture, data models, design patterns
- Architecture diagrams (content flow, i18n layer)
- Translation file schema specification
- Component prop flow and rendering process
- Navigation & language switching design
- Build pipeline and deployment strategy
- Scalability & maintainability approach

**Start here if:** Understanding technical implementation details

### [Code Standards](./code-standards.md)
**Implementation guidelines & best practices** - Naming conventions, translation rules, component patterns
- File naming conventions (PascalCase, kebab-case)
- Translation JSON structure and quality standards
- Translation rules (preserve vs. translate)
- Component standards and props interfaces
- HTML/accessibility standards
- Testing procedures for new languages
- 6-language support matrix

**Start here if:** Implementing features or adding new language support

---

## i18n (Internationalization) Status

### Phase 1: Translation Files - COMPLETE ✓

| Language | File | Status | Date |
|----------|------|--------|------|
| English | en.json | Complete | Initial |
| Vietnamese | vi.json | Complete | Initial |
| Russian | ru.json | Complete | 2026-01-19 |
| Chinese (Simplified) | zh.json | Complete | 2026-01-19 |
| Korean | ko.json | Complete | 2026-01-19 |
| Japanese | ja.json | Complete | 2026-01-19 |

**All 4 new translation files validated:**
- ✓ Valid JSON syntax
- ✓ Identical schema to en.json
- ✓ All required keys present
- ✓ No hardcoded English text
- ✓ Ready for production

### Phase 2: Page Routes - PENDING (Target: Feb 2026)

Required before launch:
- [ ] Create `/src/pages/ru.astro` for Russian
- [ ] Create `/src/pages/zh.astro` for Chinese
- [ ] Create `/src/pages/ko.astro` for Korean
- [ ] Create `/src/pages/ja.astro` for Japanese
- [ ] Test all 6 language pages
- [ ] Verify HTML lang attributes

### Phase 3: Navigation & SEO - PENDING (Target: Mar 2026)

Enhancements:
- [ ] Update Navbar to show all 6 languages
- [ ] Add hreflang meta tags
- [ ] Language detection logic
- [ ] Language preference persistence

---

## Quick Reference

### Adding a New Language

1. **Translate:** Copy `src/i18n/en.json`, translate all strings
2. **Validate:** All keys must match en.json schema
3. **Create Page:** Copy `src/pages/index.astro` → `src/pages/{lang}.astro`, change imports
4. **Test:** Verify page loads, navigation works, no console errors
5. **SEO:** Update navigation and add hreflang tags

See [Code Standards](./code-standards.md) for detailed guidelines.

### Translation Quality Checklist

- [ ] All 8 top-level keys present (meta, nav, hero, features, install, faq, changelog, footer)
- [ ] Proper terminology consistency
- [ ] Special characters correctly encoded
- [ ] Command strings unchanged (curl, locado, etc.)
- [ ] Author name unchanged (Hồ Xuân Dũng)
- [ ] No hardcoded English text mixed in
- [ ] File valid JSON (test with Node: `node -e "require('./file.json')"`)

### Component Standards

**Always include:**
```typescript
interface Props {
  t: TranslationObject;  // Translation strings
  lang: string;          // Language code (en, vi, ru, etc.)
}

const { t, lang } = Astro.props;
```

**Use translation strings:**
```html
<h1>{t.hero.title}</h1>
<button>{t.hero.installBtn}</button>
```

---

## File Locations

**Source Code:**
- Pages: `/src/pages/*.astro`
- Components: `/src/components/*.astro`
- Translations: `/src/i18n/{lang}.json`
- Layout: `/src/layouts/Layout.astro`
- Styles: `/src/styles/global.css`

**Documentation:**
- `/docs/` - All documentation files
- `/plans/reports/` - Project reports

**Build Output:**
- `/dist/` - Static HTML files (generated)

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Key References

- **Project Vision:** [Project Overview & PDR](./project-overview-pdr.md#vision--roadmap)
- **Phase Progress:** [Codebase Summary - Phase Status](./codebase-summary.md#phase-1-completion-status)
- **Translation Rules:** [Code Standards - Translation Standards](./code-standards.md#translation-standards)
- **i18n Design:** [System Architecture - i18n Architecture](./system-architecture.md#i18n-architecture-details)

---

## Support & Questions

For detailed information about any topic, refer to the full documentation files listed above. Each file contains comprehensive sections with examples and best practices.

**Last Updated:** 2026-01-19
**Documentation Version:** 1.0
**Status:** Phase 1 Complete - Ready for Phase 2 Implementation
