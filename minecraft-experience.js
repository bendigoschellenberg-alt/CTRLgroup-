/* CTRL n crft — searchable Minecraft reference and navigation upgrade.
   Read-only UI: existing Supabase collections and records are never changed. */
(function(){
'use strict';
const DATA=window.CTRL_TIPS;
if(!DATA || DATA.items.length!==260){console.warn('Minecraft tips catalogue missing');return;}
const KEY='ctrlcrft.tips.favourites.v1',state={category:-1,query:'',favouritesOnly:false,limit:40};
const favs=(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return new Set(Array.isArray(v)?v.map(Number).filter(n=>n>=1&&n<=260):[])}catch{return new Set()}})();
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const matches=t=>(state.category<0||t.sectionIndex===state.category)&&(!state.favouritesOnly||favs.has(t.number))&&(!state.query||(t.number+' '+t.section+' '+t.title+' '+t.detail).toLowerCase().includes(state.query));
function saveFavs(){try{localStorage.setItem(KEY,JSON.stringify([...favs].sort((a,b)=>a-b)))}catch{}}
function tipCard(t){
return '<details class="mc-tile"><summary><span class="mc-number">'+t.number+'</span><span class="mc-title"><strong>'+esc(t.title)+'</strong><small>'+esc(t.section)+'</small></span><span class="mc-plus" aria-hidden="true">＋</span></summary>'+
'<div class="mc-detail"><p>'+esc(t.detail)+'</p><div class="mc-actions"><button type="button" data-tip-fav="'+t.number+'" aria-pressed="'+favs.has(t.number)+'">'+(favs.has(t.number)?'♥ Saved':'♡ Save tip')+'</button><button type="button" data-tip-copy="'+t.number+'">Copy tip</button></div></div></details>';
}
function cards(){
const container=document.getElementById('mc-tip-results');if(!container)return;
const found=DATA.items.filter(matches),display=found.slice(0,state.limit);
container.innerHTML=display.length?display.map(tipCard).join(''):'<div class="mc-empty">No matching tips. Try another search or topic.</div>';
const counter=document.getElementById('mc-tip-count');if(counter)counter.textContent=found.length+' matching tips'+(found.length>display.length?' · showing '+display.length:'');
const more=document.getElementById('mc-tip-more');if(more){more.hidden=found.length<=display.length;more.textContent='Show more tips · '+(found.length-display.length)+' remaining'}
document.querySelectorAll('[data-tip-category]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.tipCategory)===state.category)));
const f=document.getElementById('mc-tip-favs');if(f){f.setAttribute('aria-pressed',String(state.favouritesOnly));f.textContent='♥ Favourites ('+favs.size+')'}
}
function page(){
const name=state.category<0?'All 260 tips':DATA.sections[state.category].name;
const btn=(n,label)=>'<button type="button" data-tip-category="'+n+'">'+label+'</button>';
const nav=btn(-1,'All tips')+btn(0,'Commands')+btn(1,'Structure blocks')+btn(2,'City')+btn(4,'Underwater')+btn(18,'Geometry')+btn(19,'Domes');
return '<div class="mc-hq">'+header('Minecraft Tips & Tricks','Your searchable Bedrock Edition building handbook — made for Xbox, CTRL Group, Pink Wink and your underwater city.','<button type="button" class="btn btn-soft" data-nav="World">My Worlds ↗</button>')+
'<div class="mc-hero"><div><span class="mc-eyebrow">HANDY BUILDER REFERENCE</span><h2>Build smarter, not harder ♡</h2><p>All 260 tricks on one page, organised into 21 easy topics. Tap a tip to read it, or save it as a favourite.</p></div><div class="mc-summary"><strong>260</strong><span>Tips</span><strong>21</strong><span>Topics</span></div></div>'+
'<div class="mc-controls"><label for="mc-tip-search">Search the handbook</label><div class="mc-search"><input id="mc-tip-search" type="search" placeholder="Try /clone, domes, 32-block roads, Xbox…" autocomplete="off" value="'+esc(state.query)+'"><button id="mc-tip-reset" type="button">Clear</button></div><div class="mc-pills">'+nav+'<button type="button" id="mc-tip-favs" aria-pressed="'+state.favouritesOnly+'">♥ Favourites ('+favs.size+')</button></div></div>'+
'<details class="mc-topics"><summary>Browse all 21 sections <span aria-hidden="true">⌄</span></summary><div class="mc-topic-grid">'+btn(-1,'All 260 tips')+DATA.sections.map((c,i)=>btn(i,(i+1)+'. '+esc(c.name)+' · '+c.start+'–'+(c.start+c.count-1))).join('')+'</div></details>'+
'<section class="mc-list"><div class="mc-list-heading"><div><span class="mc-eyebrow">QUICK REFERENCE</span><h2>'+esc(name)+'</h2></div><span id="mc-tip-count" aria-live="polite"></span></div><div id="mc-tip-results"></div><button id="mc-tip-more" type="button">More tips</button></section>'+
'<p class="mc-help"><strong>Bedrock on Xbox:</strong> Some commands require cheats or permissions; availability varies by version. Geometry formulas are planning aids. Favourites save on this device, not to the private database.</p></div>';
}
function wire(){
if(!document.getElementById('mc-tip-results'))return;
const search=document.getElementById('mc-tip-search');
search.addEventListener('input',ev=>{state.query=ev.target.value.trim().toLowerCase();state.limit=40;cards()});
document.getElementById('mc-tip-reset').addEventListener('click',()=>{state.category=-1;state.query='';state.favouritesOnly=false;state.limit=40;search.value='';cards()});
document.querySelectorAll('[data-tip-category]').forEach(b=>b.addEventListener('click',()=>{state.category=Number(b.dataset.tipCategory);state.limit=40;cards();document.getElementById('mc-tip-results')?.scrollIntoView({block:'nearest',behavior:'smooth'})}));
document.getElementById('mc-tip-favs').addEventListener('click',()=>{state.favouritesOnly=!state.favouritesOnly;state.limit=40;cards()});
document.getElementById('mc-tip-more').addEventListener('click',()=>{state.limit+=40;cards()});
document.getElementById('mc-tip-results').addEventListener('click',async ev=>{
const b=ev.target.closest('[data-tip-fav]');if(b){const n=Number(b.dataset.tipFav);if(favs.has(n))favs.delete(n);else favs.add(n);saveFavs();cards();return}
const c=ev.target.closest('[data-tip-copy]');if(c){const t=DATA.items[Number(c.dataset.tipCopy)-1];if(t){try{await navigator.clipboard.writeText(t.number+'. '+t.title+'\n'+t.detail);c.textContent='Copied'}catch{c.textContent='Select text to copy'}}}
});
cards();
}
function install(){
if(window.__ctrlTipsInstalled)return;
if(typeof GROUPS==='undefined'||typeof render!=='function'||typeof S==='undefined'||typeof wireApp!=='function'){setTimeout(install,120);return}
window.__ctrlTipsInstalled=true;
if(!GROUPS.some(([,items])=>items.some(([k])=>k==='MinecraftTips'))){
const idx=GROUPS.findIndex(([n])=>n==='EXTRAS');
GROUPS.splice(idx<0?GROUPS.length:idx,0,['BUILDING REFERENCE',[['MinecraftTips','Tips & Tricks','']]]);
}
NAV_GROUP_NOTES['BUILDING REFERENCE']='260 Minecraft tips, commands and geometry guides';
PINK_KIND_ICONS.MinecraftTips='book';
if(!SIDEBAR_FAVOURITES.some(([k])=>k==='MinecraftTips')){
SIDEBAR_FAVOURITES.push(['MinecraftTips','Tips & Tricks']);SIDEBAR_FAV_KEYS.add('MinecraftTips');
}
const prevWire=wireApp;wireApp=function(){prevWire();if(S.page==='MinecraftTips')wire()};
const prevRender=render;render=function(){
if(S.page!=='MinecraftTips'||S.detail||!sessionValid()||(S.loading&&!S.lastLoad))return prevRender();
shell(page());
};
if(typeof lorePhotoIds==='function'){
const prevLoreIds=lorePhotoIds;
lorePhotoIds=function(){const ids=prevLoreIds(),loreIds=new Set(S.records.filter(r=>r.kind==='Lore').map(r=>r.id));
S.links.forEach(l=>{if(l.link_type!=='has_photo')return;if(loreIds.has(l.from_record_id))ids.add(l.to_record_id);if(loreIds.has(l.to_record_id))ids.add(l.from_record_id)});
return ids;};
}
if(typeof homePage==='function'){
const prevHome=homePage;homePage=function(){const markup=prevHome(),link='<section class="mc-home-link"><div><span>BUILDING REFERENCE</span><strong>Minecraft Tips & Tricks · 260 ideas</strong><small>Search a trick, browse the categories or save favourites.</small></div><button type="button" data-nav="MinecraftTips">Open handbook ↗</button></section>';return markup.replace('</header>','</header>'+link)};
}
if(typeof listPage==='function'){
const prevList=listPage;listPage=function(kind){
const out=prevList(kind);
if(kind==='Photo')return '<div class="mc-related">Lore pictures stay in <button type="button" data-nav="Lore">Lore</button>; general Photos shows your other snapshots.</div>'+out;
if(['World','Build','StructureBlock','Avenue','Street','Location'].includes(kind))return '<div class="mc-related">Working on a build? <button type="button" data-nav="MinecraftTips">260 Tips & Tricks ↗</button></div>'+out;
return out;
};
}
const css=document.createElement('link');css.rel='stylesheet';css.href='./minecraft-experience.css?v=20261024';document.head.appendChild(css);
if(location.hash==='#MinecraftTips'&&S.page!=='MinecraftTips')S.page='MinecraftTips';
if(sessionValid())render();
window.CTRL_TIPS_UI={installed:true,tips:DATA.items.length,sections:DATA.sections.length};
}
if(document.readyState==='complete')install();else window.addEventListener('load',install,{once:true});
})();