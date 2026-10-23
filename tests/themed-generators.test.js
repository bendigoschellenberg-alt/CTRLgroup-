const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'themed-generators.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(script, sandbox);
const catalog = sandbox.window.CTRL_THEMES;

const types = [
  'Build Idea', 'Palette', 'Material Combination', 'World Idea', 'World Expansion',
  'Daily Build', 'Weekly Plan', 'Monthly Plan', 'Six-Month Plan', 'Lore',
  'Lore Continuation', 'Mystery', 'Name', 'TikTok Idea', 'TikTok Script',
  'Challenge', 'Craftable Challenge', 'City Block Generators', 'Build Concept',
  'Journal Entry', 'Goal', 'Event', 'Room / Display', 'Concept Description',
  'Location Idea', 'Add-On Showcase', 'Random Fun'
];

test('all 27 generators have 250 unique themed results for every theme', () => {
  assert.equal(catalog.options.length, 27);
  assert.equal(types.length, 27);
  for (const theme of catalog.options) {
    const context = catalog.resolve('Test World', {}, theme.value);
    for (const type of types) {
      const results = catalog.pool(type, context);
      assert.equal(results.length, 250, `${theme.value} / ${type}`);
      assert.equal(new Set(results.map(row => row.key)).size, 250);
      assert.equal(new Set(results.map(row => row.title)).size, 250);
      for (const row of results) {
        assert.ok(row.builtin && row.description.length > 40);
        assert.equal(row.theme, theme.value);
        assert.ok(row.title.length > 10);
      }
    }
  }
});

test('the 26 existing world names select suitable defaults without renaming', () => {
  const choices = {
    'CTRL Group - Main': 'city', 'CTRL Group - Garden District': 'garden',
    'CTRL Group - CUTEKIDS': 'kids', 'CTRL Group - Lights': 'lights',
    'CTRL Group - Mntn side Mansion': 'mountain', 'CTRL Group - Modern Mansion': 'luxury',
    'CTRL Group - CraftablesMain': 'craftables', 'CTRL Group - Things': 'creative',
    'Pink Wink - Main': 'pinkwink', 'Pink Wink - Barbie': 'barbie',
    'Games': 'games', 'Farm Mansion': 'farm', 'Golf Course': 'golf',
    'Gucci': 'fashion', 'Heart House': 'romance', 'Heart House Yard': 'garden',
    'Hello': 'storybook', 'Jam': 'music', 'Mob City': 'mobs',
    'Modern City': 'modern', 'Modern Mayhem': 'chaos', 'Modern X': 'future',
    'Paradise': 'pink', 'Pink Isle': 'island', 'Resort': 'resort', 'Billi': 'playful'
  };
  assert.equal(Object.keys(choices).length, 26);
  for (const [name, theme] of Object.entries(choices)) {
    const context = catalog.resolve(name, {});
    assert.equal(context.name, name);
    assert.equal(context.theme, theme, name);
  }
});

test('theme override changes content without editing the world', () => {
  const before = catalog.resolve('Games', {});
  const after = catalog.resolve('Games', {}, 'garden');
  assert.equal(before.theme, 'games');
  assert.equal(after.theme, 'garden');
  const a = catalog.pool('Build Idea', before)[0];
  const b = catalog.pool('Build Idea', after)[0];
  assert.notEqual(a.title, b.title);
  assert.match(a.description, /Games/);
  assert.match(b.description, /Games/);
});

test('the original app script is valid and the new script is loaded first', () => {
  const start = '<script data-original="assets/app.js">';
  const startPos = html.indexOf(start);
  assert.ok(startPos > 0);
  assert.ok(html.indexOf('<script src="./themed-generators.js"></script>') < startPos);
  const endPos = html.indexOf('</script>', startPos);
  assert.ok(endPos > startPos);
  new vm.Script(html.slice(startPos + start.length, endPos));
  assert.match(html, /Browse \$\{pool\.length\} result options/);
  assert.match(html, /id="gen-theme"/);
});
