import { escapeHtml as e } from '../scripts/markdown.mjs';
import { site, sections, navigation, pathToUrl } from './content.mjs';

const arrow = '<span aria-hidden="true">↗</span>';
const icons = {
  chapters: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  events: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18m-12 5h2m4 0h2"/>',
  resources: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H21M6.5 3H21v19H6.5A2.5 2.5 0 0 1 4 19.5v-14A2.5 2.5 0 0 1 6.5 3Z"/><path d="M8 7h9m-9 4h6"/>',
  partners: '<path d="m8 12 3 3 5-6"/><rect x="3" y="3" width="18" height="18" rx="6"/>',
  brand: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m18 5 2-2M4 21l3-3"/>',
  updates: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.resources}</svg>`;
}

function header(active) {
  const links = sections.map(section => `<a href="${pathToUrl(section.path)}"${section.id === active ? ' aria-current="true"' : ''}>${section.title}</a>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="Global AI Handbook home"><img src="/media/logos/global-AI-community.png" width="150" height="54" alt="Global AI Community"><span>Handbook</span></a>
        <nav class="desktop-nav" aria-label="Main navigation">${links}</nav>
        <a class="header-search" href="/search.html" aria-label="Search the handbook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Search</span><kbd>/</kbd></a>
        <details class="mobile-menu"><summary>Menu</summary><nav aria-label="Mobile navigation">${links}<a href="/search.html">Search the handbook</a><a href="https://globalai.community/my">Chapter dashboard ${arrow}</a></nav></details>
      </div>
    </header>`;
}

function footer(landing = false) {
  return `<footer class="site-footer">
    ${landing ? '' : `<div class="footer-top"><div><p class="eyebrow">A community, not a solo project</p><h2>You don't have to figure it out alone.</h2><p>Get help from HQ and chapter leads who have been there.</p></div><a class="button button-light" href="mailto:support@globalai.community">Contact support ${arrow}</a></div>`}
    <div class="footer-bottom"><a href="/" class="footer-brand">global AI community<span>The shared playbook.</span></a><nav aria-label="Footer"><a href="https://globalai.community">Community website ${arrow}</a><a href="https://gaic.io/discord">Discord ${arrow}</a><a href="${site.repository}">GitHub ${arrow}</a><a href="/chapter-playbook/code-of-conduct.html">Code of Conduct</a></nav><p>Built by the community. For the community.</p></div>
  </footer>`;
}

export function shell(page, body) {
  const canonical = `${site.origin}${page.url}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(page.title)} · ${site.name}</title>
  <meta name="description" content="${e(page.summary)}">
  <meta name="robots" content="${e(page.robots ?? 'index,follow')}">
  <meta name="theme-color" content="#f5f4ec">
  <link rel="canonical" href="${e(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${e(page.title)}">
  <meta property="og:description" content="${e(page.summary)}">
  <meta property="og:url" content="${e(canonical)}">
  <meta property="og:image" content="${site.origin}/media/logos/global-AI-community.png">
  <link rel="icon" href="/media/icon.png">
  <link rel="preload" href="/assets/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="module" src="/assets/app.js"></script>
