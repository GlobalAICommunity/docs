import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';
import { slugify } from '@mdit-vue/shared';
import { parse } from 'yaml';
import { posix } from 'node:path';
import { pathToUrl } from '../web/content.mjs';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function readFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { data: {}, content: source };
  const data = parse(match[1]) ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a YAML mapping.');
  return { data, content: source.slice(match[0].length) };
}

export function resolveLink(href, sourcePath, knownPaths) {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathname = decodeURIComponent(match[1]);
  const suffix = match[2];
  const normalized = posix.normalize(pathname.startsWith('/')
    ? pathname.slice(1) : posix.join(posix.dirname(sourcePath), pathname));
  const candidates = [normalized, normalized.replace(/\.html$/, '.md'), `${normalized}.md`,
    `${normalized.replace(/\/$/, '')}/index.md`];
  const target = candidates.find(candidate => knownPaths.has(candidate));
  if (target) return pathToUrl(target) + suffix;
  const asset = normalized.replace(/^public\//, '');
  return '/' + asset.split('/').map(encodeURIComponent).join('/') + suffix;
}

function prepareMarkdown(content) {
  return content.replace(/<Badge\s+([^>]+?)\s*\/>/g, (_, attributes) => {
    const text = attributes.match(/\btext="([^"]*)"/)?.[1] ?? '';
    return `<span class="badge">${escapeHtml(text)}</span>`;
  });
}

export function createMarkdown(knownPaths) {
  const markdown = new MarkdownIt({ html: true, linkify: true, typographer: false });
  const headingText = tokens => {
    let badge = false;
    return tokens.map(token => {
      if (token.type === 'html_inline' && token.content.startsWith('<span class="badge">')) badge = true;
      else if (badge && token.type === 'html_inline' && token.content === '</span>') badge = false;
      else if (!badge && ['text', 'code_inline'].includes(token.type)) return token.content;
      return '';
    }).join('').trim();
  };
  markdown.use(anchor, {
    slugify,
    getTokensText: headingText,
    callback: token => { token.attrSet('tabindex', '-1'); },
  });
  for (const kind of ['info', 'tip', 'warning', 'danger', 'details', 'note', 'important']) {
    markdown.use(container, kind, {
      render(tokens, index) {
        if (tokens[index].nesting === -1) return kind === 'details' ? '</details>\n' : '</aside>\n';
        const title = tokens[index].info.trim().slice(kind.length).trim();
        if (kind === 'details') return `<details class="disclosure"><summary>${escapeHtml(title || 'Details')}</summary>\n`;
        return `<aside class="notice notice-${kind}" aria-label="${escapeHtml(title || kind)}"><p class="notice-title">${escapeHtml(title || kind[0].toUpperCase() + kind.slice(1))}</p>\n`;
      },
    });
  }
  markdown.core.ruler.after('block', 'github-alerts', state => {
    for (let i = 0; i < state.tokens.length; i++) {
      if (state.tokens[i].type !== 'blockquote_open') continue;
      const inline = state.tokens[i + 2];
      const match = inline?.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\n|$)/);
      if (!match) continue;
      state.tokens[i].attrSet('class', `notice notice-${match[1].toLowerCase()}`);
      state.tokens[i].attrSet('aria-label', match[1].toLowerCase());
      inline.content = `**${match[1][0] + match[1].slice(1).toLowerCase()}**\n${inline.content.slice(match[0].length)}`;
    }
  });
  const linkOpen = markdown.renderer.rules.link_open ?? ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = resolveLink(token.attrGet('href'), env.path, knownPaths);
    token.attrSet('href', href);
    env.links.push(href);
    return linkOpen(tokens, index, options, env, self);
  };
  const image = markdown.renderer.rules.image;
  markdown.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const src = resolveLink(token.attrGet('src'), env.path, knownPaths);
    token.attrSet('src', src);
    token.attrSet('loading', 'lazy');
    env.links.push(src);
    return image(tokens, index, options, env, self);
  };
  markdown.renderer.rules.table_open = () => '<div class="table-scroll" role="region" aria-label="Scrollable table" tabindex="0"><table>\n';
  markdown.renderer.rules.table_close = () => '</table></div>\n';
  const fence = markdown.renderer.rules.fence;
  markdown.renderer.rules.fence = (tokens, index, options, env, self) =>
    `<div class="code-block"><button class="copy-code" type="button" hidden>Copy</button>${fence(tokens, index, options, env, self)}</div>`;
  return {
    render(content, path) {
      const env = { path, links: [] };
      const tokens = markdown.parse(prepareMarkdown(content), env);
      const headings = [];
      for (let index = 0; index < tokens.length; index++) {
        if (tokens[index].type === 'heading_open') {
          const token = tokens[index];
          const inline = tokens[index + 1];
          const text = headingText(inline.children);
          headings.push({ level: Number(token.tag.slice(1)), id: token.attrGet('id'), text });
        }
      }
      // The template owns the one page heading; retain its original anchor for inbound links.
      const firstHeading = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1');
      if (firstHeading !== -1) tokens.splice(firstHeading, 3);
      const html = markdown.renderer.render(tokens, markdown.options, env);
      const intro = tokens.flatMap((token, index) => token.type === 'paragraph_open' && token.level === 0
        ? [headingText(tokens[index + 1]?.children ?? [])] : []).find(Boolean);
      return { html, headings, links: env.links, intro };
    },
    plainText(content) {
      return markdown.render(prepareMarkdown(content), { path: 'index.md', links: [] }).replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]*>/g, ' ').replace(/&(?:amp|lt|gt|quot|#39);/g, ' ').replace(/\s+/g, ' ').trim();
    },
  };
}
