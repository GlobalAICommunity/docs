import { readdir, readFile, writeFile, mkdir, cp, rm, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import MiniSearch from 'minisearch';
import { directories, metadataFor, pathToUrl, site } from '../web/content.mjs';
import { createMarkdown, readFrontmatter, escapeHtml } from './markdown.mjs';
import { homePage, documentPage, searchPage, notFoundPage } from '../web/templates.mjs';
import { searchOptions } from '../web/search-options.js';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const output = join(root, 'dist');
export { searchOptions };

export async function contentPaths(directory = root) {
  const paths = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isFile() && entry.name.endsWith('.md') && !['README.md', 'AGENTS.md'].includes(entry.name)) {
      paths.push(join(directory, entry.name).slice(root.length + 1));
    } else if (entry.isDirectory() && (directory !== root || entry.name in directories)) {
      paths.push(...await contentPaths(join(directory, entry.name)));
    }
  }
  return paths;
}

async function writeOutput(path, content) {
  const destination = join(output, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content);
}

export async function loadPages() {
  const paths = await contentPaths();
  const knownPaths = new Set(paths);
  const renderer = createMarkdown(knownPaths);
  const pages = new Map();
  for (const path of paths) {
    const { data, content } = readFrontmatter(await readFile(join(root, path), 'utf8'));
    const metadata = metadataFor(path);
    const rendered = renderer.render(content, path);
    const title = metadata.title ?? data.title ?? rendered.headings.find(heading => heading.level === 1)?.text;
    if (typeof title !== 'string' || !title.trim()) throw new Error(`Missing or invalid page title: ${path}`);
    const plainText = renderer.plainText(content);
    const description = metadata.summary ?? data.description ?? rendered.intro ?? title;
    if (typeof description !== 'string') throw new Error(`Description must be text: ${path}`);
    const summary = description.length > 190 ? description.slice(0, 187).replace(/\s+\S*$/, '') + '…' : description;
    const explicitRobots = data.head?.find(([tag, attributes]) => tag === 'meta' && attributes?.name === 'robots')?.[1]?.content;
    const searchable = data.search !== false && !explicitRobots?.includes('noindex') && metadata.status !== 'draft';
    const robots = explicitRobots ?? (metadata.status === 'current' ? 'index,follow' : 'noindex,follow');
    pages.set(path, { ...metadata, ...rendered, path, url: pathToUrl(path), title, summary, data, content, plainText, searchable, robots });
  }
  return pages;
}

export async function validateLinks(pages) {
  const byUrl = new Map([...pages.values()].map(page => [page.url, page]));
  const errors = [];
  for (const page of pages.values()) {
    for (const href of page.links) {
      if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
      const url = new URL(href, `${site.origin}${page.url}`);
      const target = byUrl.get(url.pathname);
      if (target) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (fragment && !target.headings.some(heading => heading.id === fragment) && !target.headingAliases?.[fragment]) {
          errors.push(`${page.path}: missing heading ${href}`);
        }
      } else {
        const filePath = join(output, decodeURIComponent(url.pathname));
        try {
          const entry = await stat(filePath);
          if (entry.isDirectory()) await stat(join(filePath, 'index.html'));
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          errors.push(`${page.path}: missing target ${href}`);
        }
      }
    }
  }
  if (errors.length) throw new Error(`Broken local links:\n${[...new Set(errors)].join('\n')}`);
}

export async function build() {
  const pages = await loadPages();
  // dist is the dedicated generated output, never a content directory.
  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, 'assets'), { recursive: true });
  await cp(join(root, 'public'), output, { recursive: true });
  await cp(join(root, 'media'), join(output, 'media'), { recursive: true });
  await cp(join(root, 'agentcamp/screenshots'), join(output, 'agentcamp/screenshots'), { recursive: true });
  await cp(join(root, 'web/styles.css'), join(output, 'assets/styles.css'));
  await cp(join(root, 'web/app.js'), join(output, 'assets/app.js'));
  await cp(join(root, 'web/search-options.js'), join(output, 'assets/search-options.js'));
  await cp(join(root, 'node_modules/minisearch/dist/es/index.js'), join(output, 'assets/minisearch.js'));
  for (const font of ['space-grotesk', 'instrument-sans']) {
    await cp(join(root, `node_modules/@fontsource-variable/${font}/files/${font}-latin-wght-normal.woff2`), join(output, `assets/${font}-latin.woff2`));
    await cp(join(root, `node_modules/@fontsource-variable/${font}/LICENSE`), join(output, `assets/${font}-LICENSE.txt`));
  }
  await cp(join(root, 'node_modules/minisearch/LICENSE.txt'), join(output, 'assets/minisearch-LICENSE.txt'));
  for (const page of pages.values()) {
    const path = page.path.replace(/\.md$/, '.html');
    const html = page.path === 'index.md' ? homePage(page) : documentPage(page, pages);
    await writeOutput(path, html);
    // Directory aliases preserve clean URLs on static hosts without per-page routing rules.
    if (page.path !== 'index.md' && !page.path.endsWith('/index.md')) await writeOutput(page.path.replace(/\.md$/, '/index.html'), html);
  }
  await writeOutput('search.html', searchPage());
  await writeOutput('404.html', notFoundPage());
  const index = new MiniSearch(searchOptions);
  index.addAll([...pages.values()].filter(page => page.searchable && page.path !== 'index.md').map(page => ({
    id: page.path, title: page.title, headings: page.headings.map(heading => heading.text).join(' '),
    text: page.plainText, summary: page.summary, url: page.url, section: page.section, status: page.status, needsReview: page.review.length > 0,
  })));
  await writeOutput('assets/search-index.json', JSON.stringify(index));
  const publicPages = [...pages.values()].filter(page => page.searchable && !page.robots.includes('noindex'));
  await writeOutput('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPages.map(page => `<url><loc>${escapeHtml(site.origin + page.url)}</loc></url>`).join('')}</urlset>`);
  await writeOutput('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
  await writeOutput('llms.txt', `# ${site.name}\n\nGuidance for chapter leads, event organizers, and partners. Pages marked for confirmation contain unresolved guidance; do not infer policy. Historical editions and unapproved drafts are not current policy.\n\n${publicPages.map(page => `- [${page.title}](${site.origin}${page.url}): ${page.review.length ? '[Needs confirmation] ' : ''}${page.summary}`).join('\n')}\n`);
  await writeOutput('staticwebapp.config.json', JSON.stringify({
    responseOverrides: { 404: { rewrite: '/404.html' } },
    globalHeaders: { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' },
    mimeTypes: { '.woff2': 'font/woff2' },
  }, null, 2));
  await validateLinks(pages);
  console.log(`Built ${pages.size} Markdown pages, search, sitemap, clean-URL aliases, and assets in dist/.`);
  return pages;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await build();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
