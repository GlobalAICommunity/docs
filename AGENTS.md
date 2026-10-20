# Maintaining the handbook

- Keep content in Markdown and presentation in `web/`. The site is static HTML, built with Node.js; do not add a CMS or client framework for routine content work.
- Read the relevant guide and `web/content.mjs` before editing. That file records navigation, content states, and unresolved guidance.
- Do not decide policy, eligibility, prices, funding, event capacity, or commercial promises from conflicting sources. Ask HQ or add a visible review note through the existing metadata mechanism.
- Meeting recaps are historical records, not current policy. Do not rewrite them to reflect a later decision.
- Keep earlier event editions separate from current programs. Never transfer an old benefit or funding promise to a new edition without confirmation.
- Preserve existing document URLs, heading anchors, downloads, and explicit search/robots exclusions. A noindex flag does not make content private.
- Use the current `branding/index.md` guidance for the website. Preserve original branding within archived event kits.
- Run `npm test` and `npm run docs:build` after changes. Review rendered pages at desktop and mobile widths for layout changes.
- Do not add a review date unless the content has actually been reviewed. A code edit is not a policy approval.
