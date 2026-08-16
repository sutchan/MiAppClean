const https = require('https'), fs = require('fs');
const base = 'https://appclean.ewuse.com';
const local = {};
['index.html', 'prototype/app/app.state.js', 'prototype/app/render.js',
 'prototype/app/generate.js', 'prototype/app/app.ui.handlers.js',
 'prototype/app/app.ui.js'].forEach(f => {
  try { local[f] = fs.readFileSync(f, 'utf8'); } catch (e) { local[f] = ''; }
});
function get(p) {
  return new Promise(res => {
    const req = https.request(base + p, { method: 'GET', timeout: 12000, rejectUnauthorized: false }, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res([p, d]));
    });
    req.on('error', e => res([p, 'ERR ' + e.message]));
    req.on('timeout', () => { req.destroy(); res([p, 'TIMEOUT']); });
    req.end();
  });
}
const map = {
  '/': 'index.html',
  '/prototype/app/app.state.js': 'prototype/app/app.state.js',
  '/prototype/app/render.js': 'prototype/app/render.js',
  '/prototype/app/generate.js': 'prototype/app/generate.js',
  '/prototype/app/app.ui.handlers.js': 'prototype/app/app.ui.handlers.js',
  '/prototype/app/app.ui.js': 'prototype/app/app.ui.js'
};
Promise.all(Object.keys(map).map(get)).then(rs => {
  rs.forEach(([p, body]) => {
    const lf = map[p], l = local[lf] || '';
    const diff = body && l && body !== l;
    console.log('=== ' + p + ' 线上' + body.length + 'B / 本地' + l.length + 'B ' + (diff ? '[不同]' : (l ? '[一致]' : '[本地缺失]')));
    if (diff) {
      const bl = body.split('\n'), ll = l.split('\n'), n = Math.min(bl.length, ll.length);
      let shown = 0;
      for (let i = 0; i < n && shown < 25; i++) {
        if (bl[i] !== ll[i]) {
          console.log('  线上L' + (i + 1) + ': ' + bl[i].slice(0, 130));
          console.log('  本地L' + (i + 1) + ': ' + ll[i].slice(0, 130));
          shown++;
        }
      }
    }
  });
});
