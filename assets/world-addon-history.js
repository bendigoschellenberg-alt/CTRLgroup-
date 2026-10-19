/* Dated World add-on combinations — keeps prior setups in World.data. */
(function(){
'use strict';
if(typeof detailPage!=='function'||typeof saveWorldLinkPicker!=='function')return;
const oldDetail=detailPage,oldWire=wireApp,oldPicker=saveWorldLinkPicker,oldSaveLinks=saveLinks,oldCapture=captureExecuteAction,oldCaptureWorld=captureLinkToWorld,oldEnsure=ensureKitLink;
const date=()=>new Date().toLocaleDateString('en-CA');
const hist=w=>Array.isArray(data(w)?.addonLoadoutHistory)?data(w).addonLoadoutHistory:[];
const sig=items=>(items||[]).map(a=>a.id).sort().join('|');
function items(wid){const d=relationDefs('World').find(x=>x[0]==='addons');return d?unique(relatedIDs(wid,d)).map(get).filter(r=>r?.kind==='AddOn'&&!r.archived_at).map(r=>({id:r.id,name:title(r),creator:creatorName(r)||''})).sort((a,b)=>a.name.localeCompare(b.name)):[]}
async function saveSnapshot(wid,addons,label,used=date(),source='auto',force=false){
 const w=get(wid);if(!w||w.kind!=='World')throw Error('World unavailable');
 const list=hist(w);if(!force&&list.length&&sig(list.at(-1).addons)===sig(addons))return;
 const entry={id:crypto.randomUUID(),date:used,label,recordedAt:new Date().toISOString(),source,addons:addons.map(x=>({id:x.id,name:x.name,creator:x.creator||''}))};
 const saved=await saveRecord('World',{...data(w),addonLoadoutHistory:[...list,entry]},wid);
 S.records=S.records.map(r=>r.id===wid?saved:r);
}
async function before(wid){
 const w=get(wid);if(!w)return;
 const current=items(wid),last=hist(w).at(-1);
 if(!last||sig(last.addons)!==sig(current))await saveSnapshot(wid,current,'Starting setup — first recorded today',date(),'baseline');
}
async function after(wid){try{await saveSnapshot(wid,items(wid),'Add-ons changed')}catch(err){showToast('Add-on history not saved: '+err.message)}}
function panel(w){
 const current=items(w.id),old=hist(w).slice().reverse(),mode=S._history?.wid===w.id?S._history.mode:'';
 const selected=new Set(mode==='current'?current.map(a=>a.id):[]);
 return `<section class="panel wh-panel"><div class="wh-head"><h2>Previous add-on combinations</h2><small>${old.length} saved</small></div><p class="subcopy">Dated snapshots belong to this World. Changing active add-ons won't erase saved setups.</p>
 <div class="wh-actions"><button class="btn btn-primary btn-small" data-wh-open="${e(w.id)}" data-wh-mode="current">Save current setup</button><button class="btn btn-soft btn-small" data-wh-open="${e(w.id)}" data-wh-mode="past">Record older setup</button></div>
 ${mode?`<form id="wh-form" data-wid="${e(w.id)}"><div class="wh-fields"><label>Date used<input name="used" type="date" max="${e(date())}" value="${e(date())}" required></label><label>Name<input name="label" placeholder="e.g. Motel version 1" maxlength="120"></label></div>
 <details ${mode==='past'?'open':''}><summary>Select add-ons in this combination</summary><div class="wh-checks">${all('AddOn').slice().sort((a,b)=>title(a).localeCompare(title(b))).map(a=>`<label><input type="checkbox" name="pack" value="${e(a.id)}" ${selected.has(a.id)?'checked':''}>${e(title(a))}</label>`).join('')}</div></details>
 <p class="hint">This saves a copy; it does not change any active links.</p><button class="btn btn-primary" type="submit">Save dated setup</button><button type="button" class="btn btn-soft" id="wh-cancel">Cancel</button></form>`:''}
 <div class="wh-list">${old.length?old.map(x=>`<details class="wh-entry"><summary><strong>${e(x.date)}</strong><span>${e(x.label)}</span><small>${(x.addons||[]).length} packs</small></summary><div class="wh-packs">${(x.addons||[]).length?x.addons.map(a=>`<div><strong>${e(a.name)}</strong>${a.creator?`<small>${e(a.creator)}</small>`:''}</div>`).join(''):'None'}</div></details>`).join(''):'<p class="subcopy">No saved combinations yet. Save a current or older setup using its real date.</p>'}</div></section>`;
}
detailPage=function(){const result=oldDetail(),w=findDetail();return w?.kind==='World'&&!w.archived_at?result+panel(w):result};
wireApp=function(){oldWire();
 app.querySelectorAll('[data-wh-open]').forEach(b=>b.addEventListener('click',()=>{S._history={wid:b.dataset.whOpen,mode:b.dataset.whMode};render();app.querySelector('#wh-form')?.scrollIntoView({block:'nearest',behavior:'smooth'})}));
 app.querySelector('#wh-cancel')?.addEventListener('click',()=>{S._history=null;render()});
 app.querySelector('#wh-form')?.addEventListener('submit',async ev=>{
  ev.preventDefault();if(S.busy)return;const f=ev.target,wid=f.dataset.wid,fd=new FormData(f),used=String(fd.get('used')||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(used)||used>date())return showToast('Choose a valid date');
  const addons=[];for(const id of unique(fd.getAll('pack').map(String))){const r=get(id);if(!r||r.kind!=='AddOn')return showToast('One add-on is missing');addons.push({id,name:title(r),creator:creatorName(r)||''})}
  S.busy=true;try{await saveSnapshot(wid,addons,String(fd.get('label')||'').trim()||'Saved setup',used,'manual',true);S._history=null;showToast('Add-on combination saved ♡')}catch(err){showToast(err.message)}finally{S.busy=false;render()}
 });
};
saveWorldLinkPicker=async function(){
 const m=S.modal,wid=m?.defKey==='addons'&&m?.type==='world-links'?m.worldId:null;
 const d=wid?relationDefs('World').find(x=>x[0]==='addons'):null,old=wid?relatedIDs(wid,d).filter(id=>get(id)&&!get(id).archived_at):[];
 const changed=wid&&sig(old.map(id=>({id})))!==sig((m.chosen||[]).map(id=>({id})));
 if(changed)await before(wid);
 try{return await oldPicker()}finally{if(changed){await after(wid);render()}}
};
saveLinks=async function(id,kind){
 const worldIds=kind==='World'?[id]:kind==='AddOn'?unique([...(S.selection.worlds||[]),...relatedIDs(id,relationDefs('AddOn').find(x=>x[0]==='worlds'))]):[];
 const changed=worldIds.filter(wid=>{const w=get(wid);if(!w||w.kind!=='World')return false;const active=items(wid).map(a=>a.id);const wanted=kind==='World'?(S.selection.addons||[]):(S.selection.worlds||[]).includes(wid)?unique([...active,id]):active.filter(x=>x!==id);return sig(active.map(id=>({id})))!==sig(wanted.map(id=>({id})))});
 for(const w of changed)await before(w);
 try{return await oldSaveLinks(id,kind)}finally{for(const w of changed)await after(w)}
};
captureExecuteAction=async function(row){const item=captureActionPickItem(row),other=row.operation==='status'?null:captureActionPickTarget(row),rel=item&&other?captureActionRelation(item,other):null,wid=rel?.type==='uses_addon'?rel.from:null;if(wid)await before(wid);try{return await oldCapture(row)}finally{if(wid)await after(wid)}};
captureLinkToWorld=async function(r,wid){const track=r?.kind==='AddOn'&&wid;if(track)await before(wid);try{return await oldCaptureWorld(r,wid)}finally{if(track)await after(wid)}};
ensureKitLink=async function(from,to,type){if(type==='uses_addon')await before(from);try{return await oldEnsure(from,to,type)}finally{if(type==='uses_addon')await after(from)}};
const style=document.createElement('style');style.textContent='.wh-panel{margin-top:15px;background:#fff9f2;border:1px solid #ebc3d2;border-radius:16px;padding:16px}.wh-head,.wh-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:9px}.wh-head h2{font-size:23px;color:#92476a;margin:0}.wh-actions{justify-content:flex-start;margin:13px 0}.wh-actions button{min-height:44px}#wh-form{display:grid;gap:11px;border:1px solid #eed2dd;border-radius:12px;padding:12px;background:white}.wh-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}.wh-fields label{display:grid;gap:4px;font-size:13px;font-weight:800}.wh-fields input{width:100%;min-width:0;padding:9px;font-size:16px;border:1px solid #e4b7cb;border-radius:9px}.wh-checks{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));max-height:240px;overflow:auto;gap:7px;margin-top:10px}.wh-checks label{display:flex;align-items:center;gap:7px;font-size:13px}.wh-checks input{width:18px;height:18px;flex:none;accent-color:#ff5b9a}.wh-list{display:grid;gap:8px;margin-top:15px}.wh-entry{border:1px solid #efc8d7;background:#fff;border-radius:11px;padding:11px}.wh-entry summary{display:flex;flex-wrap:wrap;gap:8px;align-items:center;cursor:pointer}.wh-entry summary span{flex:1;min-width:100px}.wh-entry summary strong{color:#ac4b78}.wh-packs{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:7px;margin:12px 0}.wh-packs div{background:#fff8ea;border-radius:8px;padding:8px;display:grid;gap:3px}.wh-packs small{color:#856478}@media(max-width:600px){.wh-fields{grid-template-columns:1fr}.wh-checks{grid-template-columns:1fr}}';
document.head.appendChild(style);
if(typeof sessionValid==='function'&&sessionValid())render();
})();
