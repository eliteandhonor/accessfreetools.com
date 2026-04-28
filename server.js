'use strict';

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tools', (_req, res) => {
  res.json([
    { id: 'base64',       name: 'Base64 Encoder / Decoder',   path: '/tools/base64.html' },
    { id: 'url',          name: 'URL Encoder / Decoder',       path: '/tools/url.html' },
    { id: 'json',         name: 'JSON Formatter',              path: '/tools/json.html' },
    { id: 'password',     name: 'Password Generator',          path: '/tools/password.html' },
    { id: 'word-count',   name: 'Word Counter',                path: '/tools/word-count.html' },
    { id: 'case',         name: 'Text Case Converter',         path: '/tools/case.html' },
  ]);
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`accessfreetools.com server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
