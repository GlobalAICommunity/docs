const movedAnchors = document.querySelector('[data-moved-anchors]');
if (movedAnchors && location.hash) {
  const target = JSON.parse(movedAnchors.dataset.movedAnchors)[decodeURIComponent(location.hash.slice(1))];
  if (target) location.replace(target);
}

const sectionMenu = document.querySelector('.section-menu');
if (sectionMenu) {
  const mobile = window.matchMedia('(max-width: 850px)');
  const updateMenu = () => { sectionMenu.open = !mobile.matches; };
  updateMenu();
  mobile.addEventListener('change', updateMenu);
}

document.addEventListener('keydown', event => {
  const target = event.target;
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey &&
      target instanceof HTMLElement && !target.closest('input, textarea, select, [contenteditable="true"]')) {
    event.preventDefault();
    const input = document.querySelector('input[type="search"]');
    if (input) input.focus();
    else window.location.assign('/search.html');
  }
  if (event.key === 'Escape') {
    const menu = document.querySelector('.mobile-menu[open]');
    if (menu) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  }
});

for (const button of document.querySelectorAll('.copy-code')) {
  if (!navigator.clipboard) continue;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.parentElement.querySelector('code').textContent);
      button.textContent = 'Copied';
    } catch (error) {
      console.error('Could not copy code:', error);
      button.textContent = 'Copy failed';
    }
    setTimeout(() => { button.textContent = 'Copy'; }, 2500);
  });
}

