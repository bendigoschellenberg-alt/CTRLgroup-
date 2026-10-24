const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script data-original="assets\/app\.js">([\s\S]*?)<\/script>/)?.[1];
const groupsCode=script.slice(script.indexOf('const GROUPS = ['),script.indexOf('// These five legacy libraries'));
const menu=JSON.parse(JSON.stringify(vm.runInNewContext(groupsCode+'\nGROUPS')));
const navCode=script.slice(script.indexOf('const NAV_GROUP_NOTES='),script.indexOf('function sidebarLink('));
const directoryCode=script.slice(script.indexOf('function allPagesPage()'),script.indexOf('/* A presentation-only context picker'));

test('all 44 original sidebar pages remain in their eight established groups',()=>{
 const original=[
  ['MY HQ',['home','NotesTasks','ContentPlanner','today','Event','Journal','Task']],
  ['WORLDS & BUILDS',['World','WorldGroup','Build','Location']],
  ['CTRL GROUP MAIN · CITY',['CityBlock','Avenue','Street']],
  ['CTRL GROUP GARDEN',['GardenTheme','GardenFeature']],
  ['ASSETS',['Packs','PackRecommendations','AddOn','Craftable','WorldTemplate','Texture','CraftableItem','Creator','Material','Block','Palette','Skin','shop','WishlistItem']],
  ['GENERATORS',['generator','GeneratorPrompt']],
  ['MEDIA & STORY',['Photo','Video','Lore']],
  ['EXTRAS',['StructureBlock','CraftablePlacement','CoordinatePin','Tag','fields','RecoveryReview','trash','reconcile','settings']]
 ];
 assert.deepEqual(menu.map(([name,items])=>[name,items.map(([key])=>key)]),original);
 assert.equal(menu.reduce((total,[,items])=>total+items.length,0),44);
});

test('the directory lists every page and the breadcrumb identifies its section',()=>{
 const cx={S:{page:'WorldTemplate'},e:x=>String(x),label:x=>x,header:()=>'<header>All My Pages</header>',pinkIcon:()=>'<svg></svg>',app:null};
 const {place,markup}=vm.runInNewContext(groupsCode+navCode+directoryCode+'\n({place:navPlace(),markup:allPagesPage()})',cx);
 assert.equal(place.group,'ASSETS');
 assert.equal(place.title,'World Templates');
 assert.equal((markup.match(/data-page-directory-item/g)||[]).length,44);
 assert.match(markup,/data-nav="GardenFeature"/);
 assert.match(markup,/data-nav="Lore"/);
 assert.match(markup,/data-nav="settings"/);
 assert.match(markup,/id="page-directory-search"/);
});

test('typing into the directory filters page choices without changing their records',()=>{
 const createGroup=items=>({hidden:false,querySelectorAll:()=>items.map(name=>({dataset:{pageName:name.toLowerCase()},hidden:false}))});
 const garden=[{dataset:{pageName:'garden themes ctrl group garden'},hidden:false},{dataset:{pageName:'garden features ctrl group garden'},hidden:false}];
 const city=[{dataset:{pageName:'big block city ctrl group main'},hidden:false}];
 const groups=[{hidden:false,querySelectorAll:()=>garden},{hidden:false,querySelectorAll:()=>city}];
 const status={textContent:''};
 const app={querySelectorAll:()=>groups,querySelector:()=>status};
 const cx={app,header:()=>'',e:x=>x,pinkIcon:()=>'',S:{page:'allpages'},label:x=>x};
 vm.runInNewContext(groupsCode+navCode+directoryCode+'\nfilterPageDirectory({value:"garden"})',cx);
 assert.equal(garden.every(item=>!item.hidden),true);
 assert.equal(city[0].hidden,true);
 assert.equal(groups[1].hidden,true);
 assert.match(status.textContent,/2 matching pages/);
});

test('routing and sidebar menu remain usable alongside the directory',()=>{
 assert.match(script,/S\.page==='allpages'\)body=allPagesPage\(\)/);
 assert.match(script,/data-all-pages-toggle/);
 assert.match(script,/sidebar-directory-link/);
 assert.match(script,/querySelector\('#page-directory-search'\)\?\.addEventListener\('input'/);
 assert.doesNotThrow(()=>new vm.Script(script));
});
