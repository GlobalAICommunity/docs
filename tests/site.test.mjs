import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import MiniSearch from 'minisearch';
import { build, output, searchOptions, validateLinks } from '../scripts/build.mjs';
import { createMarkdown, resolveLink, readFrontmatter } from '../scripts/markdown.mjs';
import { pathToUrl, metadataFor, redirects, navigation } from '../web/content.mjs';

let pages;
before(async () => { pages = await build(); });
const htmlFor = path => readFile(join(output, path.replace(/\.md$/, '.html')), 'utf8');

test('all documents render with exactly one page heading and no Vue components', async () => {
  assert.ok(pages.size >= 65);
  for (const page of pages.values()) {
    const html = await htmlFor(page.path);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, page.path);
    assert.ok(html.includes('<main'), page.path);
    assert.ok(html.includes('id="main"'), page.path);
    assert.doesNotMatch(html, /<Badge\b|vitepress/i, page.path);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${page.path}`);
  }
});

test('all template, content, stylesheet, script and asset links resolve', async () => {
  for (const page of pages.values()) {
    const html = await htmlFor(page.path);
    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (!value.startsWith('/')) continue;
      const url = new URL(value.replaceAll('&amp;', '&'), 'https://docs.globalai.community');
      const path = decodeURIComponent(url.pathname);
      const entry = await stat(join(output, path)).catch(error => {
        throw new Error(`${page.path}: ${value}`, { cause: error });
      });
      if (entry.isDirectory()) await stat(join(output, path, 'index.html'));
    }
  }
});

test('Markdown links and legacy clean, directory and spaced URLs keep working', async () => {
  assert.equal(pathToUrl('index.md'), '/');
  assert.equal(pathToUrl('branding/index.md'), '/branding/');
  assert.equal(pathToUrl('agentcon/post-event tasks.md'), '/agentcon/post-event%20tasks.html');
  for (const page of pages.values()) {
    if (page.path === 'index.md' || page.path.endsWith('/index.md')) continue;
    const alias = await readFile(join(output, page.path.replace(/\.md$/, '/index.html')), 'utf8');
    assert.equal(alias, await htmlFor(page.path));
    assert.ok(alias.includes(`rel="canonical" href="https://docs.globalai.community${page.url}"`));
  }
  const config = await readFile(join(output, 'staticwebapp.config.json'), 'utf8');
  assert.ok(Buffer.byteLength(config) < 2048, 'Hosting config should not grow with the page count.');
  const paths = new Set(pages.keys());
  assert.equal(resolveLink('../branding/index.md#colors', 'agentcon/index.md', paths), '/branding/#colors');
  assert.equal(resolveLink('/public/azure-classroom/001.png', 'chapter-benefits/azure-client.md', paths), '/azure-classroom/001.png');
  assert.equal(resolveLink('https://example.com/demo.md?q=1#x', 'index.md', paths), 'https://example.com/demo.md?q=1#x');
});

test('existing and renamed section anchors stay usable', async () => {
  const requirements = await htmlFor('chapter-playbook/requirements.md');
  assert.match(requirements, /id="what-happens-if-requirements-aren-t-met"/);
  assert.match(await htmlFor('chapter-playbook/index.md'), /id="quick-reference"/);
  assert.match(await htmlFor('branding/index.md'), /id="primary-colors"/);
  for (const page of pages.values()) {
    for (const heading of page.headings) {
      assert.ok(heading.id, `${page.path}: missing heading id`);
    }
  }
});

test('the partner landing page keeps its URL, anchors, terms and contact routes without docs chrome', async () => {
  const cases = [
    ['partnerships/overview.md', ['partner-with-the-global-ai-community', 'our-community-ecosystem', 'partnership-levels', 'community-partner', 'partner', 'strategic-partner', 'event-sponsorship', 'agentcon-2027-sponsorship', 'global-ai-conference-2027-sponsorship', 'expose-your-products-and-services', 'why-partner-with-the-global-ai-community', 'pricing', 'interested']],
  ];
  for (const [path, anchors] of cases) {
    const html = await htmlFor(path);
    assert.match(html, /class="landing-page"/);
    assert.doesNotMatch(html, /class="docs-sidebar"|class="toc"|class="doc-meta"|class="next-page"/);
    assert.match(html, /href="mailto:hq@globalai\.community\?subject=/);
    for (const id of anchors) assert.ok(html.includes(`id="${id}"`), `${path}: ${id}`);
    for (const action of pages.get(path).data.actions) {
      assert.ok(pages.get(path).links.includes(action.href), 'Hero links must be validated.');
    }
  }
  const partner = await htmlFor(cases[0][0]);
  assert.match(partner, /<details class="review-notice" open>/);
  assert.match(partner, /€6,000/);
  assert.match(partner, /€500/);
  assert.doesNotMatch(partner, /250,000|70,000|50,000|200\+/);
  assert.match(partner, /href="https:\/\/globalaiconference\.city\/sponsor\.html"/);
  assert.match(await htmlFor('partnerships/strategic-partner.md'), /class="docs-sidebar"/);
});

test('the HQ-run Global AI Conference points to its website and old URLs redirect', async () => {
  const current = [...pages.values()].filter(page => metadataFor(page.path).status === 'current');
  const allowed = new Set(['agentcon/index.md', 'conference.md', 'hq-organized-events.md', 'event-format.md', 'events.md', 'global-ai-conference/index.md']);
  for (const page of current) {
    if (!allowed.has(page.path)) assert.doesNotMatch(page.plainText, /AgentCon/, page.path);
  }
  assert.deepEqual([...pages.keys()].filter(path => path.startsWith('agentcon/')), ['agentcon/index.md']);
  const agentcon = pages.get('agentcon/index.md');
  assert.match(agentcon.plainText, /AGNTCON/);
  assert.match(agentcon.plainText, /AgentCon Singapore on 5 November 2026 is the final AgentCon event/);
  assert.ok(agentcon.links.includes('/conference.html'));
  const yearRound = navigation.events.find(([label]) => label === 'Year-round events')[1];
  assert.ok(yearRound.includes('conference.md') && yearRound.includes('agentcon/index.md'));
  const conference = pages.get('conference.md');
  assert.ok(conference.links.includes('/agentcon/'));
  for (const href of ['https://globalaiconference.city/', 'https://globalaiconference.city/sponsor.html', '/global-ai-conference/']) {
    assert.ok(conference.links.includes(href), href);
  }
  for (const [from, to] of Object.entries(redirects)) {
    const target = to.startsWith('https://') ? to : pathToUrl(to);
    for (const file of [from.replace(/\.md$/, '.html'), from.replace(/\.md$/, '/index.html')]) {
      const html = await readFile(join(output, file), 'utf8');
      assert.ok(html.includes(`url=${target}"`), file);
      assert.match(html, /name="robots" content="noindex,follow"/, file);
    }
  }
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('/agentcon/events.html') && !sitemap.includes('agentcon-sponsorship'));
  const connect = await htmlFor('global-ai-conference/index.md');
  assert.match(connect, /Global AI Community Connect Organizer Guide/);
  assert.match(connect, /id="the-global-ai-conference-organizer-guide"/);
  assert.match(await htmlFor('chapter-leads-meeting/february-2026.md'), /AgentCon/);
});

