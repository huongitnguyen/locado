# Code Standards & Guidelines

## File Naming Conventions

**TypeScript/Astro Files:**
- Use PascalCase for component files: `Hero.astro`, `Navbar.astro`
- Use kebab-case for utility/config files: `global.css`, `tsconfig.json`

**Translation Files:**
- Format: `{language-code}.json` (lowercase)
- Examples: `en.json`, `vi.json`, `ru.json`, `zh.json`, `ko.json`, `ja.json`
- Location: `src/i18n/`

**Page Routes:**
- Use kebab-case: `index.astro`, `vi.astro`, `[lang-code].astro`
- Root language uses `index.astro` (English)
- Other languages use language code: `vi.astro`, etc.

## Translation Standards

### JSON Structure

All translation files **MUST** follow identical structure:

```json
{
  "meta": {
    "title": "Page title with app name",
    "description": "SEO description"
  },
  "nav": {
    "features": "Features text",
    "install": "Install text",
    "docs": "Docs text",
    "faq": "FAQ text"
  },
  "hero": {
    "title": "Main hero title",
    "typingTexts": ["Text 1", "Text 2", ...],
    "installBtn": "Button label",
    "docsBtn": "Button label"
  },
  "features": {
    "title": "Section title",
    "items": [
      {
        "icon": "icon-name",
        "title": "Feature title",
        "description": "Feature description"
      }
    ]
  },
  "install": {
    "title": "Installation title",
    "subtitle": "Subtitle",
    "copyBtn": "Copy button text",
    "copiedBtn": "Copied confirmation text",
    "commands": {
      "install": "curl command",
      "addDomain": "cli command",
      "startService": "cli command"
    }
  },
  "faq": {
    "title": "FAQ title",
    "items": [
      {
        "question": "Q?",
        "answer": "A."
      }
    ]
  },
  "changelog": {
    "title": "Changelog title"
  },
  "footer": {
    "madeBy": "Made with",
    "by": "by",
    "author": "Author name",
    "links": {
      "github": "GitHub link text",
      "website": "Website link text"
    }
  }
}
```

### Translation Quality Checklist

When adding new language:
- [ ] All keys from `en.json` present in new file
- [ ] No extra keys not in English version
- [ ] Strings maintain consistent terminology
- [ ] Line breaks and formatting match original intent
- [ ] Special characters (quotes, dashes) properly encoded
- [ ] No hardcoded English text mixed in
- [ ] Command strings (`install`, `addDomain`, etc.) remain UNCHANGED
- [ ] Icon names (`globe-outline`, etc.) remain UNCHANGED
- [ ] Author name remains unchanged

### Key Translation Rules

**Preserve as-is:**
- Technical terms: `localhost`, `Docker`, `HTTPS`, `SSH`, `CLI`, `TLD`, `CA`
- Command strings: `curl -fsSL`, `locado domain add`, `locado service`
- File paths and configuration examples
- Author name: "Hồ Xuân Dũng"
- Project name: "Locado"

**Always Translate:**
- UI labels and button text
- Section titles and headings
- Descriptions and explanations
- FAQ questions and answers
- Footer text

**Consistency Checks:**
- Use same term for repeated concepts (e.g., always "domain" or always equivalent in target language)
- Match punctuation style with original
- Maintain sentence structure when possible
- Keep similar string length (important for UI layout)

## Component Standards

### Astro Component Props

Define props interface clearly:
```typescript
interface Props {
  t: TranslationObject;
  lang: string;
}

const { t, lang } = Astro.props;
```

### Layout Props

```typescript
interface Props {
  title: string;
  description: string;
  lang?: string; // Default 'en'
}
```

### Page Implementation Pattern

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import {lang translation} from '../i18n/{lang}.json';

const t = {translation};
const lang = '{language-code}';
---

<Layout title={t.meta.title} description={t.meta.description} lang={lang}>
  <Navbar t={t} lang={lang} />
  {/* Page content using t.{section}.{key} */}
</Layout>
```

## HTML & Accessibility Standards

### Language Attribute

Always set HTML lang attribute:
```html
<html lang={lang}>
```

Values: `en`, `vi`, `ru`, `zh`, `ko`, `ja`

### Navigation Links

Language switcher should provide:
- Current page in current language
- Link to same page in other language
- Clear indication of selected language

Example:
```
English (current) | 中文 (click to switch)
```

## CSS & Styling Standards

**Framework:** Tailwind CSS

**Conventions:**
- Use Tailwind utility classes
- Group responsive variants logically
- Use consistent color naming: `accent-orange`, `accent-red`
- Maintain visual hierarchy with z-index values

**Example:**
```html
<div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]">
```

## Build Standards

### Pre-build Checks

- [ ] No TypeScript errors: `astro check`
- [ ] All translation files valid JSON
- [ ] All import paths resolve correctly
- [ ] No console errors/warnings

### Build Command

```bash
npm run build
```

Output: Static HTML files in `/dist/`

## Git Commit Standards

Use conventional commit format:

```
feat(i18n): add Russian translation
fix(navbar): language switcher link
docs(i18n): update translation guidelines
refactor(components): improve type safety
```

## Performance Standards

- Keep component file size < 200 lines
- Minimize JavaScript in static pages
- Optimize CSS with Tailwind
- Use static imports for translations (not dynamic)

## Development Best Practices

### Before Adding New Language

1. Copy `en.json` as template
2. Translate all strings
3. Validate JSON syntax: `node -e "require('./src/i18n/{new-lang}.json')"`
4. Test in browser (once page route added)
5. Verify all keys match English version

### Adding New Page Route

1. Create `src/pages/{lang-code}.astro`
2. Import language translation file
3. Pass to Layout and components
4. Test navigation between languages

### Updating Existing Translation

1. Edit relevant section in JSON file
2. Keep JSON structure intact
3. Verify no syntax errors
4. Test page displays correctly

## Language Support Matrix

| Language | Code | Status | Date Added |
|----------|------|--------|-----------|
| English | en | Complete | Initial |
| Vietnamese | vi | Complete | Initial |
| Russian | ru | Phase 1 | 2026-01-19 |
| Chinese (Simplified) | zh | Phase 1 | 2026-01-19 |
| Korean | ko | Phase 1 | 2026-01-19 |
| Japanese | ja | Phase 1 | 2026-01-19 |

## Current i18n Implementation Status

**Phase 1 - Translation Files (Complete):**
- [x] Russian (ru.json)
- [x] Chinese Simplified (zh.json)
- [x] Korean (ko.json)
- [x] Japanese (ja.json)

**Phase 2 - Page Routes (Pending):**
- [ ] /ru route with ru.astro page
- [ ] /zh route with zh.astro page
- [ ] /ko route with ko.astro page
- [ ] /ja route with ja.astro page

**Phase 3 - Navigation & SEO (Pending):**
- [ ] Update Navbar to show all 6 languages
- [ ] Add hreflang meta tags
- [ ] Language detection logic
- [ ] Redirect handling

## Testing Checklist

When implementing new language route:
- [ ] Page loads without errors
- [ ] All text displays correctly (no garbled characters)
- [ ] Language switcher works
- [ ] Navigation links function
- [ ] Responsive design works
- [ ] SEO metadata correct for language
- [ ] No console errors

## Documentation References

- [Codebase Summary](./codebase-summary.md) - Current architecture
- [System Architecture](./system-architecture.md) - Design decisions
- [Project Overview & PDR](./project-overview-pdr.md) - Requirements
