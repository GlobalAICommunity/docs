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
  const labels = { chapters: 'Chapters', events: 'Events', resources: 'Resources', partners: 'Partners', updates: 'Updates & archive' };
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
