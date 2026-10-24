const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script data-original="assets\/app\.js">([\s\S]*?)<\/script>/)?.[1];
const snippet=script.slice(script.indexOf('function lorePhotoIds()'),script.indexOf('function worldPhotoUrl('));

test('Lore photos and imported Build Kit images stay out of the general gallery',()=>{
 const lore={id:'lore-1',kind:'Lore',data:{name:'Day One'}};
 const personal={id:'photo-personal',kind:'Photo',data:{name:'My build'}};
 const story={id:'photo-story',kind:'Photo',data:{name:'Story picture'}};
 const imported={id:'photo-imported',kind:'Photo',data:{name:'Day 1',buildKitSource:'100-day-kit'}};
 const cover={id:'photo-cover',kind:'Photo',data:{name:'Cover',buildKitSource:'100-day-kit',buildKitRole:'cover'}};
 const S={records:[lore,personal,story,imported,cover],links:[{from_record_id:lore.id,to_record_id:story.id,link_type:'has_photo'}]};
 const actual=vm.runInNewContext(snippet+'\ngeneralPhotos(S.records.filter(r=>r.kind===\'Photo\')).map(r=>r.id)',{S,data:r=>r.data});
 assert.deepEqual(Array.from(actual),[personal.id]);
 // The records and Lore relationship remain intact for the Lore Book.
 assert.equal(S.records.length,5);
 assert.equal(S.links[0].to_record_id,story.id);
});

test('World photo covers use only snapshots, not Lore pictures',()=>{
 const lore={id:'lore-1',kind:'Lore',data:{}};
 const world={id:'world-1',kind:'World',data:{}};
 const build={id:'build-1',kind:'Build',data:{}};
 const normal={id:'photo-normal',kind:'Photo',data:{filePath:'normal.jpg'}};
 const story={id:'photo-story',kind:'Photo',data:{filePath:'story.jpg'}};
 const S={records:[lore,world,build,normal,story],links:[{from_record_id:lore.id,to_record_id:story.id,link_type:'has_photo'}]};
 const defs={World:[['builds','Builds','build_world','in','Build'],['lore','Lore','lore_world','in','Lore'],['photos','Photos','media_world','in','Photo']],Build:[['photos','Photos','has_photo','out','Photo']]};
 const cx={S,data:r=>r.data,relationDefs:kind=>defs[kind],relatedRecords:(id,def)=>{
   if(id===world.id&&def[0]==='photos')return [normal,story];
   if(id===world.id&&def[0]==='builds')return [build];
   if(id===world.id&&def[0]==='lore')return [lore];
   if(id===build.id&&def[0]==='photos')return [story];
   return [];
 }};
 const result=vm.runInNewContext(snippet+'\nworldPhotoCollection(S.records.find(r=>r.kind===\'World\')).map(r=>r.id)',cx);
 assert.deepEqual(Array.from(result),[normal.id]);
});

test('general Photos and Lore Book interfaces use separate collections',()=>{
 assert.match(script,/records=kind==='Photo'\?generalPhotos\(filterRecords\(kind\)\)/);
 assert.match(script,/kind==='Lore'\?relatedRecords\(r.id,relationDefs\('Lore'\)/);
 assert.match(script,/data-detail="\$\{e\(loreCover.id\)\}"/);
 assert.doesNotThrow(()=>new vm.Script(script));
});