const results = document.getElementById('search-results');
if (results) {
  const input = document.getElementById('search-query');
  const section = document.getElementById('search-section');
  const archives = document.getElementById('include-archives');
  const status = document.getElementById('search-status');
  const form = input.closest('form');
  const labels = { chapters: 'Chapters', events: 'Events', brand: 'Brand', partners: 'Partners', updates: 'Updates & archive' };
  let searchIndex;
  let request = 0;
  let timer;
  let indexLoading;

  async function loadIndex() {
    if (searchIndex) return searchIndex;
    if (!indexLoading) {
      indexLoading = Promise.all([
        import('/assets/minisearch.js'),
        import('/assets/search-options.js'),
        fetch('/assets/search-index.json').then(response => {
          if (!response.ok) throw new Error(`Search index returned ${response.status}`);
          return response.text();
        }),
      ]).then(([{ default: MiniSearch }, { searchOptions }, json]) => {
        searchIndex = MiniSearch.loadJSON(json, searchOptions);
        return searchIndex;
      }).catch(error => {
        indexLoading = undefined;
        throw error;
      });
    }
    return indexLoading;
  }

  function restoreQuery() {
    const params = new URLSearchParams(window.location.search);
    input.value = params.get('q') ?? '';
    section.value = params.get('section') ?? '';
    archives.checked = params.get('archives') === '1';
  }

  async function search(updateUrl = true) {
    const currentRequest = ++request;
    const query = input.value.trim();
    if (updateUrl) {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (section.value) params.set('section', section.value);
      if (archives.checked) params.set('archives', '1');
      history.replaceState(null, '', '/search.html' + (params.size ? '?' + params : ''));
    }
    results.replaceChildren();
    if (!query) {
      status.textContent = 'Search by task, tool, event, or question.';
      return;
    }
    status.textContent = 'Searching the handbook…';
    try {
      const index = await loadIndex();
      if (currentRequest !== request) return;
      const matches = index.search(query, {
        filter: result => (archives.checked || result.status === 'current') && (!section.value || result.section === section.value),
      });
      const shown = matches.slice(0, 30);
      status.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for “${query}”${matches.length > 30 ? '. Showing the first 30; add a section filter to narrow your search.' : ''}`
        : `No results for “${query}”. Try a shorter phrase, a tool name, or include the archives.`;
      for (const match of shown) {
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = match.url;
        const label = document.createElement('span');
        label.className = 'result-label';
        label.textContent = `${labels[match.section]}${match.status === 'current' ? '' : ' · Archive'}${match.needsReview ? ' · Needs confirmation' : ''}`;
        const title = document.createElement('h2');
        title.textContent = match.title;
        const summary = document.createElement('p');
        summary.textContent = match.summary;
        link.append(label, title, summary);
        results.append(link);
      }
    } catch (error) {
      if (currentRequest !== request) return;
      console.error('Handbook search failed:', error);
      status.textContent = 'Search could not load. Retry, or browse using the section navigation.';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'button button-ink';
      retry.textContent = 'Retry search';
      retry.addEventListener('click', () => search(false));
      results.append(retry);
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); search(); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => search(), 180); });
  section.addEventListener('change', () => search());
  archives.addEventListener('change', () => search());
  window.addEventListener('popstate', () => { restoreQuery(); search(false); });
  restoreQuery();
  search(false);
}

// Measured from the official chapter logos: Space Grotesk Regular, tracked -0.01em.
const logoLayout = { size: 54.92, x: 96.02, baseline: 87.97, tracking: -0.01, width: 551.65, height: 100.71, margin: 3.27 };
let logoData;
const loadLogoData = () => logoData ||= fetch('/logos/gaic/city-logo-glyphs.json').then(response => {
  if (!response.ok) throw new Error('Glyphs unavailable');
  return response.json();
});
const escapeXml = value => value.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
const fileSlug = (value, separator = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, separator).replace(/^-+|-+$/g, '');
const buildCityLogo = (data, text, name) => {
  const layout = logoLayout;
  const fixed = value => +value.toFixed(2);
  const outline = (path, offset, scale) => path.replace(/([MLQCZ])([^MLQCZ]*)/g, (_, command, numbers) => command + numbers.trim().split(' ').filter(Boolean).map((value, index) => fixed(index % 2 ? layout.baseline + value * scale : offset + value * scale)).join(' '));
  const scale = layout.size / data.unitsPerEm;
  const missing = new Set();
  let pen = 0;
  let previous = '';
  let d = '';
  for (const char of text) {
    const glyph = data.glyphs[char];
    if (!glyph) { missing.add(char); continue; }
    if (previous) pen += data.kerning[previous + char] || 0;
    d += outline(glyph[1], layout.x + pen * scale, scale);
    pen += glyph[0] + layout.tracking * data.unitsPerEm;
    previous = char;
  }
  const width = fixed(Math.max(layout.width, layout.x + pen * scale + layout.margin));
  const label = escapeXml(`Global AI Community ${text}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${layout.height}" width="${width}" height="${layout.height}" role="img" aria-label="${label}"><title>${label}</title>${data.variants[name].replace(' d=""', ` d="${d}"`)}</svg>`;
  return { svg, width, height: layout.height, missing };
};
const downloadFile = (href, name) => {
  const link = Object.assign(document.createElement('a'), { href, download: name });
  link.click();
};
const downloadBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);
  downloadFile(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

const cityLogo = document.querySelector('[data-city-logo]');
if (cityLogo) {
  const input = cityLogo.querySelector('input[name="city"]');
  const preview = cityLogo.querySelector('.logo-generator-preview');
  const status = cityLogo.querySelector('.logo-generator-status');
  const buttons = cityLogo.querySelectorAll('button[data-format]');
  let data;
  let current;
  const variant = () => cityLogo.querySelector('input[name="variant"]:checked').value;
  const render = () => {
    const city = input.value.trim().replace(/\s+/g, ' ');
    const name = variant();
    const logo = buildCityLogo(data, city || 'Your city', name);
    current = city && { ...logo, file: `global-ai-community-${fileSlug(city) || 'chapter'}${name === 'color' ? '' : `-${name}`}` };
    preview.innerHTML = logo.svg;
    if (!city) preview.firstElementChild.setAttribute('aria-hidden', 'true');
    preview.classList.toggle('is-placeholder', !city);
    preview.classList.toggle('is-dark', name === 'reversed' || name === 'mono-white');
    buttons.forEach(button => { button.disabled = !city; });
    status.textContent = logo.missing.size ? `Not available in Space Grotesk and left out: ${[...logo.missing].join(' ')}` : '';
  };
  cityLogo.addEventListener('input', () => data && render());
  cityLogo.addEventListener('click', async event => {
    const format = event.target.closest('button[data-format]')?.dataset.format;
    if (!format || !current) return;
    const blob = new Blob([current.svg], { type: 'image/svg+xml' });
    if (format === 'svg') return downloadBlob(blob, `${current.file}.svg`);
    const url = URL.createObjectURL(blob);
    const image = await loadImage(url);
    const canvas = Object.assign(document.createElement('canvas'), { width: 2400, height: Math.round(2400 * current.height / current.width) });
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(png => downloadBlob(png, `${current.file}.png`));
  });
  loadLogoData().then(json => {
    data = json;
    cityLogo.classList.add('is-ready');
    render();
  }).catch(() => { status.textContent = 'The logo generator could not load. Download a logo above or ask support@globalai.community.'; });
}

const eventBanner = document.querySelector('[data-event-banner]');
if (eventBanner) {
  const size = 1080;
  const pad = 84;
  const form = eventBanner.querySelector('form');
  const canvas = eventBanner.querySelector('canvas');
  const status = eventBanner.querySelector('.logo-generator-status');
  const button = eventBanner.querySelector('button[data-download]');
  const context = canvas.getContext('2d');
  const themes = {
    light: { background: '#f5f4ec', text: '#16130e', muted: '#6e6759', accent: '#b8431f', line: '#dcd8cc', logo: 'color' },
    dark: { background: '#16130e', text: '#f5f4ec', muted: '#c9c3b5', accent: '#e8693f', line: '#3a352c', logo: 'reversed' },
  };
  let data;
  let photo;
  let logoCache = {};
  let rendering = 0;
  const value = name => form.elements[name].value.trim().replace(/\s+/g, ' ');
  const wrap = (text, maxWidth) => {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };
  const fitTitle = (text, maxWidth, maxHeight, largest, smallest) => {
    for (let fontSize = largest; fontSize >= smallest; fontSize -= 4) {
      context.font = `600 ${fontSize}px "Space Grotesk"`;
      const lines = wrap(text, maxWidth);
      const lineHeight = fontSize * 1.06;
      if (lines.length * lineHeight <= maxHeight && lines.every(line => context.measureText(line).width <= maxWidth)) return { fontSize, lines, lineHeight };
    }
    context.font = `600 ${smallest}px "Space Grotesk"`;
    const lineHeight = smallest * 1.06;
    return { fontSize: smallest, lines: wrap(text, maxWidth).slice(0, Math.floor(maxHeight / lineHeight)), lineHeight };
  };
  const ellipsize = (text, maxWidth) => {
    if (context.measureText(text).width <= maxWidth) return text;
    while (text && context.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
    return `${text.trimEnd()}…`;
  };
  const logoImage = async (city, name) => {
    const key = `${city}|${name}`;
    if (!logoCache[key]) {
      const logo = buildCityLogo(data, city, name);
      const url = URL.createObjectURL(new Blob([logo.svg], { type: 'image/svg+xml' }));
      logoCache = { [key]: { logo, image: await loadImage(url) } };
      URL.revokeObjectURL(url);
    }
    return logoCache[key];
  };
  const coverPhoto = (x, y, width, height, radius) => {
    const scale = Math.max(width / photo.width, height / photo.height);
    const drawWidth = photo.width * scale;
    const drawHeight = photo.height * scale;
    context.save();
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.clip();
    context.drawImage(photo, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
    context.restore();
  };
  const render = async () => {
    const run = ++rendering;
    const theme = themes[form.elements.theme.value];
    const city = value('city');
    const program = value('program');
    const title = value('title') || 'Your event title';
    const when = [value('date'), value('time')].filter(Boolean).join(' · ');
    const venue = value('venue');
    const { logo, image } = await logoImage(city || 'Your city', theme.logo);
    if (run !== rendering) return;
    const contentWidth = size - pad * 2;
    context.fillStyle = theme.background;
    context.fillRect(0, 0, size, size);

    const logoHeight = Math.min(92, contentWidth * logo.height / logo.width);
    context.drawImage(image, pad, pad, logoHeight * logo.width / logo.height, logoHeight);

    const footerTop = size - pad - 112;
    let top = pad + logoHeight + 56;
    if (photo) {
      coverPhoto(pad, top, contentWidth, 330, 28);
      top += 330 + 52;
    } else top += 80;

    context.textBaseline = 'alphabetic';
    if (program) {
      context.font = '600 28px "Instrument Sans"';
      context.letterSpacing = '4px';
      context.fillStyle = theme.accent;
      context.fillText(ellipsize(program.toUpperCase(), contentWidth), pad, top + 26);
      context.letterSpacing = '0px';
      top += 26 + 30;
    }
    const titleSpace = footerTop - 40 - top;
    const { fontSize, lines, lineHeight } = fitTitle(title, contentWidth, titleSpace, photo ? 76 : 112, 44);
    context.font = `600 ${fontSize}px "Space Grotesk"`;
    context.letterSpacing = `${-fontSize * 0.03}px`;
    context.fillStyle = value('title') ? theme.text : theme.muted;
    lines.forEach((line, index) => context.fillText(line, pad, top + fontSize * 0.86 + index * lineHeight));
    context.letterSpacing = '0px';

    context.fillStyle = theme.line;
    context.fillRect(pad, footerTop, contentWidth, 2);
    context.fillStyle = theme.text;
    context.font = '600 36px "Space Grotesk"';
    context.fillText(ellipsize(when || 'Date · Time', contentWidth), pad, footerTop + 58);
    context.fillStyle = theme.muted;
    context.font = '400 30px "Instrument Sans"';
    context.fillText(ellipsize(venue || 'Venue', contentWidth), pad, footerTop + 104);

    const missing = [...logo.missing];
    status.textContent = missing.length ? `Not available in Space Grotesk and left out of the logo: ${missing.join(' ')}` : '';
    button.disabled = !(city && value('title'));
  };
  const update = () => data && render();
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    if (event.target.name !== 'photo') update();
  });
  form.elements.photo.addEventListener('change', async () => {
    const file = form.elements.photo.files[0];
    if (!file) { photo = undefined; return update(); }
    const url = URL.createObjectURL(file);
    try {
      photo = await loadImage(url);
    } catch {
      photo = undefined;
      status.textContent = 'That photo could not be read. Try a JPG or PNG.';
    }
    URL.revokeObjectURL(url);
    update();
  });
  eventBanner.querySelector('button[data-clear-photo]').addEventListener('click', () => {
    form.elements.photo.value = '';
    photo = undefined;
    update();
  });
  button.addEventListener('click', () => {
    const name = ['global-ai', fileSlug(value('city'), '-'), fileSlug(value('title'), '-')].filter(Boolean).join('-');
    canvas.toBlob(blob => downloadBlob(blob, `${name}-1x1.png`));
  });
  Promise.all([
    loadLogoData(),
    document.fonts.load('600 40px "Space Grotesk"'),
    document.fonts.load('400 30px "Instrument Sans"'),
    document.fonts.load('600 28px "Instrument Sans"'),
  ]).then(([json]) => {
    data = json;
    eventBanner.classList.add('is-ready');
    render();
  }).catch(() => { status.textContent = 'The banner generator could not load. Ask support@globalai.community for help.'; });
}
