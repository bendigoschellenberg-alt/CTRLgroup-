const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const catalogScript = fs.readFileSync(path.join(root, 'tiktok-catalog.js'), 'utf8');
const pageScript = html.match(/<script data-original="assets\/app\.js">([\s\S]*?)<\/script>/)?.[1];
const catalogContext = {window:{}};
vm.runInNewContext(catalogScript, catalogContext);
const catalog = catalogContext.window.CTRL_TIKTOK_CATALOG;

test('the latest document has 38 unique posts, including five newer posts without screenshots', () => {
  assert.equal(catalog.length, 38);
  assert.equal(new Set(catalog.map(row => row.id)).size, 38);
  assert.deepEqual([...catalog.slice(0,5)].map(row=>row.id),[
    '7698192262919884050','7698072323273837832','7697793422869957894',
    '7696602629459184903','7696319588383886610'
  ]);
  for (const post of catalog) {
    assert.match(post.id, /^\d{19}$/);
    assert.match(post.url, /^https:\/\/www\.tiktok\.com\/@missistephi\/video\/\d{19}$/);
    assert.match(post.date, /^2026-\d\d-\d\d$/);
    assert.ok(post.caption && post.song);
    if (post.thumbnail) assert.ok(fs.statSync(path.join(root, post.thumbnail)).size > 1000, post.thumbnail);
  }
  assert.equal(catalog.filter(post=>!post.thumbnail).length,5);
  assert.equal(catalog.filter(post=>post.thumbnail).length,33);
  assert.equal(catalog[5].thumbnail,'./tiktok-thumbs/shot-000.jpg');
  assert.equal(catalog.at(-1).thumbnail,'./tiktok-thumbs/shot-032.jpg');
  assert.deepEqual([...catalog].map(p=>p.date),[...catalog].map(p=>p.date).sort().reverse());
});

test('the main app script parses after the additive import', () => {
  assert.ok(pageScript);
  assert.doesNotThrow(() => new vm.Script(pageScript));
  assert.match(html, /data-tk-catalog-save/);
  assert.match(html, /const catalog=r\.kind==='TikTok'/);
});

test('catalog preview fills missing fields without overwriting or resurrecting records', () => {
  const section = html.slice(html.indexOf('function tkCatalogRows()'), html.indexOf('function tkCurated()'));
  const first = catalog[0],second=catalog[1];
  const records = [
    {id:'kept',kind:'TikTok',data:{postUrl:first.url,name:'My chosen title',caption:'My edited caption',song:'',notes:'Keep this!',clips:[{filePath:'private.mov'}]}},
    {id:'archived',kind:'TikTok',archived_at:'2026-10-01',data:{tiktokUrl:second.url,name:'Previously archived'}}
  ];
  const context = {
    window: catalogContext.window,
    S: {records},
    tkPostId: raw => String(raw||'').match(/\/video\/(\d+)/)?.[1]||'',
    tkPostUrl: r => r.data.postUrl||r.data.tiktokUrl||'',
    cleanCaptionTitle: value => String(value||'').replace(/#[\w]+/g,'').trim(),
    TK_SUGGESTED_TITLES: {},
    data: r => r?.data||{},
    e: value => String(value),
    niceDate: value => value,
    sessionValid:()=>true,
    saveRecord:async()=>{},
    showToast:()=>{},
    confirm:()=>false,
    app:{querySelector:()=>null},
    render:()=>{}
  };
  const plan = vm.runInNewContext(section+'\ntkCatalogPlan()',context);
  assert.equal(plan.create.length,36);
  assert.equal(plan.review.length,1);
  assert.equal(plan.update.length,1);
  assert.equal(plan.update[0].value.song,first.song);
  assert.equal(plan.update[0].value.caption,'My edited caption');
  assert.equal(plan.update[0].value.name,'My chosen title');
  assert.equal(plan.update[0].value.notes,'Keep this!');
  assert.equal(plan.update[0].value.clips[0].filePath,'private.mov');
});
