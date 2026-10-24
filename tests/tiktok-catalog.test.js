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
  assert.match(html, /Your latest five posts/);
  assert.match(html, /latest=rows\.slice\(0,5\)/);
  assert.match(html, /class="tk-catalog-upload" data-video-upload/);
  assert.match(html, /querySelectorAll\('\[data-video-upload\]'\)/);
  assert.match(html, /body=tkOneListPage\(\)/);
  assert.match(html, /data-tv-file/);
  assert.match(html, /data-tv-preview/);
});

test('the one-tab video list includes unsaved catalog entries and places missing videos first', () => {
  const section=html.slice(html.indexOf('function tkListFiles('),html.indexOf('async function tkOneListUpload('));
  const saved={id:'already-saved',kind:'TikTok',data:{tiktokUrl:catalog[0].url,clips:[{filePath:'private.mov'}]}};
  const context={
    S:{links:[]},data:r=>r?.data||{},title:r=>r?.data?.name||'',tkClips:r=>r.data.clips||[],get:()=>null,
    all:kind=>kind==='TikTok'?[saved]:[],tkCatalogRows:()=>catalog.slice(0,3),
    tkCatalogPlan:()=>({create:catalog.slice(1,3).map(entry=>({entry})),update:[],unchanged:[{entry:catalog[0],existing:saved}],review:[]})
  };
  const rows=vm.runInNewContext(section+'\ntkOneListRows()',context);
  assert.equal(rows.length,3);
  assert.equal(rows[0].entry.id,catalog[1].id);
  assert.equal(rows[1].entry.id,catalog[2].id);
  assert.equal(rows[2].record.id,'already-saved');
  assert.equal(rows[2].files.length,1);
});

test('all 38 catalog posts render as regular rows with their own upload control', () => {
  const section=html.slice(html.indexOf('function tkListFiles('),html.indexOf('async function tkOneListUpload('));
  const context={
    S:{links:[],videoFilter:'all',tkSearch:'',tkDirectUploadBusy:'',tkDirectUploadMessage:'',tkAdd:false,tvToolsOpen:false,tkCatalogReview:false},
    VL:{uploadOpen:false},all:()=>[],data:r=>r?.data||{},tkClips:()=>[],
    tkCatalogRows:()=>catalog,tkCatalogPlan:()=>({create:[...catalog].map(entry=>({entry})),update:[],unchanged:[],review:[]}),
    cleanCaptionTitle:x=>String(x||'').split('#')[0].trim(),e:x=>String(x??''),niceDate:x=>x,
    tkCatalogPanel:()=>'',vlUnifiedUploads:()=>'',vlRecoveryPanel:()=>'',creativeStudioPanel:()=>''
  };
  const markup=vm.runInNewContext(section+'\ntkOneListPage()',context);
  assert.equal((markup.match(/data-tv-file=/g)||[]).length,38);
  assert.match(markup,/38<\/strong> need a video/);
  assert.ok(markup.indexOf(catalog[0].url)<markup.indexOf(catalog[5].url),'Newest TikTok appears before older entries');
});

test('direct upload creates only the missing TikTok record and attaches footage to that record', async () => {
  const section=html.slice(html.indexOf('async function tkOneListUpload('),html.indexOf('function tkCheckIds('));
  const row={key:'catalog-'+catalog[0].id,entry:catalog[0],record:null,review:false};
  const actions=[];
  const context={
    S:{tkDirectUploadBusy:'',tkDirectUploadMessage:'',records:[]},
    tkOneListRows:()=>[row],tkCatalogPlan:()=>({create:[{entry:catalog[0]}],unchanged:[],update:[],review:[]}),
    mediaMime:()=> 'video/quicktime',cleanCaptionTitle:()=> 'New Minecraft Post',
    tkCatalogFields:entry=>({name:'New Minecraft Post',postUrl:entry.url}),
    saveRecord:async (kind,data)=>{actions.push(['save',kind]);return {id:'new-tiktok',kind,data}},
    tkAttachVideo:async(id,file)=>actions.push(['attach',id,file.name]),
    tkTitle:()=> 'New Minecraft Post',confirm:()=>true,render:()=>{},showToast:()=>{}
  };
  const upload=vm.runInNewContext(section+'\ntkOneListUpload',context);
  await upload(row.key,{name:'my-build.mov',type:'video/quicktime',size:500000});
  assert.deepEqual(actions,[['save','TikTok'],['attach','new-tiktok','my-build.mov']]);
  assert.equal(context.S.records.length,1);
  assert.equal(context.S.records[0].kind,'TikTok');
  assert.match(context.S.tkDirectUploadMessage,/attached/);
});

test('direct upload reuses saved TikTok and rejects over-limit files before writing', async () => {
  const section=html.slice(html.indexOf('async function tkOneListUpload('),html.indexOf('function tkCheckIds('));
  const saved={id:'existing-tiktok',kind:'TikTok',data:{notes:'Keep my notes'}};
  const row={key:'saved-existing-tiktok',record:saved,entry:null,review:false};
  const actions=[];
  const context={
    S:{tkDirectUploadBusy:'',tkDirectUploadMessage:'',records:[saved]},
    tkOneListRows:()=>[row],mediaMime:()=> 'video/mp4',tkTitle:()=> 'Saved title',
    tkAttachVideo:async(id)=>actions.push(['attach',id]),
    saveRecord:async()=>{throw Error('Must not create another record')},
    confirm:()=>true,render:()=>{},showToast:()=>{}
  };
  const upload=vm.runInNewContext(section+'\ntkOneListUpload',context);
  await upload(row.key,{name:'too-big.mp4',size:26*1024*1024});
  assert.equal(actions.length,0);
  await upload(row.key,{name:'my-video.mp4',size:1024});
  assert.deepEqual(actions,[['attach','existing-tiktok']]);
  assert.equal(context.S.records[0].data.notes,'Keep my notes');
});

test('iPhone Files uploads with a generic MIME type are recognized by video extension', () => {
  const start=html.indexOf('function mediaMime('),end=html.indexOf('async function uploadMedia(',start);
  const mediaMime=vm.runInNewContext(html.slice(start,end)+'\nmediaMime');
  assert.equal(mediaMime({name:'my-video.MOV',type:'application/octet-stream'}),'video/quicktime');
  assert.equal(mediaMime({name:'my-video.mp4',type:''}),'video/mp4');
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