test('search excludes private-discovery pages and drafts, with archives opt-in', async () => {
  const json = await readFile(join(output, 'assets/search-index.json'), 'utf8');
  const index = MiniSearch.loadJSON(json, searchOptions);
  for (const path of ['payment.md', 'partnerships/partnership-proposal.md', 'chapter-playbook/offboarding.md', 'chapter-playbook/transferring.md', 'platform-event-management.md']) {
    assert.equal(index.has(path), false, path);
  }
  const current = index.search('AgentCamp', { filter: result => result.status === 'current' });
  assert.ok(current.every(result => result.status === 'current'));
  assert.ok(index.search('AgentCamp').some(result => result.id === 'agentcamp/register.md'));
  assert.ok(index.search('Azure credits', { filter: result => result.section === 'resources' }).some(result => result.id === 'chapter-benefits/azure.md'));
  assert.ok(index.search('sponsorship').some(result => result.id === 'partnerships/overview.md'));
});

test('robots, sitemap and agent index preserve discovery exclusions', async () => {
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
  const llms = await readFile(join(output, 'llms.txt'), 'utf8');
  for (const path of ['payment.md', 'partnerships/partnership-proposal.md', 'chapter-playbook/offboarding.md', 'agentcamp/register.md']) {
    assert.match(await htmlFor(path), /name="robots" content="noindex,/);
    assert.ok(!sitemap.includes(pathToUrl(path)), path);
    assert.ok(!llms.includes(pathToUrl(path)), path);
  }
  assert.match(await htmlFor('payment.md'), /name="robots" content="noindex, nofollow"/);
});

test('archived offers, meeting recaps, drafts and contradictory guidance are visibly labeled', async () => {
  assert.match(await htmlFor('build/reimbursement.md'), /Archived edition/);
  assert.match(await htmlFor('agentcamp/register.md'), /Archived edition/);
  assert.match(await htmlFor('chapter-leads-meeting/january-2026.md'), /Meeting archive/);
  assert.match(await htmlFor('chapter-playbook/offboarding.md'), /Draft · not approved policy/);
  assert.match(await htmlFor('chapter-playbook/onboarding.md'), /different application forms/);
  assert.equal(metadataFor('agentcamp/index.md').status, 'current');
  assert.equal(metadataFor('agentcamp/register.md').status, 'archived');
  assert.throws(() => metadataFor('unclassified.md'), /Assign a section/);
});

test('current chat guidance distinguishes community Discord from internal Slack access', async () => {
  const discord = pages.get('chapter-playbook/discord.md');
  assert.match(discord.plainText, /Discord is now the primary place/);
  for (const purpose of ['general chapter support', 'Global AI Conference organizer coordination', 'Global AI Community Connect organizer coordination', 'Advisory Board work', 'StreamYard access']) {
    assert.ok(discord.plainText.includes(purpose), purpose);
  }
  for (const [path, contact] of [
    ['global-ai-conference/eligibility-and-roles.md', 'hq@globalai.community'],
    ['global-ai-conference/application-and-timeline.md', 'hq@globalai.community'],
    ['chapter-playbook/advisory-board.md', 'hello@globalai.community'],
    ['streamyard.md', 'support@globalai.community'],
  ]) {
    const page = pages.get(path);
    assert.match(page.plainText, /private|restricted/i, path);
    assert.ok(page.links.includes(`mailto:${contact}`), path);
    assert.ok(page.links.includes('/chapter-playbook/discord.html#discord-and-internal-slack'), path);
    assert.ok(!metadataFor(path).review.some(note => note.includes('whether this program retains')), path);
  }
  const formats = pages.get('event-format.md');
  assert.ok(formats.links.includes('https://gaic.io/discord'));
  assert.match(metadataFor('streamyard.md').review.join(' '), /retired Umbraco dashboard/);
  assert.match(metadataFor('global-ai-conference/application-and-timeline.md').review.join(' '), /application form is not linked/);
});

test('StreamYard access instructions keep login details private and preserve access anchors', async () => {
  const page = pages.get('streamyard.md');
  assert.match(page.plainText, /Global AI chapter email address only/);
  assert.match(page.plainText, /Slack workspace access if needed/);
  assert.match(page.plainText, /login details supplied privately by support/);
  assert.doesNotMatch(page.content, /stream@globalai\.community|streamyard-sample-pin\.png|streamyard-pin-channel\.png/);
  const html = await htmlFor('streamyard.md');
  assert.match(html, /id="how-to-get-access-to-the-streamyard-pin-channel"/);
  assert.match(html, /id="logging-in-to-streamyard"/);
  assert.match(pages.get('chapter-leads-meeting/january-2026.md').content, /Slack will remain active only until \*\*February 28th\*\*/);
});

test('Markdown renders nested details, notices, alerts, badges and responsive tables', async () => {
  const renderer = createMarkdown(new Set(['sample.md']));
  const page = renderer.render(`# Test

:::: details Currency
::: danger Important
Do not add an intermediary.
:::
::::

> [!TIP]
> Useful advice.

## Policy <Badge type="warning" text="Draft" />

| A | B |
| --- | --- |
| One | Two |
`, 'sample.md');
  assert.match(page.html, /<details class="disclosure"><summary>Currency<\/summary>/);
  assert.match(page.html, /notice-danger/);
  assert.match(page.html, /notice-tip/);
  assert.match(page.html, /<span class="badge">Draft<\/span>/);
  assert.equal(page.headings[1].id, 'policy');
  assert.match(page.html, /class="table-scroll" role="region"/);
  const payment = await htmlFor('payment.md');
  assert.equal([...payment.matchAll(/<details class="disclosure">/g)].length, 2);
  assert.match(payment, /notice-danger/);
  const faq = await htmlFor('agentcamp/faq.md');
  assert.equal([...faq.matchAll(/<details class="disclosure">/g)].length, 8);
});

test('malformed metadata and broken internal links fail explicitly', async () => {
  assert.throws(() => readFrontmatter('---\n- invalid\n---\n# Title'), /mapping/);
  const broken = new Map([['test.md', { path: 'test.md', url: '/test.html', headings: [], links: ['/missing.html'] }]]);
  await assert.rejects(validateLinks(broken), /missing target/);
  broken.get('test.md').links = ['/test.html#missing-heading'];
  await assert.rejects(validateLinks(broken), /missing heading/);
});

test('brand typography, asset licenses and local font files ship with the site', async () => {
  const brand = await htmlFor('branding/index.md');
  assert.match(brand, /Space Grotesk/);
  assert.match(brand, /Instrument Sans/);
  assert.doesNotMatch(brand, /Lufga|Montserrat/);
  const css = await readFile(join(output, 'assets/styles.css'), 'utf8');
  assert.doesNotMatch(css, /fonts\.googleapis/);
  for (const font of ['space-grotesk', 'instrument-sans']) {
    assert.ok((await stat(join(output, `assets/${font}-latin.woff2`))).size > 1000);
    assert.match(await readFile(join(output, `assets/${font}-LICENSE.txt`), 'utf8'), /SIL OPEN FONT LICENSE/i);
  }
  await stat(join(output, 'assets/minisearch-LICENSE.txt'));
});

test('the events landing page offers seasonal, year-round and organizer blocks', async () => {
  const page = pages.get('events.md');
  assert.equal(page.data.layout, 'landing');
  assert.equal(page.url, '/events.html');
  for (const heading of ['Seasonal events', 'Year-round events', 'Organizer guide']) {
    assert.ok(page.headings.some(item => item.text === heading), heading);
  }
  for (const link of ['/agentic-nights.html', '/agentcamp/', '/global-ai-conference/', '/organisers-101/', '/event-format.html']) {
    assert.ok(page.links.some(href => href.startsWith(link)), link);
  }
  assert.ok(navigation.events[0][1].includes('events.md'));
});
