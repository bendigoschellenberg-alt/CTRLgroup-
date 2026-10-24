const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const test=require('node:test');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script data-original="assets\/app\.js">([\s\S]*?)<\/script>/)?.[1];
const helpers=html.slice(html.indexOf('const READABLE_COLUMNS='),html.indexOf('function listPage('));
const safe=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const defs={
 AddOn:[{key:'name',label:'Add-On Name',type:'text',required:true},{key:'creatorName',label:'Creator',type:'text'},{key:'sizeMB',label:'Size (MB)',type:'number'},{key:'category',label:'Category',type:'text'},{key:'notes',label:'Notes',type:'textarea'}],
 World:[{key:'name',label:'World Name',type:'text',required:true},{key:'status',label:'Status',type:'select',options:['Active','Planning']},{key:'theme',label:'Theme',type:'text'},{key:'description',label:'Description',type:'textarea'},{key:'notes',label:'Notes',type:'textarea'}]
};
function context(overrides={}){
 return {
  S:{records:[],links:[],...overrides.S},
  KINDS:{AddOn:{label:'Add-Ons',singular:'Add-On'},World:{label:'Worlds',singular:'World'}},
  CREATOR_KINDS:new Set(['AddOn']),
  fieldDefs:kind=>defs[kind],data:r=>r?.data||{},get:id=>overrides.S?.records?.find(r=>r.id===id)||null,
  title:r=>r?.data?.name||'',e:safe,compactRow:r=>`<p>${safe(r.data.name)}</p>`,
  filterRecords:kind=>(overrides.S?.records||[]).filter(r=>r.kind===kind),
  showToast:()=>{},render:()=>{},
  ...overrides
 };
}

test('table is available on request while the uncluttered list is the default',()=>{
 const records=Array.from({length:41},(_,i)=>({id:`addon-${i}`,kind:'AddOn',data:{name:`Add-on ${i}`,creatorName:'Studio',sizeMB:0.54,category:'Building'}}));
 const cx=context({S:{records}});
 const {list,markup}=vm.runInNewContext(helpers+'\nconst list=readableTable("AddOn", S.records);S.tableModes={AddOn:"table"};({list,markup:readableTable("AddOn", S.records)})',cx);
 assert.match(list,/data-table-view="list" aria-pressed="true"/);
 assert.match(list,/Add-on 40/);
 assert.doesNotMatch(list,/readable-table-scroll/);
 assert.match(markup,/Size \(MB\)/);
 assert.match(markup,/data-inline-open="addon-0"/);
 assert.match(markup,/data-table-page="AddOn"/);
 assert.match(markup,/1–35 of 41/);
 assert.doesNotMatch(markup,/data-inline-open="addon-40"/);
});

test('all defined text fields, including blank notes, are editable on record details',()=>{
 const record={id:'world-1',kind:'World',data:{name:'Pink Wink',description:'My motel'}};
 const cx=context({S:{records:[record]}});
 const markup=vm.runInNewContext(helpers+'\ndetailEditableTable(S.records[0])',cx);
 assert.match(markup,/data-inline-key="name"/);
 assert.match(markup,/data-inline-key="description"/);
 assert.match(markup,/data-inline-key="notes"/);
 assert.match(markup,/＋ Add/);
 assert.match(markup,/editable-field-card/);
 assert.match(markup,/Edit everything/);
});

test('extra fields and contextual tables stay tucked away but can remain expanded',()=>{
 const record={id:'addon-extra',kind:'AddOn',data:{name:'Furniture',sizeMB:30.6,category:'Decoration'}};
 const cx=context({S:{records:[record],recordMoreOpen:{'addon-extra':true},quickDataOpen:{home:true}}});
 const {detail,home}=vm.runInNewContext(helpers+'\n({detail:detailEditableTable(S.records[0]),home:relevantPageTable("home")})',cx);
 assert.match(detail,/more-fields-drawer" data-record-more="addon-extra" open/);
 assert.match(detail,/data-inline-key="sizeMB"/);
 assert.match(home,/quick-data-drawer" open/);
 assert.match(home,/quick reference/);
});

test('editing one text cell preserves all other fields, attached clips, and record identity',async()=>{
 const existing={id:'addon-1',kind:'AddOn',data:{name:'My Blocks',category:'Building',notes:'Important!',sizeMB:0.54,clips:[{filePath:'keep.mov'}],custom_value:'preserve'}};
 const calls=[];
 class FakeFormData{constructor(form){this.form=form}get(){return this.form.value}has(){return true}}
 const cx=context({S:{records:[existing]},FormData:FakeFormData,
  api:async()=>[{...existing,data:{...existing.data,notes:'Updated on my other device'}}],
  saveRecord:async(kind,value,id)=>{calls.push({kind,value,id});return {...existing,data:value}},
 });
 const save=vm.runInNewContext(helpers+'\nsaveInlineField',cx);
 await save({dataset:{inlineId:'addon-1',inlineKey:'category'},value:'Architecture',querySelector:()=>({disabled:false,textContent:''})});
 assert.equal(calls.length,1);
 assert.equal(calls[0].id,'addon-1');
 assert.equal(calls[0].value.category,'Architecture');
 assert.equal(calls[0].value.notes,'Updated on my other device');
 assert.equal(calls[0].value.custom_value,'preserve');
 assert.equal(calls[0].value.clips[0].filePath,'keep.mov');
});

test('numeric editing accepts precise decimals and rejects blank required names',async()=>{
 const record={id:'addon-2',kind:'AddOn',data:{name:'My Blocks',sizeMB:17.9,notes:'Keep'}};
 const calls=[];
 class FakeFormData{constructor(form){this.form=form}get(){return this.form.value}has(){return true}}
 const cx=context({S:{records:[record]},FormData:FakeFormData,api:async()=>[record],saveRecord:async(kind,value,id)=>{calls.push(value);return {...record,data:value}}});
 const save=vm.runInNewContext(helpers+'\nsaveInlineField',cx);
 const form=(key,value)=>({dataset:{inlineId:'addon-2',inlineKey:key},value,querySelector:()=>({disabled:false,textContent:''})});
 await save(form('sizeMB','0.54'));
 await save(form('name',''));
 assert.equal(calls.length,1);
 assert.equal(calls[0].sizeMB,0.54);
 assert.equal(calls[0].notes,'Keep');
});

test('the complete app script still parses and table editing is wired on every rendered page',()=>{
 assert.doesNotThrow(()=>new vm.Script(script));
 assert.match(script,/body\+=relevantPageTable\(S\.page\)/);
 assert.match(script,/querySelectorAll\('\[data-inline-open\]'\)/);
 assert.match(script,/querySelectorAll\('\[data-inline-form\]'\)/);
 assert.match(script,/detailEditableTable\(r\)/);
});
