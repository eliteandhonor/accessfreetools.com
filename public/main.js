'use strict';

document.getElementById('year').textContent = new Date().getFullYear();

const ICONS = {
  base64:       '🔐',
  url:          '🔗',
  json:         '{ }',
  password:     '🔑',
  'word-count': '📝',
  case:         'Aa',
};

fetch('/api/tools')
  .then((r) => r.json())
  .then((tools) => {
    const grid = document.getElementById('tools-grid');
    tools.forEach(({ id, name, path }) => {
      const a = document.createElement('a');
      a.className = 'tool-card';
      a.href = path;
      a.innerHTML = `<span class="icon">${ICONS[id] || '🛠️'}</span><span class="label">${name}</span>`;
      grid.appendChild(a);
    });
  })
  .catch(() => {
    document.getElementById('tools-grid').textContent = 'Could not load tools list.';
  });
