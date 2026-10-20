# Global AI Handbook

The Markdown documentation for Global AI Community chapters, organizers, and partners.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run docs:dev
```

Open `http://127.0.0.1:4173`. Saving Markdown, templates, or CSS rebuilds the site; refresh the browser to see the result. Use `npm run docs:dev -- --port 4174` to choose another port.

```sh
npm test
npm run docs:build
npm run docs:preview
```

The build writes static HTML and assets to `dist/`. Azure Static Web Apps serves this directory; no application server, CMS, database, or client framework is required.

## How it works

- Content stays in the existing Markdown files. Old `.html` and extensionless URLs remain valid. Static directory aliases use the same canonical URL, without requiring per-page hosting rules. Markdown source links are converted to published URLs at build time.
- `web/content.mjs` defines sections, navigation, archive/draft status, and unresolved editorial questions.
- `scripts/markdown.mjs` renders Markdown with tables, heading anchors, callouts, collapsible details, badges, and existing HTML embeds.
- `web/templates.mjs` and `web/styles.css` own the layout and design system.
- Search runs locally in the reader's browser using MiniSearch. It searches current guidance by default, with an explicit archive option.
- Fonts are self-hosted with their license files. No external search service or font request is needed.

## Add or edit content

Edit a Markdown page, then run the tests and build. Each page needs a title, either in frontmatter or as its first `# Heading`. A short `description` in frontmatter improves page previews and search summaries.

New pages in an existing content directory inherit its section. Register a new top-level page or directory in `web/content.mjs`, and add reader-facing pages to the relevant navigation group or hub. Keep one authoritative page for each process; link to it rather than copying policy.

The build fails on missing local links or heading anchors. External links need editorial verification; a successful build does not verify policy, commercial promises, or third-party content.

## Content states and privacy

- **Current:** active guidance, with visible confirmation notices where sources disagree.
- **Historical:** meeting recaps, presented as records of what was said at the time.
- **Archived:** previous programs and retired tools; old benefits and funding are not current offers.
- **Draft:** incomplete or unapproved guidance, excluded from search and the sitemap.

Preserve `search: false` and robots metadata on pages such as payment instructions and specific partnership proposals. They must not enter search, the sitemap, or `llms.txt`. These flags are discovery controls, **not access control**: the pages and repository remain accessible. Do not put secrets or private agreements in public Markdown.

The current design reference is the [Global AI design system](https://salmon-cliff-06ec72a03.7.azurestaticapps.net/), reflected in `branding/index.md`. Previous event editions retain their original visual assets.