const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script data-original="assets\/app\.js">([\s\S]*?)<\/script>/)?.[1];
const helpers=script.slice(script.indexOf('function managementActions('),script.indexOf('function categoryOf('));
const escapeHtml=x=>String(x||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

test('collection rows have an obvious edit action and safely tucked-away archive/delete',()=>{
 const record={id:'addon-1',kind:'AddOn',data:{name:'My pink blocks',sizeMB:0.54,category:'Building'}};
 const context={e:escapeHtml,title:r=>r.data.name,data:r=>r.data,CREATOR_KINDS:new Set(),pinkIcon:()=>'<svg></svg>',S:{records:[record]}};
 const {actions,row}=vm.runInNewContext(helpers+'\n({actions:managementActions(S.records[0]),row:compactRow(S.records[0])})',context);
 assert.match(actions,/data-edit="addon-1"/);
 assert.match(actions,/<details class="row-more-actions">/);
 assert.match(actions,/<summary aria-label="More actions for My pink blocks"/);
 assert.match(actions,/data-archive="addon-1"/);
 assert.match(actions,/data-delete="addon-1"/);
 assert.match(row,/0\.54 MB/);
 assert.match(row,/Building/);
});

test('archived entries keep Restore visible while Delete stays in the menu',()=>{
 const record={id:'archived-1',data:{name:'Old texture'},archived_at:'2026-10-01'};
 const result=vm.runInNewContext(helpers+'\nmanagementActions(S.records[0])',{e:escapeHtml,title:r=>r.data.name,S:{records:[record]}});
 assert.match(result,/data-restore-record="archived-1"/);
 assert.match(result,/row-more-menu/);
 assert.match(result,/data-delete="archived-1"/);
 assert.doesNotMatch(result,/data-archive=/);
});

test('home keeps its content tools in an optional drawer and existing shortcuts remain',()=>{
 const home=script.slice(script.indexOf('function homePage()'),script.indexOf('const MANAGED_KINDS='));
 assert.match(home,/hq-studio-drawer/);
 assert.match(home,/data-nav="ContentPlanner"/);
 assert.match(home,/data-nav="Video"/);
 assert.match(home,/homeQuickLaunch\(\)/);
 assert.match(home,/hqDailyFocus\(\)/);
 assert.match(home,/capturePanel\(\)/);
});

test('final visual rules leave the interface readable and keyboard accessible',()=>{
 const css=html.slice(html.indexOf('<style id="ctrl-cohesive-journal-refresh">'));
 assert.match(css,/min-height:44px/);
 assert.match(css,/#app \.compact-list\{overflow:visible!important\}/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/#app \.sidebar\.sidebar-v4/);
 assert.doesNotThrow(()=>new vm.Script(script));
});
