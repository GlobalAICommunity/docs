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

const cityLogo = document.querySelector('[data-city-logo]');
if (cityLogo) {
  const input = cityLogo.querySelector('input[name="city"]');
  const preview = cityLogo.querySelector('.logo-generator-preview');
  const status = cityLogo.querySelector('.logo-generator-status');
  const buttons = cityLogo.querySelectorAll('button[data-format]');
  // Measured from the official chapter logos: Space Grotesk Regular, tracked -0.01em.
  const layout = { size: 54.92, x: 96.02, baseline: 87.97, tracking: -0.01, width: 551.65, height: 100.71, margin: 3.27 };
  let data;
  let current;
  const escape = value => value.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
  const fixed = value => +value.toFixed(2);
  const outline = (path, offset, scale) => path.replace(/([MLQCZ])([^MLQCZ]*)/g, (_, command, numbers) => command + numbers.trim().split(' ').filter(Boolean).map((value, index) => fixed(index % 2 ? layout.baseline + value * scale : offset + value * scale)).join(' '));
  const variant = () => cityLogo.querySelector('input[name="variant"]:checked').value;
  const slug = city => city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const render = () => {
    const city = input.value.trim().replace(/\s+/g, ' ');
    const text = city || 'Your city';
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
    const label = escape(`Global AI Community ${text}`);
    const name = variant();
    current = city && {
      file: `global-ai-community-${slug(city) || 'chapter'}${name === 'color' ? '' : `-${name}`}`,
      width,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${layout.height}" width="${width}" height="${layout.height}" role="img" aria-label="${label}"><title>${label}</title>${data.variants[name].replace(' d=""', ` d="${d}"`)}</svg>`
    };
    preview.innerHTML = current ? current.svg : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${layout.height}" aria-hidden="true">${data.variants[name].replace(' d=""', ` d="${d}"`)}</svg>`;
    preview.classList.toggle('is-placeholder', !city);
    preview.classList.toggle('is-dark', name === 'reversed' || name === 'mono-white');
    buttons.forEach(button => { button.disabled = !city; });
    status.textContent = missing.size ? `Not available in Space Grotesk and left out: ${[...missing].join(' ')}` : '';
  };
  const download = (href, name) => {
    const link = Object.assign(document.createElement('a'), { href, download: name });
    link.click();
  };
  cityLogo.addEventListener('input', () => data && render());
  cityLogo.addEventListener('click', event => {
    const format = event.target.closest('button[data-format]')?.dataset.format;
    if (!format || !current) return;
    const url = URL.createObjectURL(new Blob([current.svg], { type: 'image/svg+xml' }));
    if (format === 'svg') {
      download(url, `${current.file}.svg`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
    const image = new Image();
    image.onload = () => {
      const canvas = Object.assign(document.createElement('canvas'), { width: 2400, height: Math.round(2400 * layout.height / current.width) });
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        const png = URL.createObjectURL(blob);
        download(png, `${current.file}.png`);
        setTimeout(() => URL.revokeObjectURL(png), 1000);
      });
    };
    image.src = url;
  });
  fetch('/logos/gaic/city-logo-glyphs.json').then(response => response.json()).then(json => {
    data = json;
    cityLogo.classList.add('is-ready');
    render();
  }).catch(() => { status.textContent = 'The logo generator could not load. Download a logo above or ask support@globalai.community.'; });
}
