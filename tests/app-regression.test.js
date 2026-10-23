const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const themed = fs.readFileSync(path.join(__dirname, '..', 'themed-generators.js'), 'utf8');

function line(start) {
  const result = html.split('\n').find(value => value.startsWith(start));
  assert.ok(result, `Missing ${start}`);
  return result;
}
function section(start, end) {
  const left = html.indexOf(start), right = html.indexOf(end, left + start.length);
  assert.ok(left > -1 && right > left, `Could not isolate ${start}`);
  return html.slice(left, right);
}

test('quick entry detects same-name items when one Creator is missing', () => {
  const records = [
    {id: 'a', kind: 'AddOn', data: {name: 'Plenty of Blocks', creatorName: ''}},
    {id: 'b', kind: 'AddOn', data: {name: 'Same Title', creatorName: 'Different Studio'}}
  ];
  const sandbox = {
    all: kind => records.filter(x => x.kind === kind),
    title: r => r.data.name,
    creatorDetails: r => ({name: r.data.creatorName || 'Creator not assigned'}),
    data: r => r.data
  };
  const source = [line('function collectorNormalize('), line('function collectorCreatorName('), line('function collectorAlreadySaved(')].join('\n');
  const find = vm.runInNewContext(source + '\ncollectorAlreadySaved', sandbox);
  assert.equal(find('AddOn', '  plenty OF blocks ', 'Owls Cubed').id, 'a');
  assert.equal(find('AddOn', 'Same Title', 'Different Studio').id, 'b');
  assert.equal(find('AddOn', 'Same Title', 'Another Studio'), null);
});

test('combination warnings include a failed subset but not unrelated combinations', () => {
  const fn = vm.runInNewContext(
    line('function collectorNormalize(') + '\n' +
    section('function comboWarningMatches(', 'function comboSuggestedPanel(') + '\ncomboWarningMatches',
    {comboHistoricItems: d => d.items || []}
  );
  const failed = [{d: {items: [{kind: 'AddOn', id: 'a', name: 'Bricks'}, {kind: 'Craftable', id: 'b', name: 'Mansions'}]}}];
  const larger = [...failed[0].d.items, {kind: 'Texture', id: 'c', name: 'Pink'}];
  assert.equal(fn(larger, failed).length, 1);
  assert.equal(fn([{kind: 'AddOn', id: 'other', name: 'Other'}, larger[2]], failed).length, 0);
  assert.equal(fn([], failed).length, 0);
});

test('clearing a note completes but never deletes its linked Task', async () => {
  const sandbox = {
    S: {records: []},
    all: () => sandbox.S.records,
    data: r => r?.data || {},
    noteOrigin: () => 'My World',
    saveRecord: async (kind, data, id) => ({id: id || 'task-1', kind, data})
  };
  const code = line('function noteTaskForKey(') + '\n' + section('async function syncNoteTask(', 'function savedNotesForHub(');
  const sync = vm.runInNewContext(code + '\nsyncNoteTask', sandbox);
  await sync('record:abc', 'Build a pool');
  assert.equal(sandbox.S.records.length, 1);
  assert.equal(sandbox.S.records[0].data.status, 'To Do');
  await sync('record:abc', '');
  assert.equal(sandbox.S.records.length, 1);
  assert.equal(sandbox.S.records[0].data.status, 'Done');
  assert.equal(sandbox.S.records[0].data.previousNote, 'Build a pool');
  await sync('record:abc', 'Build a bigger pool');
  assert.equal(sandbox.S.records.length, 1);
  assert.equal(sandbox.S.records[0].data.description, 'Build a bigger pool');
  assert.equal(sandbox.S.records[0].data.status, 'To Do');
});

test('themed palette result includes its own actual six block names', () => {
  const sandbox = {window: {}};
  vm.runInNewContext(themed, sandbox);
  const first = sandbox.window.CTRL_THEMES.pool('Palette', sandbox.window.CTRL_THEMES.resolve('Pink Wink - Barbie'))[0];
  assert.equal(first.blocks.length, 6);
  for (const block of first.blocks) assert.ok(first.description.includes(block));
  assert.match(html, /blocks:Array\.isArray\(item\.blocks\)/);
  assert.match(html, /prefill\['block'\+\(i\+1\)\]=block/);
});

test('collection saving and private notes preserve their records', () => {
  const quick = section('async function collectorSave(', 'function worldTemplateRecoveryPage(');
  const note = section('async function savePageNote(', 'function shell(');
  const full = section('async function submitRecord(', 'async function archive(');
  assert.doesNotMatch(quick, /await loadAll\(\)/, 'Quick entry should not reload every record after saving');
  assert.match(note, /syncNoteTask\(key,current\)/);
  assert.match(full, /syncNoteTask\('record:'\+saved\.id,value\.notes\)/);
  assert.match(html, /\$\{pageNotesPanel\(\)\}/, 'Home should have a note panel too');
  assert.match(html, /data-combo-suggestion/);
  assert.match(html, /refreshComboSelection\(\)/, 'Combo choices should update their own panel');
  assert.match(html, /collectorCountText\(kind\)/, 'Collection counts should include active and archived');
  assert.match(html, /vd-entry-poster/);
  assert.doesNotMatch(html, /#FFF8EF/i, 'No cream in the app palette');
});