</head>
<body>
${header(page.section)}
${body}
${footer(page.data?.layout === 'landing')}
</body>
</html>`;
}

function searchForm(value = '', id = 'handbook-search') {
  return `<form class="search-form" action="/search.html" method="get" role="search">
    <label class="visually-hidden" for="${id}">Search the handbook</label>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
    <input id="${id}" type="search" name="q" value="${e(value)}" placeholder="What can we help you with?" autocomplete="off">
    <button type="submit">Search <span aria-hidden="true">→</span></button>
  </form>`;
}

function taskCard(path, title, description, name) {
  return `<a class="task-card" href="${pathToUrl(path)}"><span class="task-icon">${icon(name)}</span><div><h3>${e(title)}</h3><p>${e(description)}</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>`;
}

export function homePage(page) {
  return shell(page, `<main id="main" tabindex="-1">
    <section class="home-hero"><div class="hero-inner">
      <div class="hero-copy"><p class="eyebrow">The Global AI Community handbook</p><h1>${e(page.title)}</h1><p class="hero-description">${e(page.summary)}</p>${searchForm()}<div class="quick-links"><span>Quick links</span><a href="/chapter-benefits/azure.html">Azure credits</a><a href="/branding/">Brand assets</a><a href="/agentcon/events.html">AgentCon dates</a></div></div>
      <div class="hero-art" aria-hidden="true"><div class="orbit orbit-outer"></div><div class="orbit orbit-inner"></div><div class="art-center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1V5Zm8 1v14"/></svg></div><span class="art-label art-label-one">Learn together</span><span class="art-label art-label-two">Build locally</span><span class="art-dot dot-one"></span><span class="art-dot dot-two"></span><span class="art-spark">✳</span></div>
    </div></section>
    <section class="section container"><div class="section-heading"><div><p class="eyebrow">Find your starting point</p><h2>Made for the people who make it happen.</h2></div><p>Practical guidance. Shared resources.<br>A little less figuring things out.</p></div>
      <div class="audience-grid">
        <a class="audience-card audience-chapters" href="/chapter-playbook/"><span class="card-label">${icon('chapters')} For chapter leads</span><h3>A great local community<br>starts with you.</h3><p>From your first meetup to your next big event. Find the steps, tools, and support to run your chapter.</p><span class="text-link">Open the chapter playbook <span aria-hidden="true">→</span></span></a>
        <a class="audience-card audience-partners" href="/partnerships/overview.html"><span class="card-label">${icon('partners')} For partners</span><h3>Help good ideas<br>reach more people.</h3><p>Support local learning, sponsor an event, or share useful content. Find a way to contribute that fits.</p><span class="text-link">Explore partnerships <span aria-hidden="true">→</span></span></a>
      </div>
    </section>
    <section class="section container task-section"><div class="section-heading"><div><p class="eyebrow">Less searching. More doing.</p><h2>What are you working on?</h2></div></div>
      <div class="task-grid">
        ${taskCard('new-chapter.md', 'Start a chapter', 'Bring the community to your city.', 'chapters')}
        ${taskCard('event-format.md', 'Plan your next event', 'Choose a format and find your next steps.', 'events')}
        ${taskCard('chapter-benefits/index.md', 'Get tools & benefits', 'Azure credits, Canva, and organizer support.', 'resources')}
        ${taskCard('resources/index.md', 'Find talks & workshops', 'Spend less time starting from scratch.', 'resources')}
        ${taskCard('branding/index.md', 'Make it look like Global AI', 'Logos, typography, colors, and templates.', 'brand')}
        ${taskCard('partnerships/agentcon-sponsorship.md', 'Sponsor an AgentCon', 'Understand the offer and talk to HQ.', 'partners')}
      </div>
    </section>
    <section class="container season-band"><div><p class="eyebrow">Plan ahead · 2026 / 2027</p><h2>Your next event starts here.</h2><p>Explore the seasonal chapter programs, the year-round Global AI Conference, and HQ-led opportunities.</p></div><a class="button button-ink" href="/event-format.html">Explore event formats <span aria-hidden="true">→</span></a></section>
    <section class="section container"><div class="section-heading"><div><p class="eyebrow">Stay in the loop</p><h2>From the chapter community.</h2></div><a class="text-link" href="/updates/">All updates & archives <span aria-hidden="true">→</span></a></div>
      <div class="updates-grid">
        <a class="update-card" href="/chapter-leads-meeting/august-2026.html"><span class="date-label">August 2026 · meeting recap</span><h3>A new season. A shared direction.</h3><p>Advisory Board nominations, chapter tools, and a preview of the event season.</p><span class="text-link">Read the recap <span aria-hidden="true">→</span></span></a>
        <a class="update-card" href="/chapter-leads-meeting/july-2026.html"><span class="date-label">July 2026 · meeting recap</span><h3>A new home for your chapter.</h3><p>The community dashboard, organizer tools, and the 2026 program wrap-up.</p><span class="text-link">Read the recap <span aria-hidden="true">→</span></span></a>
      </div>
    </section>
  </main>`);
}

function sideNavigation(page, pages) {
  const groups = navigation[page.section] ?? [];
  return `<details class="section-menu" open><summary>In this section</summary><nav aria-label="Section navigation">${groups.map(([label, paths], index) =>
    `<details class="nav-group"${index === 0 || paths.includes(page.path) ? ' open' : ''}><summary>${e(label)}</summary>${paths.map(path => {
      const target = pages.get(path);
      if (!target) throw new Error(`Navigation points to missing page: ${path}`);
      return `<a href="${target.url}"${path === page.path ? ' aria-current="page"' : ''}>${e(target.navTitle ?? target.title)}</a>`;
    }).join('')}</details>`).join('')}</nav></details>`;
}

function statusNotice(page) {
  const statuses = {
    archived: ['Archived edition', 'These are historical instructions, not a current offer. Dates, benefits, funding, and registration details may no longer apply.'],
    historical: ['Meeting archive', 'This recap records what was shared at the time. Use the current guides for today’s processes and policies.'],
    draft: ['Draft · not approved policy', 'This material is incomplete or awaiting review. Do not treat proposed steps, deadlines, or consequences as established requirements.'],
  };
  const notice = statuses[page.status];
  return `${notice ? `<aside class="status-notice"><span class="status-label">${e(notice[0])}</span><p>${e(notice[1])}</p><a href="${page.status === 'draft' ? '/chapter-playbook/' : '/updates/'}">${page.status === 'draft' ? 'Back to the handbook' : 'Browse current guidance and archives'} <span aria-hidden="true">→</span></a></aside>` : ''}
    ${page.review.length ? `<details class="review-notice" open><summary>Some guidance on this page needs confirmation</summary><ul>${page.review.map(note => `<li>${e(note)}</li>`).join('')}</ul><p>Please confirm these points with HQ before acting on them.</p></details>` : ''}`;
}

function articleWithAliases(page) {
  const headingId = page.headings.find(heading => heading.level === 1)?.id;
  let html = page.html;
  let headingAliases = '';
  for (const [alias, target] of Object.entries(page.headingAliases ?? {})) {
    if (!page.headings.some(heading => heading.id === target)) throw new Error(`Missing alias target ${target} in ${page.path}`);
    const marker = `<span class="anchor-alias" id="${e(alias)}" aria-hidden="true"></span>`;
    if (target === headingId) headingAliases += marker;
    else html = html.replace(new RegExp(`(<h[2-6] id="${target}")`), `${marker}$1`);
  }
  return { html, headingId, headingAliases };
}

export function landingPage(page) {
  const { eyebrow, actions } = page.data;
  const { html, headingId, headingAliases } = articleWithAliases(page);
  return shell(page, `<main class="landing-page" id="main" tabindex="-1">
    <header class="landing-hero">
      <div class="container">
        <p class="eyebrow">${e(eyebrow)}</p>
        ${headingAliases}<h1${headingId ? ` id="${e(headingId)}"` : ''}>${e(page.title)}</h1>
        <p class="landing-intro">${e(page.summary)}</p>
        <div class="landing-actions">${actions.map((action, index) => `<a class="button ${index === 0 ? 'button-ink' : 'button-outline'}" href="${e(action.href)}">${e(action.label)} ${arrow}</a>`).join('')}</div>
      </div>
    </header>
    <article class="landing-content container">${html}</article>
    ${page.review.length || page.status !== 'current' ? `<div class="container landing-review">${statusNotice(page)}</div>` : ''}
  </main>`);
}

export function documentPage(page, pages) {
  const section = sections.find(item => item.id === page.section);
  const toc = page.headings.filter(heading => heading.level > 1 && heading.level <= 3 && heading.text);
  const tocLinks = toc.map(heading => `<a class="toc-level-${heading.level}" href="#${e(heading.id)}">${e(heading.text)}</a>`).join('');
  const { html: articleHtml, headingId, headingAliases } = articleWithAliases(page);
  const paths = (navigation[page.section] ?? []).flatMap(([, items]) => items);
  const currentIndex = paths.indexOf(page.path);
  const next = currentIndex >= 0 ? paths.slice(currentIndex + 1).map(path => pages.get(path)).find(target => target.searchable && target.status === 'current') : null;
  const sourceUrl = `${site.repository}/edit/main/${page.path.split('/').map(encodeURIComponent).join('/')}`;
  return shell(page, `<div class="docs-layout container-wide">
    <aside class="docs-sidebar">${sideNavigation(page, pages)}</aside>
    <main class="doc-main" id="main" tabindex="-1"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Handbook</a><span aria-hidden="true">/</span><a href="${pathToUrl(section.path)}">${e(section.label)}</a></nav>
      <header class="doc-heading"><p class="eyebrow">${e(section.label)}</p>${headingAliases}<h1${headingId ? ` id="${e(headingId)}"` : ''}>${e(page.title)}</h1></header>
      ${statusNotice(page)}
      ${toc.length && page.data.outline !== false ? `<details class="mobile-toc"><summary>On this page</summary><nav aria-label="On this page">${tocLinks}</nav></details>` : ''}
      <article class="prose">${articleHtml}</article>
      <div class="doc-meta">${page.data.editLink === false ? '' : `<a href="${sourceUrl}">Suggest an edit on GitHub ${arrow}</a>`}<a href="mailto:support@globalai.community?subject=${encodeURIComponent(`Handbook: ${page.title}`)}">Something unclear? Contact support ${arrow}</a></div>
      ${next ? `<a class="next-page" href="${next.url}"><span>Keep going</span><strong>${e(next.title)} <span aria-hidden="true">→</span></strong></a>` : ''}
    </main>
    ${toc.length && page.data.outline !== false ? `<aside class="toc"><nav aria-label="On this page"><p>On this page</p>${tocLinks}</nav></aside>` : ''}
  </div>`);
}

export function searchPage() {
  return shell({ title: 'Search the handbook', summary: 'Find chapter guidance, event resources, and partnership information.', url: '/search.html', robots: 'noindex,follow' },
    `<main id="main" tabindex="-1" class="search-page container"><p class="eyebrow">A good answer starts here</p><h1>Search the handbook.</h1>${searchForm('', 'search-query')}
    <div class="search-filters"><label for="search-section">Look in <select id="search-section"><option value="">All sections</option>${sections.map(section => `<option value="${section.id}">${e(section.label)}</option>`).join('')}</select></label><label class="archive-toggle"><input id="include-archives" type="checkbox"> Include archives & meeting recaps</label></div>
    <p id="search-status" role="status" aria-live="polite">Search by task, tool, event, or question.</p>
    <div id="search-results"></div><noscript><p>Search needs JavaScript. You can still browse every guide through the <a href="/chapter-playbook/">chapter playbook</a>, <a href="/event-format.html">event formats</a>, <a href="/resources/">resources</a>, <a href="/partnerships/overview.html">partnerships</a>, and <a href="/updates/">archive</a>.</p></noscript></main>`);
}

export function notFoundPage() {
  return shell({ title: 'Page not found', summary: 'Find your way back to the Global AI handbook.', url: '/404.html', robots: 'noindex,follow' },
    `<main id="main" tabindex="-1" class="not-found container"><p class="eyebrow">404 · A wrong turn, not a dead end</p><h1>Let’s get you back on track.</h1><p>This page may have moved, or the link may be incomplete.</p>${searchForm()}<a class="text-link" href="/">Back to the handbook <span aria-hidden="true">→</span></a></main>`);
}
