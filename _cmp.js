const fs = require('fs');
const pairs = [
  ['_o_state.js', 'prototype/app/app.state.js'],
  ['_o_ui.js', 'prototype/app/app.ui.js'],
  ['_o_handlers.js', 'prototype/app/app.ui.handlers.js'],
  ['_o_render.js', 'prototype/app/render.js'],
  ['_o_share.js', 'prototype/app/app.share.js'],
  ['_online_index.html', 'index.html'],
];
for (const [on, lo] of pairs) {
  const o = fs.readFileSync(on, 'utf8');
  const l = fs.readFileSync(lo, 'utf8');
  const same = o === l;
  console.log(`\n=== ${lo}  线上${o.length}B / 本地${l.length}B  ${same ? '完全一致' : '【有差异】'}`);
  if (!same) {
    const ob = o.split('\n'), lb = l.split('\n');
    const n = Math.min(ob.length, lb.length);
    let shown = 0;
    for (let i = 0; i < n && shown < 30; i++) {
      if (ob[i] !== lb[i]) {
        console.log(`  L${i + 1} 线上: ${ob[i].slice(0, 110)}`);
        console.log(`  L${i + 1} 本地: ${lb[i].slice(0, 110)}`);
        shown++;
      }
    }
    if (ob.length !== lb.length) console.log(`  (行数差异: 线上${ob.length} / 本地${lb.length})`);
  }
}
